document.addEventListener('DOMContentLoaded', function() {
    // Model data
    const models = [
        {
            id: 1,
            title: "CLASSIC  FIT SHIRTS",
            image: "images/classic.jpg",
            description: "Perfect for formal occasions or office wear. Made with premium cotton for maximum comfort and durability.",
            type: "shirt"
        },
        {
            id: 2,
            title: "SLIM FIT SHIRTS",
            image: "images/slimfit.jpg",
            description: "Modern style with perfect tailoring. These pants are designed for both comfort and style, with attention to every detail.",
            type: "pants"
        },
        {
            id: 3,
            title: "CASUAL SHIRTS",
            image: "images/premimum.jpg",
            description: "Comfortable yet stylish for everyday wear. The relaxed fit makes it perfect for casual outings and weekend wear.",
            type: "shirt"
        }
    ];

    // Tailor data
    const tailors = [
        {
            id: 1,
            name: "Premium Stitches",
            image: "https://i.imgur.com/mW5ZfYJ.jpg",
            rating: 4.5,
            reviews: 128,
            specialty: "Specializes in custom formal wear with precision tailoring"
        },
        {
            id: 2,
            name: "Urban Threads",
            image: "https://i.imgur.com/JQl5x5K.jpg",
            rating: 4.0,
            reviews: 97,
            specialty: "Modern and casual designs with contemporary fabrics"
        }
    ];

    // Quick View Modal
    const quickViewModal = document.getElementById('quickViewModal');
    const modalModelImage = document.getElementById('modalModelImage');
    const modalModelTitle = document.getElementById('modalModelTitle');
    const modalModelDescription = document.getElementById('modalModelDescription');
    const customizeFromModal = document.querySelector('.customize-from-modal');
    const addToCartModal = document.querySelector('.add-to-cart-modal');
    
    let currentModel = null;

    // View Details buttons
    document.querySelectorAll('.view-details').forEach((button, index) => {
        button.addEventListener('click', () => {
            currentModel = models[index];
            openQuickView(currentModel);
        });
    });

    // Customize buttons
    document.querySelectorAll('.customize-btn').forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const designType = button.getAttribute('data-design');
            window.location.href = `design.html?type=${designType}`;
        });
    });

    // Quick Order buttons
    document.querySelectorAll('.quick-order').forEach((button, index) => {
        button.addEventListener('click', () => {
            const model = models[index];
            addToCart(model);
        });
    });

    // Modal customize button
    customizeFromModal.addEventListener('click', () => {
        if (currentModel) {
            window.location.href = `design.html?type=${currentModel.type}`;
        }
    });

    // Modal add to cart button
    addToCartModal.addEventListener('click', () => {
        if (currentModel) {
            addToCart(currentModel);
            quickViewModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Open quick view modal
    function openQuickView(model) {
        modalModelImage.src = model.image;
        modalModelTitle.textContent = model.title;
        modalModelDescription.textContent = model.description;
        quickViewModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close modal when clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === quickViewModal) {
            quickViewModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Add item to cart
    function addToCart(model) {
        const cart = JSON.parse(localStorage.getItem('enarmous-cart')) || [];
        const existingItem = cart.find(item => item.id === model.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: model.id,
                title: model.title,
                image: model.image,
                price: model.type === 'shirt' ? 17.99 : 19.99,
                quantity: 1,
                type: model.type
            });
        }
        
        localStorage.setItem('enarmous-cart', JSON.stringify(cart));
        updateCartCount();
        animateCart();
        showNotification(`${model.title} added to cart!`);
    }

    // Animate model cards on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.model-card, .tailor-card').forEach(card => {
        observer.observe(card);
    });
});


document.addEventListener('DOMContentLoaded', function() {
            // Quick order functionality
            document.querySelectorAll('.quick-order').forEach(btn => {
                btn.addEventListener('click', function() {
                    const card = this.closest('.model-card');
                    const name = card.querySelector('h3').textContent;
                    const image = card.querySelector('img').src;
                    const type = name.includes('Shirt') ? 'Shirt' : 'Pants';
                    const price = type === 'Shirt' ? 17.99 : 19.99;
                    
                    // Add to cart
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    cart.push({
                        name: name,
                        type: type,
                        price: price,
                        image: image,
                        quantity: 1,
                        fabric: 'Cotton',
                        color: 'Default',
                        fit: 'Regular'
                    });
                    localStorage.setItem('cart', JSON.stringify(cart));
                    
                    // Redirect to cart page
                    window.location.href = 'cart.html';
                });
            });

            // ... (keep rest of the script content) ...
        });