document.addEventListener('DOMContentLoaded', function() {
    
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-pane').forEach(p => p.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`${this.getAttribute('data-tab')}-pane`).classList.add('active');
        });
    });
    
    
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        
        if (email && password) {
            
            const user = {
                id: 1,
                name: 'Тестовый Пользователь',
                email: email,
                registrationDate: new Date().toISOString().split('T')[0]
            };
            
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'index.html';
        } else {
            alert('Пожалуйста, заполните все поля');
        }
    });
    
    
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const phone = document.getElementById('reg-phone').value;
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        
        if (password !== confirm) {
            alert('Пароли не совпадают');
            return;
        }
        
        if (!name || !email || !phone || !password) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        
        const user = {
            id: Math.floor(Math.random() * 10000),
            name: name,
            email: email,
            phone: phone,
            registrationDate: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Регистрация прошла успешно!');
        window.location.href = 'index.html';
    });
    
    
    if (localStorage.getItem('currentUser')) {
        window.location.href = 'index.html';
    }
});
document.addEventListener('DOMContentLoaded', function() {
        const backToTopButton = document.getElementById('backToTop');
        
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });