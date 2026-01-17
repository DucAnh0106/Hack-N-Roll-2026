// Connect to the backend server via Socket.IO
const socket = io('http://localhost:3000', {
    query: {
        type: 'dashboard'
    }
});

// Get DOM elements
const statusBox = document.getElementById('status-box');
const statusText = statusBox.querySelector('.status-text');
const thiefDisplay = document.getElementById('thief-display');
const roastButtons = document.querySelectorAll('.button-grid button');

// Listen for connection
socket.on('connect', () => {
    console.log('Connected to server');
});

// Listen for alert from server (when ESP32 detects motion)
socket.on('alert', (data) => {
    console.log('Alert received:', data.message);
    updateStatus(true); // Switch to danger mode
});

// Listen for initial status on connection
socket.on('status', (data) => {
    console.log('Initial status:', data.lifted);
    updateStatus(data.lifted);
});

// Function to update status display
function updateStatus(isDanger) {
    if (isDanger) {
        statusBox.className = 'danger';
        statusText.textContent = 'THIEF DETECTED!';
    } else {
        statusBox.className = 'safe';
        statusText.textContent = 'ALL CLEAR';
    }
}

// Function to update camera feed (for future use)
function updateCameraFeed(imageUrl) {
    if (imageUrl) {
        thiefDisplay.innerHTML = `<img src="${imageUrl}" alt="Thief captured" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
    } else {
        thiefDisplay.innerHTML = '<span>Waiting for thief...</span>';
    }
}

// Add click handlers to roast buttons
roastButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const roastType = index + 1;
        console.log(`Roast #${roastType} button clicked!`);
        
        // Emit roast event to server
        socket.emit('roast', { roastType });
    });
});

// Handle disconnection
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});