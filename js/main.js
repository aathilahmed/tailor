// Shared functionality across all pages

// Initialize cart count from localStorage
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('enarmous-cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 
                     type === 'error' ? 'fas fa-exclamation-circle' : 
                     'fas fa-info-circle';
    notification.appendChild(icon);
    
    const text = document.createElement('span');
    text.textContent = message;
    notification.appendChild(text);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function animateButton(button) {
    button.classList.add('button-click');
    setTimeout(() => {
        button.classList.remove('button-click');
    }, 300);
}

function animateCart() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.classList.add('cart-bounce');
        setTimeout(() => {
            cartCount.classList.remove('cart-bounce');
        }, 1000);
    }
}

// Add animation styles dynamically
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .button-click {
        animation: clickEffect 0.3s ease;
    }
    
    .cart-bounce {
        animation: bounce 0.5s ease;
    }
    
    @keyframes clickEffect {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        30% { transform: scale(1.3); }
        60% { transform: scale(0.9); }
    }
`;
document.head.appendChild(animationStyles);