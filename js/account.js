document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const accountNavLinks = document.querySelectorAll('.account-nav-link');
    const accountTabs = document.querySelectorAll('.account-tab');
    const changePhotoBtn = document.querySelector('.change-photo');
    const photoModal = document.getElementById('photo-modal');
    const closeModal = document.querySelector('.close-modal');
    const accountForm = document.getElementById('account-settings-form');
    
    // Sample user data (in a real app, this would come from an API)
    const userData = {
        name: 'Aathil Ahmed',
        email: 'ahmedaathil276@example.com',
        joinDate: 'January 2025',
        profilePic: 'images/zyan malik.jpg'
    };
    
    // Initialize account page
    function initAccount() {
        // Set user data
        document.getElementById('username').textContent = userData.name;
        document.getElementById('user-email').textContent = userData.email;
        document.getElementById('profile-pic').src = userData.profilePic;
        document.getElementById('account-name').textContent = userData.name;
        document.getElementById('account-email').textContent = userData.email;
        document.getElementById('member-since').textContent = userData.joinDate;
        
        // Set form values
        const nameParts = userData.name.split(' ');
        document.getElementById('first-name').value = nameParts[0] || '';
        document.getElementById('last-name').value = nameParts.slice(1).join(' ') || '';
        document.getElementById('email').value = userData.email;
        
        // Load dashboard content
        loadDashboardContent();
    }
    
    // Load dashboard content
    function loadDashboardContent() {
        // In a real app, this would fetch data from an API
        setTimeout(() => {
            // Style Profile Data
            const styleProfile = {
                preferredStyle: 'Modern Classic',
                favoriteColors: 'Navy, Charcoal, Burgundy',
                fitPreference: 'Slim Fit'
            };
            
            // Update style profile
            document.querySelectorAll('.style-attribute .style-value')[0].textContent = styleProfile.preferredStyle;
            document.querySelectorAll('.style-attribute .style-value')[1].textContent = styleProfile.favoriteColors;
            document.querySelectorAll('.style-attribute .style-value')[2].textContent = styleProfile.fitPreference;
            
            // Saved Designs Data
            const savedDesigns = [
                {
                    id: 1,
                    name: 'Summer Linen Shirt',
                    image: 'images/perfect_stitch.jpg',
                    lastEdited: '2 days ago'
                }
            ];
            
            // Design Inspiration Data
            const designInspiration = [
                {
                    id: 1,
                    name: 'Summer Collection',
                    image: 'images/summer (2).jpg'
                },
                {
                    id: 2,
                    name: 'Formal Wear',
                    image: 'images/formal (2).jpg'
                },
                {
                    id: 3,
                    name: 'Casual Outfits',
                    image: 'images/causal2.jpg'
                }
            ];
            
            // Update design inspiration grid
            const inspirationGrid = document.querySelector('.inspiration-grid');
            if (inspirationGrid) {
                inspirationGrid.innerHTML = '';
                
                designInspiration.forEach(inspiration => {
                    const inspirationItem = document.createElement('div');
                    inspirationItem.className = 'inspiration-item';
                    inspirationItem.innerHTML = `
                        <img src="${inspiration.image}" alt="${inspiration.name}">
                        <button class="btn btn-outline">Get Inspired</button>
                    `;
                    inspirationGrid.appendChild(inspirationItem);
                });
            }
        }, 500);
    }
    
    // Switch between account tabs
    accountNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links and tabs
            accountNavLinks.forEach(navLink => navLink.classList.remove('active'));
            accountTabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Show corresponding tab
            const tabId = link.getAttribute('href').substring(1);
            document.getElementById(tabId).classList.add('active');
            
            // Load tab content if needed
            if (tabId === 'dashboard') {
                loadDashboardContent();
            }
        });
    });
    
    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Change photo modal
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', () => {
            photoModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            photoModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (photoModal) {
        window.addEventListener('click', (e) => {
            if (e.target === photoModal) {
                photoModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Account form submission
    if (accountForm) {
        accountForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            
            // In a real app, this would send to an API
            showNotification('Account updated successfully!', 'success');
            
            // Update displayed name
            const fullName = `${firstName} ${lastName}`;
            document.getElementById('username').textContent = fullName;
            document.getElementById('account-name').textContent = fullName;
            document.getElementById('sidebar-username').textContent = fullName;
        });
    }
    
    // Show notification
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Initialize account page
    initAccount();
});