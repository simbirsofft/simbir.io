// Обработчик кнопки оформления заказа
document.getElementById('checkout-button').addEventListener('click', function() {
    const cart = DB.Cart.getCart();
    if (cart.length === 0) {
        showNotification('Корзина пуста. Добавьте товары для оформления заказа');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        window.location.href = 'checkout.html';
    } else {
        // Сохраняем корзину для гостя
        localStorage.setItem('guestCart', JSON.stringify(cart));
        
        // Перенаправляем на страницу входа с редиректом на оформление
        window.location.href = 'auth.html?redirect=checkout';
    }
});