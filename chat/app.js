const socket = io('ws://localhost:3500');

const msgInput = document.querySelector('#message');
const nameInput = document.querySelector('#name');
const chatRoom = document.querySelector('#room');
const activity = document.querySelector('.activity');
const usersList = document.querySelector('.user-list');
const roomList = document.querySelector('.room-list');
const chatDisplay = document.querySelector('.chat-display');

function sendMessage(e) {
    e.preventDefault();
    if (nameInput.value.trim() && msgInput.value.trim() && chatRoom.value.trim()) {
        socket.emit('message', {
            name: nameInput.value.trim(),
            text: msgInput.value.trim(),
        });
        msgInput.value = "";
    }
    msgInput.focus();
}

function enterRoom(e) {
    e.preventDefault();
    if (nameInput.value.trim() && chatRoom.value.trim()) {
        socket.emit('enterRoom', {
            name: nameInput.value.trim(),
            room: chatRoom.value.trim(),
        });
    }
}

document.querySelector('.form-msg').addEventListener('submit', sendMessage);
document.querySelector('.form-join').addEventListener('submit', enterRoom);

msgInput.addEventListener('keypress', () => {
    if (nameInput.value.trim()) {
        socket.emit('activity', nameInput.value.trim());
    }
});

// Listen for incoming messages
socket.on('message', (data) => {
    console.log(data,"==>message data");
    
    activity.textContent = "";
    const { name, text, time } = data;
    const li = document.createElement('li');
    li.className = 'post';

    if (name === nameInput.value.trim()) {
        li.className = 'post post--left';
    } else if (name !== 'Admin') {
        li.className = 'post post--right';
    }

    if (name !== 'Admin') {
        li.innerHTML = `
            <div class="post__header ${name === nameInput.value.trim() ? 'post__header--user' : 'post__header--reply'}">
                <span class="post__header--name">${name}</span> 
                <span class="post__header--time">${time}</span> 
            </div>
            <div class="post__text">${text}</div>
        `;
    } else {
        li.innerHTML = `<div class="post__text">${text}</div>`;
    }

    chatDisplay.appendChild(li);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

// Typing activity
let activityTimer;
socket.on('activity', (name) => {
    activity.textContent = `${name} is typing...`;

    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
        activity.textContent = "";
    }, 3000);
});

// Updating user list
socket.on('userList', ({ users }) => {
    showUsers(users);
});

// Updating room list
socket.on('roomList', ({ rooms }) => {
    showRooms(rooms);
});

function showUsers(users) {
    usersList.textContent = '';
    if (users && users.length) {
        usersList.innerHTML = `<em>Users in ${chatRoom.value.trim()}:</em> `;
        users.forEach((user, index) => {
            usersList.innerHTML += `${user.name}`;
            if (index !== users.length - 1) {
                usersList.innerHTML += ", ";
            }
        });
    }
}

function showRooms(rooms) {
    roomList.textContent = '';
    if (rooms && rooms.length) {
        roomList.innerHTML = '<em>Active Rooms:</em> ';
        rooms.forEach((room, index) => {
            roomList.innerHTML += `${room}`;
            if (index !== rooms.length - 1) {
                roomList.innerHTML += ", ";
            }
        });
    }
}
