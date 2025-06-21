User: {
    findById: function(id) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.find(u => u.id === id);
    },
    updateCart: function(userId, cart) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === userId);
        if (user) {
            user.cart = cart;
            localStorage.setItem('users', JSON.stringify(users));
        }
    },
    create: function(userData) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = {
            id: 'user_' + Date.now(),
            ...userData,
            cart: []
        };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }
}