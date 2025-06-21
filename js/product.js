
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = 'products.html';
        return;
    }
    
    
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-price').textContent = `${product.price.toLocaleString()} руб.`;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('main-image').innerHTML = `<img src="images/${product.image}" alt="${product.name}">`;
    
    
    const featuresList = document.getElementById('product-features');
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    
    
    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
        addToCart(product.id, product.name);
    });
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