document.addEventListener('DOMContentLoaded', async function() {
    try {
        const dbModule = await import('./database.js');
        const DB = dbModule.default;
        
        // Переключение между вкладками
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.auth-pane').forEach(p => p.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(`${this.dataset.tab}-pane`).classList.add('active');
            });
        });
        
        // Обработчик входа
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const user = DB.User.login(email, password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect');
                
                window.location.href = redirect === 'checkout' ? 'checkout.html' : 'profile.html';
            } else {
                alert('Неверные данные для входа');
            }
        });
        
        // Обработчик регистрации
        document.getElementById('register-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userData = {
                name: document.getElementById('reg-name').value,
                email: document.getElementById('reg-email').value,
                phone: document.getElementById('reg-phone').value,
                password: document.getElementById('reg-password').value
            };
            
            if (document.getElementById('reg-confirm').value !== userData.password) {
                alert('Пароли не совпадают');
                return;
            }
            
            DB.User.create(userData);
            
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            
            window.location.href = redirect === 'checkout' ? 'checkout.html' : 'profile.html';
        });
        
    } catch (error) {
        console.error('Auth error:', error);
    }
});