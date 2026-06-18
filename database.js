/**
 * database.js - Simulação de banco de dados usando LocalStorage
 */

// Inicializa o banco de dados caso não exista
function getDB() {
    const db = localStorage.getItem('splitwise_db');
    if (!db) {
        const initialDB = { users: [], rooms: [] };
        localStorage.setItem('splitwise_db', JSON.stringify(initialDB));
        return initialDB;
    }
    return JSON.parse(db);
}

function saveDB(db) {
    localStorage.setItem('splitwise_db', JSON.stringify(db));
}

// Gerenciamento de Sessão (Usuário Logado)
function getLoggedUser() {
    return JSON.parse(localStorage.getItem('splitwise_logged_user'));
}

function setLoggedUser(user) {
    localStorage.setItem('splitwise_logged_user', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('splitwise_logged_user');
    window.location.href = 'login.html';
}

// Proteção de rotas simples
function checkAuth() {
    if (!getLoggedUser()) {
        window.location.href = 'login.html';
    }
}

/**
 * LÓGICA DE COMPENSAÇÃO DE DESPESAS (O Core do Sistema)
 * Baseado no algoritmo de balanço de saldos individuais.
 */
function calculateBalances(room) {
    const participants = room.participants;
    const expenses = room.expenses || [];
    
    if (participants.length === 0) return [];

    // 1. Inicializa o saldo de cada participante com 0
    const balances = {};
    participants.forEach(p => balances[p] = 0);

    // 2. Calcula o quanto cada um pagou e o total geral
    let totalSpent = 0;
    expenses.forEach(exp => {
        const val = parseFloat(exp.value);
        balances[exp.paidBy] += val;
        totalSpent += val;
    });

    // 3. Subtrai a parte justa (Total / número de pessoas) do saldo de cada um
    const fairShare = totalSpent / participants.length;
    
    // Lista de pessoas que devem receber (crédito) e que devem pagar (débito)
    const creditors = [];
    const debtors = [];

    participants.forEach(p => {
        const netBalance = balances[p] - fairShare;
        if (netBalance > 0.01) {
            creditors.push({ name: p, amount: netBalance });
        } else if (netBalance < -0.01) {
            debtors.push({ name: p, amount: Math.abs(netBalance) });
        }
    });

    // Sort para resolver primeiro os maiores valores (otimização de transações)
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    const transactions = [];

    // 4. Casamento de quem deve com quem tem a receber
    let c = 0, d = 0;
    while (c < creditors.length && d < debtors.length) {
        const creditor = creditors[c];
        const debtor = debtors[d];

        // O valor a ser transferido é o menor entre o que falta pagar e o que falta receber
        const amountToPay = Math.min(creditor.amount, debtor.amount);

        transactions.push({
            from: debtor.name,
            to: creditor.name,
            amount: amountToPay
        });

        creditor.amount -= amountToPay;
        debtor.amount -= amountToPay;

        if (creditor.amount <= 0.01) c++;
        if (debtor.amount <= 0.01) d++;
    }

    return {
        totalSpent,
        fairShare,
        transactions
    };
}