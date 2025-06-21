let DB;

async function initCart() {
    try {
        const dbModule = await import('./database.js');
        DB = dbModule.default;
        
        updateCartCount();
        setupEventListeners();
        
    } catch (error) {
        console.error('Ошибка инициализации корзины:', error);
        document.querySelectorAll('#cart-count').forEach(el => {
            el.textContent = '0';
        });
    }
}

function updateCartCount() {
    if (!DB?.Cart?.getTotalCount) {
        console.error('Метод getTotalCount не доступен');
        return;
    }
    
    const count = DB.Cart.getTotalCount();
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = count;
    });
}

function setupEventListeners() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            handleAddToCart(e);
        }
    });
}

function handleAddToCart(event) {
    if (!DB?.Cart?.addToCart) {
        console.error('Метод addToCart не доступен');
        return;
    }
    
    const productId = parseInt(event.target.dataset.id);
    if (isNaN(productId)) return;
    
    const product = DB.Product.findById(productId);
    if (!product) return;

    if (DB.Cart.addToCart(productId)) {
        updateCartCount();
        showNotificationWithProduct(product); 
    }
}

function showNotificationWithProduct(product) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <img src="images/${product.image}" alt="${product.name}" style="width: 40px; height: 40px; object-fit: contain;">
            <div>
                <div>${product.name} добавлен в корзину</div>
                <small>${product.price.toLocaleString()} руб.</small>
            </div>
        </div>
        <a href="cart.html" style="display: block; margin-top: 8px; font-size: 12px; color: #fff;">Перейти в корзину</a>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', initCart);
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