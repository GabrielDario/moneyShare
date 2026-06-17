
if (!localStorage.getItem('users')) {
    const initialDatabase = {
        users: [
            {
                id: 1,
                name: "Gabriel",
                email: "gabriel@email.com",
                password: "123"
            }
        ],
        rooms: [
            {
                id: 1
            }
        ]
    };

    localStorage.setItem("users",JSON.stringify(initialDatabase.users));
    localStorage.setItem("rooms",JSON.stringify(initialDatabase.rooms));
}
function loadDatabase() {
    return JSON.parse(localStorage.getItem('users'));
}
function saveRoom(db) {
    localStorage.setItem('database', JSON.stringify(db));
}
