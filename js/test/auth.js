document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Простая проверка (в реальном приложении нужно проверять с сервером)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Проверяем редирект
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        
        if (redirect === 'checkout') {
            window.location.href = 'checkout.html';
        } else {
            window.location.href = 'profile.html';
        }
    } else {
        showError('Неверный email или пароль');
    }
});

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        phone: document.getElementById('reg-phone').value,
        password: document.getElementById('reg-password').value
    };
    
    const user = DB.User.create(userData);
    
    // Проверяем редирект
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    if (redirect === 'checkout') {
        window.location.href = 'checkout.html';
    } else {
        window.location.href = 'profile.html';
    }
});