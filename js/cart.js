document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartCount = document.querySelector('.cart-count');
    const removeModal = document.getElementById('remove-modal');
    const cancelRemoveBtn = document.getElementById('cancel-remove');
    const confirmRemoveBtn = document.getElementById('confirm-remove');
    const confirmationModal = document.getElementById('confirmation-modal');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    
    let cart = JSON.parse(localStorage.getItem('enarmous-cart')) || [];
    let itemToRemove = null;

    // Normalize cart items to ensure consistent property names
    function normalizeCartItem(item) {
        if (item.name && !item.title) {
            item.title = item.name;
        }
        if (item.title && !item.name) {
            item.name = item.title;
        }
        return item;
    }

    // Initialize cart
    function initCart() {
        // Normalize all cart items
        cart = cart.map(normalizeCartItem);
        saveCart();
        
        updateCartCount();
        if (cart.length === 0) {
            showEmptyCart();
        } else {
            renderCartItems();
            calculateTotals();
        }
        setupEventListeners();
    }

    // Show empty cart message
    function showEmptyCart() {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2>Your cart is empty</h2>
                <p>Start designing your perfect outfit or browse our ready-to-wear collection</p>
                <a href="design.html" class="btn btn-primary">Start Designing</a>
            </div>
        `;
        checkoutBtn.disabled = true;
    }

    // Render cart items
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            // Check if it's a custom design
            const isCustomDesign = item.designData;
            
            // Get display name - prioritize name, then title, then default
            const displayName = item.name || item.title || 'Product';
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${displayName}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">
                        ${displayName}
                        ${isCustomDesign ? '<span class="custom-design-badge">Custom</span>' : ''}
                    </h3>
                    ${isCustomDesign ? `
                        <div class="design-specs">
                            <div class="design-spec">
                                <span class="spec-label">Type:</span>
                                <span class="spec-value">${item.designData.type}</span>
                            </div>
                            <div class="design-spec">
                                <span class="spec-label">Fabric:</span>
                                <span class="spec-value">${item.designData.fabric}</span>
                            </div>
                            <div class="design-spec">
                                <span class="spec-label">Color:</span>
                                <span class="spec-value">
                                    ${item.designData.color}
                                    <span class="color-swatch" style="background-color: ${item.designData.color}"></span>
                                </span>
                            </div>
                            <div class="design-spec">
                                <span class="spec-label">Fit:</span>
                                <span class="spec-value">${item.designData.fit}</span>
                            </div>
                            ${item.designData.pockets && item.designData.pockets !== 'none' ? `
                                <div class="design-spec">
                                    <span class="spec-label">Pockets:</span>
                                    <span class="spec-value">${item.designData.pockets}</span>
                                </div>
                            ` : ''}
                            ${item.designData.collar ? `
                                <div class="design-spec">
                                    <span class="spec-label">Collar:</span>
                                    <span class="spec-value">${item.designData.collar}</span>
                                </div>
                            ` : ''}
                        </div>
                    ` : `
                        <p class="cart-item-options">
                            ${item.type} | ${item.fabric} | ${item.color} | ${item.fit}
                            ${item.collar ? '| ' + item.collar + ' collar' : ''}
                            ${item.pockets ? '| ' + item.pockets + ' pockets' : ''}
                        </p>
                    `}
                    <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <button class="remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', handleQuantityChange);
        });

        // Add event listeners to quantity inputs
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', handleQuantityInputChange);
        });

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                itemToRemove = parseInt(e.currentTarget.getAttribute('data-index'));
                removeModal.style.display = 'block';
            });
        });
    }

    // Handle quantity changes from buttons
    function handleQuantityChange(e) {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        const isPlus = e.currentTarget.classList.contains('plus');
        
        if (isPlus) {
            cart[index].quantity += 1;
        } else {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            }
        }
        
        saveCart();
        renderCartItems();
        calculateTotals();
        updateCartCount();
    }

    // Handle quantity changes from input
    function handleQuantityInputChange(e) {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        const newQuantity = parseInt(e.target.value) || 1;
        
        if (newQuantity > 0) {
            cart[index].quantity = newQuantity;
            saveCart();
            renderCartItems();
            calculateTotals();
            updateCartCount();
        }
    }

    // Calculate order totals
    function calculateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 100 ? 0 : 1.99;
        const tax = subtotal * 0.08; // 8% tax
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$${shipping.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${(subtotal + shipping + tax).toFixed(2)}`;
        
        checkoutBtn.disabled = cart.length === 0;
    }

    // Remove item from cart
    function removeItem(index) {
        if (index >= 0 && index < cart.length) {
            const removedItem = cart.splice(index, 1)[0];
            saveCart();
            updateCartCount();
            const displayName = removedItem.name || removedItem.title || 'Item';
            showNotification(`${displayName} removed from cart`, 'info');
            
            if (cart.length === 0) {
                showEmptyCart();
            } else {
                renderCartItems();
                calculateTotals();
            }
        }
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('enarmous-cart', JSON.stringify(cart));
    }

    // Update cart count in header
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = count;
    }

    // Show notification
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type === 'error' ? 'error' : ''}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : '#4CAF50'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        // Add close button functionality
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.remove();
        });
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    

    // Setup event listeners
    function setupEventListeners() {
        // Event listeners for remove modal
        cancelRemoveBtn.addEventListener('click', () => {
            removeModal.style.display = 'none';
        });

        confirmRemoveBtn.addEventListener('click', () => {
            removeItem(itemToRemove);
            removeModal.style.display = 'none';
            itemToRemove = null;
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Close modals with close button
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });

        // Checkout button
        checkoutBtn.addEventListener('click', handleCheckout);

        // Continue shopping button
        continueShoppingBtn.addEventListener('click', function() {
            confirmationModal.style.display = 'none';
            window.location.href = 'index.html';
        });

        // Add to cart functionality for recommended items
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const product = JSON.parse(this.dataset.product);
                product.quantity = 1;
                
                // Normalize the product
                normalizeCartItem(product);
                
                // Check if item already exists in cart
                const existingItem = cart.find(item => 
                    item.name === product.name && 
                    item.type === product.type && 
                    item.fabric === product.fabric && 
                    item.color === product.color
                );
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push(product);
                }
                
                saveCart();
                renderCartItems();
                calculateTotals();
                updateCartCount();
                
                // Show a quick confirmation
                const originalText = this.textContent;
                this.textContent = 'Added!';
                this.style.backgroundColor = '#27ae60';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.backgroundColor = '#2c3e50';
                }, 1500);
            });
        });
    }

    // Handle checkout
    function handleCheckout() {
        if (cart.length === 0) return;
        
        // Prepare order details with clear formatting
        let orderDetails = "ORDER DETAILS:\n\n";
        orderDetails += "----------------------------------------\n";
        
        cart.forEach((item, index) => {
            orderDetails += `ITEM ${index + 1}:\n`;
            
            // Get display name
            const displayName = item.name || item.title || 'Product';
            
            // Use proper product names for better readability
            let productName = displayName;
            
            // Check if it's a recommended product and assign proper names
            if (item.name) {
                switch(item.name) {
                    case "PREMIUM FADED DENIM":
                        productName = "PREMIUM FADED DENIM SHIRT";
                        break;
                    case "SLIM CHINOS":
                        productName = "SLIM FIT CHINOS";
                        break;
                    case "DENIM JEANS":
                        productName = "CLASSIC DENIM JEANS";
                        break;
                    case "BROWN FORMAL PANT":
                        productName = "BROWN FORMAL TROUSERS";
                        break;
                    case "BLACK FORMAL PANT":
                        productName = "BLACK FORMAL TROUSERS";
                        break;
                    case "POLO FIT PANTS":
                        productName = "POLO FIT PANTS";
                        break;
                    default:
                        productName = item.name;
                }
            }
            
            orderDetails += `Product: ${productName}\n`;
            orderDetails += `Type: ${item.designData ? item.designData.type : item.type}\n`;
            orderDetails += `Quantity: ${item.quantity}\n`;
            orderDetails += `Price per item: $${item.price.toFixed(2)}\n`;
            
            if (item.designData) {
                orderDetails += `Fabric: ${item.designData.fabric}\n`;
                orderDetails += `Color: ${item.designData.color}\n`;
                orderDetails += `Fit: ${item.designData.fit}\n`;
                if (item.designData.collar) orderDetails += `Collar: ${item.designData.collar}\n`;
                if (item.designData.pockets && item.designData.pockets !== 'none') orderDetails += `Pockets: ${item.designData.pockets}\n`;
            } else {
                orderDetails += `Fabric: ${item.fabric}\n`;
                orderDetails += `Color: ${item.color}\n`;
                orderDetails += `Fit: ${item.fit}\n`;
                if (item.collar) orderDetails += `Collar: ${item.collar}\n`;
                if (item.pockets) orderDetails += `Pockets: ${item.pockets}\n`;
            }
            
            orderDetails += `Subtotal: $${(item.price * item.quantity).toFixed(2)}\n`;
            orderDetails += "----------------------------------------\n\n";
        });
        
        // Calculate order totals
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? 1.99 : 0;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;
        
        // Add order summary
        orderDetails += "ORDER SUMMARY:\n";
        orderDetails += "----------------------------------------\n";
        orderDetails += `Subtotal: $${subtotal.toFixed(2)}\n`;
        orderDetails += `Shipping: $${shipping.toFixed(2)}\n`;
        orderDetails += `Tax: $${tax.toFixed(2)}\n`;
        orderDetails += `TOTAL: $${total.toFixed(2)}\n\n`;
        
        // Add customer information section
        orderDetails += "CUSTOMER INFORMATION:\n";
        orderDetails += "----------------------------------------\n";
        orderDetails += "Full Name: [Please enter your name]\n";
        orderDetails += "Email: [Please enter your email]\n";
        orderDetails += "Phone: [Please enter your phone number]\n";
        orderDetails += "Shipping Address:\n";
        orderDetails += "[Please enter your complete shipping address]\n\n";
        orderDetails += "Special Instructions:\n";
        orderDetails += "[Any special requests or notes]\n";
        
        // Create mailto link
        const subject = `New Order - ${cart.length} Items - ${new Date().toLocaleDateString()}`;
        const mailtoLink = `mailto:abdulkadher19970407@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(orderDetails)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show confirmation modal
        confirmationModal.style.display = 'block';
        
        // Clear cart after checkout
        cart = [];
        saveCart();
        updateCartCount();
        showEmptyCart();
    }

    // Initialize cart
    initCart();
});