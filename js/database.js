const productsData = [
    {
        id: 1,
        name: "Windows 11 Pro",
        price: 12990,
        category: "os",
        brand: "microsoft",
        license: "permanent",
        image: "windows11.jpg",
        description: "Последняя версия ОС Windows с улучшенным интерфейсом и производительностью",
        rating: 4.7,
        reviews: 128
    },
    // Остальные товары...
];

const DB = {
    Cart: {
        getCart: () => JSON.parse(localStorage.getItem('cart')) || [],
        
        addToCart: function(productId) {
            const product = this.Product.findById(productId);
            if (!product) return false;
            
            let cart = this.getCart();
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            return true;
        },
        
        removeFromCart: function(productId) {
            let cart = this.getCart();
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
        },
        
        updateQuantity: function(productId, quantity) {
            let cart = this.getCart();
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity = quantity;
                localStorage.setItem('cart', JSON.stringify(cart));
            }
        },
        
        clearCart: function() {
            localStorage.removeItem('cart');
        },
        
        getTotalCount: function() {
            const cart = this.getCart();
            return cart.reduce((total, item) => total + item.quantity, 0);
        },
        
        calculateTotals: function() {
            const cart = this.getCart();
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const discount = cart.length >= 3 ? subtotal * 0.1 : 0;
            const total = subtotal - discount;
            
            return {
                subtotal,
                discount,
                total,
                itemsCount: cart.reduce((total, item) => total + item.quantity, 0)
            };
        }
    },
    
    Product: {
        findById: (id) => productsData.find(p => p.id === id),
        findAll: () => productsData,
        getCategoryName: function(category) {
            const categories = {
                'os': 'ОС и Серверы',
                'office': 'Офисные пакеты',
                'antivirus': 'Антивирусы',
                'graphics': 'Графика и дизайн',
                'dev': 'Разработка',
                'utilities': 'Утилиты'
            };
            return categories[category] || 'Другое';
        }
    },
    
    User: {
        findById: function(id) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            return users.find(u => u.id === id);
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
        },
        
        login: function(email, password) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            return users.find(u => u.email === email && u.password === password);
        }
    },
    
    Order: {
        create: function(orderData) {
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(orderData);
            localStorage.setItem('orders', JSON.stringify(orders));
            return orderData;
        }
    }
};

export default DB;