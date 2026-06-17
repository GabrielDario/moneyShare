
document.getElementById('register-btn').onclick = () => {
    const db = loadDatabase();
    db.users.push({ email: email.value, password: password.value });
    saveDatabase(db);
    alert('Cadastrado!');
};
document.getElementById('login-btn').onclick = () => {
    const db = loadDatabase();
    console.log(db.users)
    const user = db.users.find(u => u.email === email.value && u.password === password.value);
    if (!user) return alert('Login inválido');
    localStorage.setItem('currentUser', JSON.stringify(user.name));
    alert("LOGIN EFETUADO!")
    location.href = 'dashboard.html';
};
