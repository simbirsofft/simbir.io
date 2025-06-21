
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
        {
            id: 2,
            name: "Microsoft Office 2021",
            price: 8990,
            category: "office",
            brand: "microsoft",
            license: "permanent",
            image: "office2021.jpg",
            description: "Полный пакет офисных приложений для дома и бизнеса",
            rating: 4.5,
            reviews: 95
        },
        {
            id: 3,
            name: "Adobe Photoshop 2023",
            price: 14990,
            category: "graphics",
            brand: "adobe",
            license: "subscription",
            image: "photoshop.jpg",
            description: "Профессиональный редактор изображений с AI инструментами",
            rating: 4.8,
            reviews: 215
        },
        {
            id: 4,
            name: "Kaspersky Total Security",
            price: 3490,
            category: "antivirus",
            brand: "kaspersky",
            license: "subscription",
            image: "kaspersky.jpg",
            description: "Комплексная защита для всех ваших устройств",
            rating: 4.6,
            reviews: 178
        },
        {
            id: 5,
            name: "JetBrains WebStorm",
            price: 6990,
            category: "dev",
            brand: "jetbrains",
            license: "subscription",
            image: "webstorm.jpg",
            description: "Мощная IDE для современной JavaScript разработки",
            rating: 4.7,
            reviews: 87
        },
        {
            id: 6,
            name: "CorelDRAW Graphics Suite",
            price: 7990,
            category: "graphics",
            brand: "corel",
            license: "permanent",
            image: "coreldraw.jpg",
            description: "Профессиональное решение для векторной графики",
            rating: 4.4,
            reviews: 64
        },
        {
            id: 7,
            name: "Windows Server 2022",
            price: 24990,
            category: "os",
            brand: "microsoft",
            license: "permanent",
            image: "windowsserver.jpg",
            description: "Серверная операционная система для бизнеса",
            rating: 4.6,
            reviews: 42
        },
        {
            id: 8,
            name: "Microsoft 365 Personal",
            price: 3990,
            category: "office",
            brand: "microsoft",
            license: "subscription",
            image: "office365.jpg",
            description: "Офисные приложения с облачным хранилищем",
            rating: 4.5,
            reviews: 156
        },
        {
            id: 9,
            name: "Adobe Illustrator 2023",
            price: 13990,
            category: "graphics",
            brand: "adobe",
            license: "subscription",
            image: "illustrator.jpg",
            description: "Индустриальный стандарт векторной графики",
            rating: 4.7,
            reviews: 98
        },
        {
            id: 10,
            name: "Dr.Web Security Space",
            price: 2990,
            category: "antivirus",
            brand: "drweb",
            license: "subscription",
            image: "drweb.jpg",
            description: "Антивирусная защита с фаерволом",
            rating: 4.3,
            reviews: 67
        },
        {
            id: 11,
            name: "JetBrains IntelliJ IDEA",
            price: 7990,
            category: "dev",
            brand: "jetbrains",
            license: "subscription",
            image: "intellij.jpg",
            description: "Умная IDE для Java и других JVM языков",
            rating: 4.8,
            reviews: 112
        },
        {
            id: 12,
            name: "Corel PaintShop Pro",
            price: 5990,
            category: "graphics",
            brand: "corel",
            license: "permanent",
            image: "paintshop.jpg",
            description: "Мощный редактор фото с AI инструментами",
            rating: 4.2,
            reviews: 53
        }
];

const DB = {
    Cart: {
        getCart: () => JSON.parse(localStorage.getItem('cart')) || [],
        
        addToCart: function(productId) {
            const product = DB.Product.findById(productId);  
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
        
        getTotalCount: function() {
            const cart = this.getCart();
            return cart.reduce((total, item) => total + item.quantity, 0);
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
    }
};

export default DB;