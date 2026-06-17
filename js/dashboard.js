if (!localStorage.getItem('currentUser')) location.href = 'index.html';
function renderRooms() {
    const roomsList =
        document.getElementById("rooms-list");

    const db = loadDatabase();
    roomsList.innerHTML = '';

    db.rooms.forEach(room => {
        const li = document.createElement("li");
        li.textContent = room.name;
        roomsList.appendChild(li);
    });

}
renderRooms();

document.getElementById('create-room-btn').onclick = () => {
    console.log('CRIAR SALA...')
    const db = loadDatabase();
    db.rooms.push({ id: Date.now(), name: document.getElementById('room-name').value, participants: [], expenses: [] });
    saveDatabase(db);
    renderRooms();
};
document.getElementById('logout-btn').onclick = () => {
    localStorage.removeItem('currentUser');
    location.href = 'index.html';
};
