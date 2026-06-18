document.addEventListener('DOMContentLoaded', () => {
    checkAuth(); // Verifica se está logado
    renderRooms();

    const form = document.getElementById('create-room-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const roomName = document.getElementById('room-name').value.trim();
        const loggedUser = getLoggedUser();

        const db = getDB();
        
        // Nova Sala estruturada corretamente
        const newRoom = {
            id: 'room_' + Date.now(),
            name: roomName,
            createdBy: loggedUser.email,
            participants: [loggedUser.email], // Criador entra automaticamente
            expenses: []
        };

        db.rooms.push(newRoom);
        saveDB(db);
        form.reset();
        renderRooms();
    });
});

function renderRooms() {
    const loggedUser = getLoggedUser();
    const db = getDB();
    const listContainer = document.getElementById('rooms-list');
    listContainer.innerHTML = '';

    // Filtra as salas que o usuário participa
    const myRooms = db.rooms.filter(r => r.participants.includes(loggedUser.email));

    if (myRooms.length === 0) {
        listContainer.innerHTML = '<p style="color:var(--text-muted)">Você não participa de nenhuma sala ainda.</p>';
        return;
    }

    myRooms.forEach(room => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div>
                <strong>${room.name}</strong>
                <div style="font-size:12px; color:var(--text-muted)">${room.participants.length} participante(s)</div>
            </div>
            <button style="width:auto; padding: 6px 14px;" onclick="goToRoom('${room.id}')">Entrar</button>
        `;
        listContainer.appendChild(div);
    });
}

function goToRoom(roomId) {
    // Passa o ID da sala pela URL para a próxima tela capturar
    window.location.href = `room.html?id=${roomId}`;
}