
let currentRoom = JSON.parse(localStorage.getItem('currentRoom'));
document.getElementById('room-title').textContent = currentRoom.name;
