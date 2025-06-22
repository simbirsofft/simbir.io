document.addEventListener('DOMContentLoaded', async function() {
    try {
        const dbModule = await import('./database.js');
        const DB = dbModule.default;
        
        // Обработчик добавления в корзину
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(e.target.dataset.id);
                if (DB.Cart.addToCart(productId)) {
                    updateCartCount();
                    showAddedNotification(productId);
                }
            }
        });
        
        function updateCartCount() {
            const count = DB.Cart.getTotalCount();
            document.querySelectorAll('.cart-count').forEach(el => {
                el.textContent = count;
            });
        }
        
        function showAddedNotification(productId) {
            const product = DB.Product.findById(productId);
            if (!product) return;
            
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `
                <p>${product.name} добавлен в корзину</p>
                <a href="cart.html">Перейти в корзину</a>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
        
        updateCartCount();
        
    } catch (error) {
        console.error('Products error:', error);
    }
});