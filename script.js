//Buscar JS
async function carregarDatabase() {
  const response = await fetch('database.json');
  const database = await response.json();

  console.log(database);

  return database;
}

carregarDatabase();
// ======================
// TELAS
// ======================

const authScreen = document.getElementById("auth-screen");
const dashboardScreen = document.getElementById("dashboard-screen");
const roomScreen = document.getElementById("room-screen");
let currentUser = null;
let currentRoom = null;


let database = {
  users: [],
  rooms: []
};

async function loadDatabase() {
  const response = await fetch("database.json");
  database = await response.json();
}

loadDatabase();

function showScreen(screen) {
  authScreen.classList.remove("active");
  dashboardScreen.classList.remove("active");
  roomScreen.classList.remove("active");

  screen.classList.add("active");
}

// ======================
// LOGIN

document.getElementById("login-btn").addEventListener("click", async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

      const response = await fetch("database.json");
      const database = await response.json();

      const user = database.users.find(
        u => u.email === email
    );

      if (!existingUser) {
          alert("Usuário não encontrado");
          return;
      }

      if (existingUser.password !== password) {
          alert("Senha incorreta");
          return;
      }

      currentUser = user;

      alert("Login realizado com sucesso!");

      // Exemplo: trocar de tela
      document
          .getElementById("auth-screen")
          .classList.remove("active");

      document
          .getElementById("dashboard-screen")
          .classList.add("active");

  } catch (error) {

      console.error(error);
      alert("Erro ao carregar database.json");

  }

});

// ======================
// LOGOUT
// ======================

document.getElementById("logout-btn").addEventListener("click", () => {
  console.log("Sair")
  currentUser = null;
  showScreen(authScreen);
});

// ======================
function calculateBalances(room) {
  const balances = {};

  room.participants.forEach(person => {
      balances[person] = 0;
  });

  let total = 0;

  room.expenses.forEach(expense => {
      total += expense.value;
      balances[expense.paidBy] += expense.value;
  });

  const share = total / room.participants.length;

  const result = {};

  room.participants.forEach(person => {
      result[person] = balances[person] - share;
  });

  return result;
}

//QUEM PAGA PARA QUEM
function generateTransfers(room) {
  const balances = calculateBalances(room);

  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([name, balance]) => {

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

  while (d < debtors.length && c < creditors.length) {

      const value = Math.min(
          debtors[d].amount,
          creditors[c].amount
      );

      transfers.push(
          `${debtors[d].name} deve pagar R$ ${value.toFixed(2)} para ${creditors[c].name}`
      );

      debtors[d].amount -= value;
      creditors[c].amount -= value;

      if (debtors[d].amount <= 0.01) d++;
      if (creditors[c].amount <= 0.01) c++;
  }

  return transfers;
}

//RESULTADO FINAL

function updateSummary(room) {

  const summaryDiv = document.getElementById("summary");

  const transfers = generateTransfers(room);

  if (transfers.length === 0) {
      summaryDiv.innerHTML = "<p>Todas as contas estão equilibradas.</p>";
      return;
  }

  summaryDiv.innerHTML = transfers
      .map(item => `<p>${item}</p>`)
      .join("");
}