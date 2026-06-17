// Banco Local
if (!localStorage.getItem("database")) {
    localStorage.setItem("database", JSON.stringify({
        users: [],
        rooms: []
    }));
}

function loadDatabase() {
    return JSON.parse(localStorage.getItem("database"));
}

function saveDatabase(database) {
    localStorage.setItem(
        "database",
        JSON.stringify(database)
    );
}

let currentUser = null;
let currentRoom = null;

// Telas
const authScreen =
    document.getElementById("auth-screen");

const dashboardScreen =
    document.getElementById("dashboard-screen");

const roomScreen =
    document.getElementById("room-screen");

function showScreen(screen) {


    authScreen.classList.remove("active");
    dashboardScreen.classList.remove("active");
    roomScreen.classList.remove("active");

    screen.classList.add("active");


}

// Cadastro
document.getElementById("register-btn")
    .addEventListener("click", () => {


        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const database = loadDatabase();

        database.users.push({
            id: Date.now(),
            email,
            password
        });

        saveDatabase(database);

        alert("Usuário cadastrado!");


    });

// Login
document.getElementById("login-btn")
    .addEventListener("click", () => {

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const database = loadDatabase();

        const user =
            database.users.find(
                u =>
                    u.email === email &&
                    u.password === password
            );

        if (!user) {
            alert("Login inválido");
            return;
        }

        currentUser = user;

        renderRooms();

        showScreen(dashboardScreen);


    });

// Criar sala
document.getElementById("create-room-btn")
    .addEventListener("click", () => {

        const roomName =
            document.getElementById("room-name").value;

        const database = loadDatabase();

        database.rooms.push({
            id: Date.now(),
            name: roomName,
            participants: [],
            expenses: []
        });

        saveDatabase(database);

        renderRooms();

    });

function renderRooms() {
    const database = loadDatabase();
    const list = document.getElementById("rooms-list");
    list.innerHTML = "";
    database.rooms.forEach(room => {
    const li = document.createElement("li");
        li.textContent = room.name;
        li.addEventListener("click", () => {
            currentRoom = room;
            openRoom();
        });
        list.appendChild(li);
    });

}

function openRoom() {
    document.getElementById("room-title").textContent = currentRoom.name;
    renderParticipants();
    renderExpenses();
    updateSummary(currentRoom);
    showScreen(roomScreen);

}

// Participantes
document.getElementById("add-participant-btn")
    .addEventListener("click", () => {
        const name = document.getElementById("participant-name").value;
        currentRoom.participants.push(name);
        updateRoom();
    });

// Despesas
document.getElementById("add-expense-btn")
    .addEventListener("click", () => {
        currentRoom.expenses.push({
            description:
                document.getElementById(
                    "expense-description"
                ).value,

            value: Number(
                document.getElementById(
                    "expense-value"
                ).value
            ),

            paidBy:
                document.getElementById(
                    "expense-paid-by"
                ).value
        });

        updateRoom();


    });

function updateRoom() {
    const database = loadDatabase();
    const index =
        database.rooms.findIndex(
            r => r.id === currentRoom.id
        );

    database.rooms[index] =
        currentRoom;

    saveDatabase(database);
    renderParticipants();
    renderExpenses();
    updateSummary(currentRoom);
}

function renderParticipants() {
    const ul =
        document.getElementById(
            "participants-list"
        );

    ul.innerHTML = "";

    const select =
        document.getElementById(
            "expense-paid-by"
        );

    select.innerHTML = "";

    currentRoom.participants
        .forEach(person => {

            const li =
                document.createElement("li");

            li.textContent = person;

            ul.appendChild(li);

            const option =
                document.createElement("option");

            option.value = person;
            option.textContent = person;

            select.appendChild(option);
        });
}

function renderExpenses() {
    const ul = document.getElementById("expenses-list");
    ul.innerHTML = "";
    currentRoom.expenses
        .forEach(expense => {
            const li =
                document.createElement("li");
            li.textContent =
                `${expense.description}
    - R$ ${expense.value}
    (${expense.paidBy})`;

            ul.appendChild(li);
        });
}
// Cálculos
function calculateBalances(room) {
    const balances = {};
    room.participants.forEach(
        p => balances[p] = 0
    );

    let total = 0;

    room.expenses.forEach(exp => {

        total += exp.value;

        balances[exp.paidBy] += exp.value;
    });

    const share =
        total / room.participants.length;

    const result = {};

    room.participants.forEach(p => {

        result[p] =
            balances[p] - share;
    });

    return result;


}

function generateTransfers(room) {


    const balances =
        calculateBalances(room);

    const debtors = [];
    const creditors = [];

    Object.entries(balances)
        .forEach(([name, balance]) => {

            if (balance < 0) {
                debtors.push({
                    name,
                    amount: Math.abs(balance)
                });
            }

            if (balance > 0) {
                creditors.push({
                    name,
                    amount: balance
                });
            }
        });

    const transfers = [];

    let d = 0;
    let c = 0;

    while (
        d < debtors.length &&
        c < creditors.length
    ) {

        const value =
            Math.min(
                debtors[d].amount,
                creditors[c].amount
            );

        transfers.push(
            `${debtors[d].name}
    deve pagar
    R$ ${value.toFixed(2)}
    para
    ${creditors[c].name}`
        );

        debtors[d].amount -= value;
        creditors[c].amount -= value;

        if (debtors[d].amount <= 0.01) d++;
        if (creditors[c].amount <= 0.01) c++;
    }

    return transfers;


}

function updateSummary(room) {


    const summary =
        document.getElementById("summary");

    const transfers =
        generateTransfers(room);

    summary.innerHTML =
        transfers
            .map(t => `<p>${t}</p>`)
            .join("");


}

document.getElementById("back-btn")
    .addEventListener("click", () => {
        showScreen(dashboardScreen);
    });

document.getElementById("logout-btn")
    .addEventListener("click", () => {
        currentUser = null;
        showScreen(authScreen);
    });
