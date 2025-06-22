document.addEventListener('DOMContentLoaded', async function() {
    try {
        const dbModule = await import('./database.js');
        const DB = dbModule.default;
        
        renderCart();
        setupEventListeners();
        
        function renderCart() {
            const cart = DB.Cart.getCart();
            const cartItemsList = document.getElementById('cart-items-list');
            const cartCount = document.getElementById('cart-count');
            
            cartItemsList.innerHTML = '';
            cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
            
            if (cart.length === 0) {
                cartItemsList.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <h3>Ваша корзина пуста</h3>
                        <a href="products.html" class="btn btn-primary">Перейти в каталог</a>
                    </div>
                `;
                document.getElementById('checkout-button').style.display = 'none';
                return;
            }
            
            document.getElementById('checkout-button').style.display = 'block';
            
            cart.forEach(item => {
                const product = DB.Product.findById(item.id) || item;
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="images/${product.image}" alt="${product.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4>${product.name}</h4>
                        <button class="remove-item" data-id="${item.id}">Удалить</button>
                    </div>
                    <div class="cart-item-price">
                        <span>${(product.price * item.quantity).toLocaleString()} руб.</span>
                        <div class="quantity-control">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                `;
                cartItemsList.appendChild(cartItem);
            });
            
            updateSummary();
        }
        
        function setupEventListeners() {
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('plus')) {
                    const productId = parseInt(e.target.dataset.id);
                    DB.Cart.addToCart(productId);
                    renderCart();
                }
                
                if (e.target.classList.contains('minus')) {
                    const productId = parseInt(e.target.dataset.id);
                    const cart = DB.Cart.getCart();
                    const item = cart.find(i => i.id === productId);
                    
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                        localStorage.setItem('cart', JSON.stringify(cart));
                    } else {
                        DB.Cart.removeFromCart(productId);
                    }
                    renderCart();
                }
                
                if (e.target.classList.contains('remove-item')) {
                    const productId = parseInt(e.target.dataset.id);
                    DB.Cart.removeFromCart(productId);
                    renderCart();
                }
            });
            
            document.getElementById('clear-cart').addEventListener('click', function() {
                DB.Cart.clearCart();
                renderCart();
                showNotification('Корзина очищена');
            });
            
            document.getElementById('checkout-button').addEventListener('click', function() {
                const cart = DB.Cart.getCart();
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                
                if (!currentUser) {
                    localStorage.setItem('guestCart', JSON.stringify(cart));
                    window.location.href = 'auth.html?redirect=checkout';
                } else {
                    window.location.href = 'checkout.html';
                }
            });
        }
        
        function updateSummary() {
            const totals = DB.Cart.calculateTotals();
            document.getElementById('subtotal').textContent = `${totals.subtotal.toLocaleString()} руб.`;
            document.getElementById('discount').textContent = `-${totals.discount.toLocaleString()} руб.`;
            document.getElementById('total').textContent = `${totals.total.toLocaleString()} руб.`;
        }
        
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
        
    } catch (error) {
        console.error('Cart error:', error);
    }
});