document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const formTitle = document.getElementById('form-title');
    const btnSubmit = document.getElementById('btn-submit');
    const btnToggle = document.getElementById('btn-toggle-mode');

    let isLoginMode = true;

    btnToggle.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        formTitle.textContent = isLoginMode ? 'Acessar Conta' : 'Criar Nova Conta';
        btnSubmit.textContent = isLoginMode ? 'Entrar' : 'Cadastrar';
        btnToggle.textContent = isLoginMode ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça Login';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const db = getDB();

        if (isLoginMode) {
            // Lógica de Login
            const user = db.users.find(u => u.email === email && u.password === password);
            if (user) {
                setLoggedUser(user);
                window.location.href = 'dashboard.html';
            } else {
                alert('E-mail ou senha incorretos.');
            }
        } else {
            // Lógica de Cadastro
            if (db.users.some(u => u.email === email)) {
                alert('Este e-mail já está cadastrado.');
                return;
            }

            const newUser = { id: Date.now(), email, password };
            db.users.push(newUser);
            saveDB(db);
            setLoggedUser(newUser);
            alert('Conta criada com sucesso!');
            window.location.href = 'dashboard.html';
        }
    });
});