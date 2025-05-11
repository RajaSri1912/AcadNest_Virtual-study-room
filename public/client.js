const socket = io();

let peerConnection;
let dataChannel;
let connectedUserId = null;

// ICE servers (help to find path for connection)
const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

// Get list of users
socket.emit('get-users');

socket.on('users', users => {
    console.log('Connected users:', users);
    if (users.length > 0) {
        connectedUserId = users[0]; // Connect to first available user
    }
});

document.getElementById('connectBtn').onclick = () => {
    if (!connectedUserId) {
        alert('No user to connect!');
        return;
    }

    // Create PeerConnection
    peerConnection = new RTCPeerConnection(configuration);

    // Create data channel for chat
    dataChannel = peerConnection.createDataChannel('chat');

    dataChannel.onmessage = event => {
        const msg = event.data;
        displayMessage('Peer: ' + msg);
    };

    // ICE Candidate handler
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.emit('signal', {
                to: connectedUserId,
                signal: { candidate: event.candidate }
            });
        }
    };

    // Create offer
    peerConnection.createOffer()
        .then(offer => {
            peerConnection.setLocalDescription(offer);
            socket.emit('signal', {
                to: connectedUserId,
                signal: { offer }
            });
        });
};

// Handle incoming signal
socket.on('signal', async data => {
    if (!peerConnection) {
        peerConnection = new RTCPeerConnection(configuration);

        peerConnection.ondatachannel = event => {
            dataChannel = event.channel;
            dataChannel.onmessage = e => displayMessage('Peer: ' + e.data);
        };

        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('signal', {
                    to: data.from,
                    signal: { candidate: event.candidate }
                });
            }
        };
    }

    if (data.signal.offer) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket.emit('signal', {
            to: data.from,
            signal: { answer }
        });
    } else if (data.signal.answer) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal.answer));
    } else if (data.signal.candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.signal.candidate));
    }
});

// Send message over data channel
document.getElementById('sendBtn').onclick = () => {
    const msg = document.getElementById('messageInput').value;
    dataChannel.send(msg);
    displayMessage('You: ' + msg);
    document.getElementById('messageInput').value = '';
};

// Display chat message
function displayMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const p = document.createElement('p');
    p.innerText = message;
    messagesDiv.appendChild(p);
}
