import DB from './database.js';

document.addEventListener('DOMContentLoaded', async function() {
    try {
        let cart = DB.Cart.getCart();
        const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
        
        if (guestCart.length > 0 && cart.length === 0) {
            cart = guestCart;
        }
        
        if (cart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }
        
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            currentUser = {
                id: 'temp_' + Date.now(),
                isTemp: true
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            document.getElementById('guest-checkout').style.display = 'block';
            document.getElementById('user-info').style.display = 'none';
            
            document.getElementById('save-guest-info').addEventListener('click', function() {
                currentUser.name = document.getElementById('guest-name').value;
                currentUser.email = document.getElementById('guest-email').value;
                currentUser.phone = document.getElementById('guest-phone').value;
                
                if (!currentUser.name || !currentUser.email || !currentUser.phone) {
                    alert('Заполните все поля');
                    return;
                }
                
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                document.getElementById('guest-checkout').style.display = 'none';
                document.getElementById('user-info').style.display = 'block';
                document.getElementById('payment-section').style.display = 'block';
                
                document.getElementById('name').value = currentUser.name;
                document.getElementById('email').value = currentUser.email;
                document.getElementById('phone').value = currentUser.phone;
            });
        } else {
            document.getElementById('guest-checkout').style.display = 'none';
            document.getElementById('user-info').style.display = 'block';
            document.getElementById('payment-section').style.display = 'block';
            
            if (currentUser.name) {
                document.getElementById('name').value = currentUser.name;
            }
            if (currentUser.email) {
                document.getElementById('email').value = currentUser.email;
            }
            if (currentUser.phone) {
                document.getElementById('phone').value = currentUser.phone;
            }
        }
        
        displayOrderItems(cart);
        displayOrderSummary(cart);
        
        document.getElementById('confirm-payment').addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!validateForm()) return;
            
            const order = {
                id: 'order_' + Date.now(),
                userId: currentUser.id,
                products: cart,
                total: DB.Cart.calculateTotals().total,
                date: new Date().toISOString(),
                status: 'new',
                paymentMethod: document.getElementById('payment-method').value,
                customer: {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value
                }
            };
            
            DB.Order.create(order);
            DB.Cart.clearCart();
            localStorage.removeItem('guestCart');
            
            window.location.href = `order-success.html?orderId=${order.id}`;
        });
        
    } catch (error) {
        console.error('Checkout error:', error);
    }
});

function displayOrderItems(cart) {
    const container = document.getElementById('order-items');
    container.innerHTML = '';
    
    cart.forEach(item => {
        const product = DB.Product.findById(item.id) || item;
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <img src="images/${product.image}" alt="${product.name}">
            <div>
                <h4>${product.name}</h4>
                <p>${product.price.toLocaleString()} руб. × ${item.quantity}</p>
            </div>
            <div>${(product.price * item.quantity).toLocaleString()} руб.</div>
        `;
        container.appendChild(itemElement);
    });
}

function displayOrderSummary(cart) {
    const totals = DB.Cart.calculateTotals();
    document.getElementById('order-total').textContent = `${totals.total.toLocaleString()} руб.`;
    document.getElementById('order-subtotal').textContent = `${totals.subtotal.toLocaleString()} руб.`;
    document.getElementById('order-discount').textContent = `${totals.discount.toLocaleString()} руб.`;
}

function validateForm() {
    const requiredFields = ['name', 'email', 'phone'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        if (!element || !element.value.trim()) {
            element.classList.add('error');
            isValid = false;
        } else {
            element.classList.remove('error');
        }
    });
    
    if (!isValid) {
        alert('Заполните все обязательные поля');
        return false;
    }
    
    return true;
}