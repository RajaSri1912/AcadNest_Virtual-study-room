import express from 'express'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'

// Path handling
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Constants
const PORT = process.env.PORT || 3500
const ADMIN = 'Admin'

// Initialize express app
const app = express()
app.use(express.static(path.join(__dirname, 'public')))

// Start server
const expressServer = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

// Initialize socket server
// const io = new Server(expressServer, {
//     cors: {
//         origin: process.env.NODE_ENV === 'production'
//             ? false
//             : ["http://localhost:5500", "http://127.0.0.1:5500"],
//     },
// })
const io = new Server(expressServer, {
    cors: {
        origin: '*',   // Accept requests from ANY origin
        methods: ['GET', 'POST'],  // Allow these methods (optional but good to specify)
    },
})


// State for users
const UsersState = {
    users: [],
    setUsers(newUsersArray) {
        this.users = newUsersArray
    },
}

// On connection
io.on('connection', socket => {
    console.log(`User ${socket.id} connected`)

    // Send welcome message to the connected user
    socket.emit('message', buildMsg(ADMIN, "Welcome to Chat App!"))

    // When user enters a room
    socket.on('enterRoom', ({ name, room }) => {
        const prevRoom = getUser(socket.id)?.room

        // Leave previous room if exists
        if (prevRoom) {
            socket.leave(prevRoom)
            io.to(prevRoom).emit('message', buildMsg(ADMIN, `${name} has left the room`))
        }

        // Activate the user in new room
        const user = activateUser(socket.id, name, room)

        if (prevRoom) {
            io.to(prevRoom).emit('userList', {
                users: getUsersInRoom(prevRoom),
            })
        }

        // Join new room
        socket.join(user.room)

        // To newly joined user
        socket.emit('message', buildMsg(ADMIN, `You have joined the ${user.room} chat room`))

        // Broadcast to others in room
        socket.broadcast.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has joined the room`))

        // Update user list in room
        io.to(user.room).emit('userList', {
            users: getUsersInRoom(user.room),
        })

        // Update all rooms list
        io.emit('roomList', {
            rooms: getAllActiveRooms(),
        })
    })

    // When user sends a message
    socket.on('message', ({ name, text }) => {
        const room = getUser(socket.id)?.room
        if (room) {
            io.to(room).emit('message', buildMsg(name, text))
        }
    })

    // When user is typing
    socket.on('activity', (name) => {
        const room = getUser(socket.id)?.room
        if (room) {
            socket.broadcast.to(room).emit('activity', name)
        }
    })

    // On disconnect
    socket.on('disconnect', () => {
        const user = getUser(socket.id)
        userLeavesApp(socket.id)

        if (user) {
            io.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has left the room`))
            io.to(user.room).emit('userList', {
                users: getUsersInRoom(user.room),
            })
            io.emit('roomList', {
                rooms: getAllActiveRooms(),
            })
        }

        console.log(`User ${socket.id} disconnected`)
    })
})


// Helper functions

function buildMsg(name, text) {
    return {
        name,
        text,
        time: new Intl.DateTimeFormat('default', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        }).format(new Date()),
    }
}

function activateUser(id, name, room) {
    const user = { id, name, room }
    UsersState.setUsers([
        ...UsersState.users.filter(user => user.id !== id),
        user,
    ])
    return user
}

function userLeavesApp(id) {
    UsersState.setUsers(
        UsersState.users.filter(user => user.id !== id)
    )
}

function getUser(id) {
    return UsersState.users.find(user => user.id === id)
}

function getUsersInRoom(room) {
    return UsersState.users.filter(user => user.room === room)
}

function getAllActiveRooms() {
    return Array.from(new Set(UsersState.users.map(user => user.room)))
}
