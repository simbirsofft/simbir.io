import DB from './database.js';

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Проверяем корзину
        let cart = DB.Cart.getCart();
        const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
        
        // Если есть гостевая корзина и основная пуста - используем гостевую
        if (guestCart.length > 0 && cart.length === 0) {
            cart = guestCart;
        }
        
        if (cart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }
        
        // Проверяем пользователя
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            // Если нет пользователя, создаем временного
            currentUser = {
                id: 'temp_' + Date.now(),
                name: '',
                email: '',
                phone: '',
                isTemp: true
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            window.location.reload();
            return;
        }
        
        // Гостевой режим
        if (currentUser.isTemp) {
            document.getElementById('guest-checkout').style.display = 'block';
            document.getElementById('user-info').style.display = 'none';
            
            document.getElementById('save-guest-info').addEventListener('click', function() {
                const name = document.getElementById('guest-name').value;
                const email = document.getElementById('guest-email').value;
                const phone = document.getElementById('guest-phone').value;
                
                if (!name || !email || !phone) {
                    showError('Пожалуйста, заполните все поля');
                    return;
                }
                
                currentUser.name = name;
                currentUser.email = email;
                currentUser.phone = phone;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                document.getElementById('guest-checkout').style.display = 'none';
                document.getElementById('user-info').style.display = 'block';
                document.getElementById('payment-section').style.display = 'block';
                
                document.getElementById('name').value = name;
                document.getElementById('email').value = email;
                document.getElementById('phone').value = phone;
            });
        } else {
            document.getElementById('guest-checkout').style.display = 'none';
            document.getElementById('user-info').style.display = 'block';
            document.getElementById('payment-section').style.display = 'block';
            
            document.getElementById('name').value = currentUser.name || '';
            document.getElementById('email').value = currentUser.email || '';
            document.getElementById('phone').value = currentUser.phone || '';
        }
        
        displayOrderItems(cart);
        displayOrderSummary(cart);
        
        document.getElementById('confirm-payment').addEventListener('click', async (e) => {
            await processPayment(e, cart, currentUser);
        });
        
        updateCartCount();
        
    } catch (error) {
        console.error('Ошибка оформления заказа:', error);
        showError('Не удалось загрузить страницу оформления');
    }
});

function displayOrderItems(cart) {
    const orderItemsContainer = document.getElementById('order-items');
    if (!orderItemsContainer) return;
    
    orderItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const product = DB.Product.findById(item.id) || item;
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-image">
                <img src="images/${product.image}" alt="${product.name}">
            </div>
            <div class="order-item-info">
                <h4>${product.name}</h4>
                <div class="order-item-meta">
                    <span>${product.price.toLocaleString('ru-RU')} руб. × ${item.quantity}</span>
                </div>
            </div>
            <div class="order-item-total">
                ${(product.price * item.quantity).toLocaleString('ru-RU')} руб.
            </div>
        `;
        orderItemsContainer.appendChild(orderItem);
    });
}

function displayOrderSummary(cart) {
    const totals = DB.Cart.calculateTotals();
    
    const safeUpdate = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };
    
    safeUpdate('order-total', `${totals.total.toLocaleString('ru-RU')} руб.`);
    safeUpdate('order-items-count', totals.itemsCount);
    safeUpdate('order-subtotal', `${totals.subtotal.toLocaleString('ru-RU')} руб.`);
    safeUpdate('order-discount', `-${totals.discount.toLocaleString('ru-RU')} руб.`);
}

async function processPayment(e, cart, user) {
    e.preventDefault();
    
    if (!validateCheckoutForm()) return;
    
    try {
        const order = {
            userId: user.id,
            products: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            total: DB.Cart.calculateTotals().total,
            paymentMethod: document.getElementById('payment-method').value,
            shippingAddress: document.getElementById('address').value || 'Электронная доставка',
            status: 'processing',
            date: new Date().toISOString()
        };
        
        // Сохраняем заказ
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Очищаем корзину
        DB.Cart.clearCart();
        localStorage.removeItem('guestCart');
        updateCartCount();
        
        // Перенаправляем на страницу успешного оформления
        window.location.href = `order-success.html?id=${Date.now()}`;
        
    } catch (error) {
        console.error('Ошибка оформления:', error);
        showError('Ошибка при оформлении заказа');
    }
}

function validateCheckoutForm() {
    const paymentMethod = document.getElementById('payment-method').value;
    if (!paymentMethod) {
        showError('Выберите способ оплаты');
        return false;
    }
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvv = document.getElementById('card-cvv').value;
        
        if (!cardNumber || !cardExpiry || !cardCvv) {
            showError('Заполните все данные карты');
            return false;
        }
    }
    
    return true;
}

function updateCartCount() {
    const count = DB.Cart.getTotalCount();
    document.querySelectorAll('#cart-count').forEach(el => {
        if (el) el.textContent = count;
    });
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'checkout-error';
    errorElement.textContent = message;
    
    const form = document.getElementById('checkout-form') || 
                 document.getElementById('guest-checkout-form') ||
                 document.getElementById('payment-section');
    
    if (form) {
        form.prepend(errorElement);
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }
}