document.addEventListener('DOMContentLoaded', async function() {
    try {
        const dbModule = await import('./database.js');
        const DB = dbModule.default;
        
        const cartItemsList = document.getElementById('cart-items-list');
        const cartItemsCount = document.getElementById('cart-items-count');
        const summaryItemsCount = document.getElementById('summary-items-count');
        const subtotalElement = document.getElementById('subtotal');
        const discountElement = document.getElementById('discount');
        const totalElement = document.getElementById('total');
        const clearCartButton = document.getElementById('clear-cart');
        const cartCountElement = document.getElementById('cart-count');
        const checkoutButton = document.getElementById('checkout-button');

        const cartItems = DB.Cart.getCart();
        renderCartItems(cartItems);
        updateCartSummary(cartItems);
        updateCartCount();

        clearCartButton.addEventListener('click', function() {
            DB.Cart.clearCart();
            renderCartItems([]);
            updateCartSummary([]);
            updateCartCount();
            showNotification('Корзина очищена');
        });

        if (checkoutButton) {
            checkoutButton.addEventListener('click', function() {
                const cart = DB.Cart.getCart();
                if (cart.length === 0) {
                    showNotification('Корзина пуста. Добавьте товары для оформления заказа');
                    return;
                }
                
                
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                
                if (currentUser) {
                    
                    window.location.href = 'checkout.html';
                } else {
                    
                    const tempUser = {
                        id: 'temp_' + Date.now(),
                        name: '',
                        email: '',
                        phone: '',
                        isTemp: true
                    };
                    localStorage.setItem('currentUser', JSON.stringify(tempUser));
                    
                    
                    localStorage.setItem('guestCart', JSON.stringify(cart));
                    
                    
                    window.location.href = 'checkout.html';
                }
            });
        }

        
        function renderCartItems(items) {
            cartItemsList.innerHTML = '';
            cartItemsCount.textContent = items.length;

            if (items.length === 0) {
                cartItemsList.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <h3>Ваша корзина пуста</h3>
                        <p>Добавьте товары из каталога</p>
                        <a href="products.html" class="btn btn-primary">Перейти в каталог</a>
                    </div>
                `;
                clearCartButton.style.display = 'none';
                return;
            }

            clearCartButton.style.display = 'inline';

            items.forEach(item => {
                const product = DB.Product.findById(item.id) || item;
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.dataset.id = item.id;
                
                cartItemElement.innerHTML = `
                    <div class="cart-item-image">
                        <img src="images/${product.image}" alt="${product.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${product.name}</h4>
                        <span class="cart-item-category">Категория: ${DB.Product.getCategoryName(product.category)}</span>
                        <button class="remove-item">Удалить</button>
                    </div>
                    <div class="cart-item-price">
                        <span class="item-total">${(product.price * item.quantity).toLocaleString('ru-RU')} руб.</span>
                        <span class="item-price">${product.price.toLocaleString('ru-RU')} руб./шт</span>
                        <div class="quantity-control">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                `;
                
                cartItemsList.appendChild(cartItemElement);
            });

            addCartEventListeners();
        }

        function updateCartSummary(items) {
            const totals = DB.Cart.calculateTotals();
            
            summaryItemsCount.textContent = items.reduce((total, item) => total + item.quantity, 0);
            subtotalElement.textContent = `${totals.subtotal.toLocaleString('ru-RU')} руб.`;
            discountElement.textContent = `-${totals.discount.toLocaleString('ru-RU')} руб.`;
            totalElement.textContent = `${totals.total.toLocaleString('ru-RU')} руб.`;
        }

        function updateCartCount() {
            const count = DB.Cart.getTotalCount();
            cartCountElement.textContent = count;
        }

        function addCartEventListeners() {
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const itemId = parseInt(this.closest('.cart-item').dataset.id);
                    DB.Cart.removeFromCart(itemId);
                    const updatedCart = DB.Cart.getCart();
                    renderCartItems(updatedCart);
                    updateCartSummary(updatedCart);
                    updateCartCount();
                    showNotification('Товар удален из корзины');
                });
            });

            document.querySelectorAll('.quantity-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const itemId = parseInt(this.closest('.cart-item').dataset.id);
                    const input = this.closest('.quantity-control').querySelector('.quantity-input');
                    let quantity = parseInt(input.value);

                    if (this.classList.contains('minus') && quantity > 1) {
                        quantity--;
                    } else if (this.classList.contains('plus')) {
                        quantity++;
                    }

                    input.value = quantity;
                    DB.Cart.updateQuantity(itemId, quantity);
                    
                    const updatedCart = DB.Cart.getCart();
                    updateCartSummary(updatedCart);
                    updateCartCount();
                });
            });

            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', function() {
                    const itemId = parseInt(this.closest('.cart-item').dataset.id);
                    let quantity = parseInt(this.value) || 1;
                    this.value = quantity;
                    DB.Cart.updateQuantity(itemId, quantity);
                    
                    const updatedCart = DB.Cart.getCart();
                    updateCartSummary(updatedCart);
                    updateCartCount();
                });
            });
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        }

    } catch (error) {
        console.error('Ошибка в cart.js:', error);
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