let currentRoomId = null;

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Captura o ID vindo dos parâmetros da URL (?id=room_xxxx)
    const urlParams = new URLSearchParams(window.location.search);
    currentRoomId = urlParams.get('id');

    if (!currentRoomId) {
        window.location.href = 'dashboard.html';
        return;
    }

    renderRoomDetails();

    // Evento para adicionar participante
    document.getElementById('add-participant-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('part-name');
        const name = input.value.trim();

        const db = getDB();
        const room = db.rooms.find(r => r.id === currentRoomId);

        if (room.participants.includes(name)) {
            alert('Esse participante já está na sala!');
            return;
        }

        room.participants.push(name);
        saveDB(db);
        input.value = '';
        renderRoomDetails();
    });

    // Evento para adicionar despesa
    document.getElementById('expense-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const desc = document.getElementById('exp-desc').value.trim();
        const val = parseFloat(document.getElementById('exp-val').value);
        const paidBy = document.getElementById('exp-paid-by').value;

        const db = getDB();
        const room = db.rooms.find(r => r.id === currentRoomId);

        const newExpense = {
            id: Date.now(),
            description: desc,
            value: val,
            paidBy: paidBy
        };

        room.expenses.push(newExpense);
        saveDB(db);
        
        document.getElementById('expense-form').reset();
        renderRoomDetails();
    });
});

function renderRoomDetails() {
    const db = getDB();
    const room = db.rooms.find(r => r.id === currentRoomId);

    if (!room) {
        alert('Sala não encontrada!');
        window.location.href = 'dashboard.html';
        return;
    }

    document.getElementById('display-room-name').textContent = room.name;

    // 1. Renderiza Participantes
    const partContainer = document.getElementById('participants-list');
    partContainer.innerHTML = room.participants.map(p => `<span class="badge-tag" style="margin-right:5px; display:inline-block; margin-bottom:5px;">👤 ${p}</span>`).join('');

    // 2. Atualiza o Select de quem pagou a conta
    const selectPaid = document.getElementById('exp-paid-by');
    selectPaid.innerHTML = room.participants.map(p => `<option value="${p}">${p}</option>`).join('');

    // 3. Renderiza Histórico de Despesas
    const historyContainer = document.getElementById('expenses-history');
    historyContainer.innerHTML = '';
    
    if (!room.expenses || room.expenses.length === 0) {
        historyContainer.innerHTML = '<p style="color:var(--text-muted); font-size:14px;">Nenhuma despesa adicionada.</p>';
    } else {
        room.expenses.forEach(exp => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <span>${exp.description}</span>
                <span><strong>R$ ${exp.value.toFixed(2)}</strong> <small style="color:var(--text-muted)">por ${exp.paidBy}</small></span>
            `;
            historyContainer.appendChild(div);
        });
    }

    // 4. Executa os cálculos matemáticos finais de divisão e balanço
    renderCalculations(room);
}

function renderCalculations(room) {
    const summaryContainer = document.getElementById('room-summary');
    summaryContainer.innerHTML = '';

    const calculations = calculateBalances(room);

    if (!calculations || calculations.totalSpent === 0) {
        summaryContainer.innerHTML = '<p style="color:var(--text-muted); font-size:14px;">Insira despesas e participantes para calcular o fechamento.</p>';
        return;
    }

    // Cria a estrutura visual de exibição de totais
    let html = `
        <div style="font-size: 14px; margin-bottom: 10px; color: var(--text-main)">
            <div><strong>Gasto Total da Sala:</strong> R$ ${calculations.totalSpent.toFixed(2)}</div>
            <div><strong>Divisão Justa (Por pessoa):</strong> R$ ${calculations.fairShare.toFixed(2)}</div>
        </div>
        <div class="balance-box">
            <h4 style="margin-bottom:8px; color: var(--primary-color)">Ações de Pagamento:</h4>
    `;

    if (calculations.transactions.length === 0) {
        html += `<p style="color: var(--success-color); font-size:14px;">✓ Todas as contas estão perfeitamente igualadas!</p>`;
    } else {
        calculations.transactions.forEach(t => {
            html += `<div class="debt-item">💸 <strong>${t.from}</strong> deve pagar <strong>R$ ${t.amount.toFixed(2)}</strong> para <strong>${t.to}</strong></div>`;
        });
    }

    html += `</div>`;
    summaryContainer.innerHTML = html;
}