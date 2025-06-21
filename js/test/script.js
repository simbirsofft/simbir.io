import DB from './database.js';

let currentUser = null;
let products = [];
let isLoading = false;

document.addEventListener('DOMContentLoaded', async function() {
    showLoader();
    
    try {
        await loadData();
        checkAuth();
        initCart();
        initSearch();
        hideLoader();
    } catch (error) {
        console.error("Ошибка загрузки:", error);
        showError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
        hideLoader();
    }
});

async function loadData() {
    isLoading = true;
    try {
        products = DB.Product.findAll();
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            currentUser = JSON.parse(userData);
            await syncCart();
        }
    } finally {
        isLoading = false;
    }
}

function checkAuth() {
    
    const currentPath = window.location.pathname.split('/').pop();
    const cart = DB.Cart.getCart();
    
    if (!currentUser && cart.length > 0 && currentPath === 'cart.html') {
        
        window.location.href = 'checkout.html';
        return;
    }
    
    if (!currentUser && currentPath === 'checkout.html') {
        window.location.href = 'auth.html?redirect=checkout';
        return;
    }
}

async function initCart() {
    updateCartCount();
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            const product = products.find(p => p.id === productId);
            if (product) {
                animateAddToCart(e.target, product);
            }
        }
    });
}

function animateAddToCart(button, product) {
    const originalText = button.textContent;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.classList.add('added');
    
    const flyItem = document.createElement('div');
    flyItem.className = 'fly-item';
    flyItem.innerHTML = `<img src="images/${product.image}" alt="${product.name}">`;
    
    const rect = button.getBoundingClientRect();
    flyItem.style.left = `${rect.left}px`;
    flyItem.style.top = `${rect.top}px`;
    document.body.appendChild(flyItem);
    
    const cartIcon = document.querySelector('.cart-link');
    const cartRect = cartIcon.getBoundingClientRect();
    
    setTimeout(() => {
        flyItem.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        flyItem.style.left = `${cartRect.left}px`;
        flyItem.style.top = `${cartRect.top}px`;
        flyItem.style.transform = 'scale(0.2)';
        flyItem.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        flyItem.remove();
        addToCart(product.id, product.name);
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove('added');
    }, 600);
}

async function addToCart(productId, productName) {
    showMiniLoader();
    
    try {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const product = products.find(p => p.id === productId);
        
        if (!product) return;
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                category: product.category
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        if (currentUser) {
            await DB.User.updateCart(currentUser.id, cart);
        }
        
        updateCartCount(cart);
        showNotification(`${productName} добавлен в корзину`, 'cart.html', 'Перейти в корзину');
    } catch (error) {
        showError('Не удалось добавить товар в корзину');
    } finally {
        hideMiniLoader();
    }
}

async function syncCart() {
    if (!currentUser) return;
    
    try {
        const serverCart = await DB.User.findById(currentUser.id).cart || [];
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const mergedCart = [...serverCart];
        
        localCart.forEach(localItem => {
            const existingItem = mergedCart.find(item => item.id === localItem.id);
            if (existingItem) {
                existingItem.quantity = localItem.quantity;
            } else {
                mergedCart.push(localItem);
            }
        });
        
        localStorage.setItem('cart', JSON.stringify(mergedCart));
        await DB.User.updateCart(currentUser.id, mergedCart);
        updateCartCount(mergedCart);
    } catch (error) {
        console.error('Ошибка синхронизации корзины:', error);
    }
}

function updateCartCount() {
    const count = DB.Cart.getTotalCount();
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = count;
    });
}

function showLoader() {
    const loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Загрузка...</p>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    }
}

function showMiniLoader() {
    
}

function hideMiniLoader() {
    
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'global-error';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
    
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

function initSearch() {
    
}
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