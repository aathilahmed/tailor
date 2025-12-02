document.addEventListener('DOMContentLoaded', function() {
    // Check URL parameter to see if we should start with shirt or pants
    const urlParams = new URLSearchParams(window.location.search);
    const designType = urlParams.get('type') || 'pants';
    
    // Set the active design based on URL parameter
    if (designType === 'shirt') {
        document.querySelector('.design-option[data-design="shirt"]').click();
    } else {
        document.querySelector('.design-option[data-design="pants"]').click();
    }

    // DOM Elements
    const designOptions = document.querySelectorAll('.design-option');
    const designSections = document.querySelectorAll('.design-section');
    const shareDesignBtns = document.querySelectorAll('.share-design');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    
    // Pants Customization
    const pantsFabricOptions = document.querySelectorAll('#pants-design .fabric-option');
    const pantsColorPicker = document.getElementById('pants-color');
    const pantsPresetColors = document.querySelectorAll('#pants-design .preset-color');
    const pantsFitOptions = document.querySelectorAll('#pants-design .fit-option');
    const pantsPocketOptions = document.querySelectorAll('#pants-design .pocket-option');
    const pantsFabricOverlay = document.getElementById('pants-fabric');
    const pantsPocketOverlay = document.getElementById('pants-pocket');
    const pantsPreview = document.getElementById('pants-preview');
    const pantsGarmentWrapper = pantsPreview.querySelector('.garment-wrapper');
    
    // Shirt Customization
    const shirtFabricOptions = document.querySelectorAll('#shirt-design .fabric-option');
    const shirtColorPicker = document.getElementById('shirt-color');
    const shirtPresetColors = document.querySelectorAll('#shirt-design .preset-color');
    const shirtFitOptions = document.querySelectorAll('#shirt-design .fit-option');
    const shirtPocketOptions = document.querySelectorAll('#shirt-design .pocket-option');
    const shirtCollarOptions = document.querySelectorAll('#shirt-design .collar-option');
    const shirtFabricOverlay = document.getElementById('shirt-fabric');
    const shirtPocketOverlay = document.getElementById('shirt-pocket');
    const shirtCollarOverlay = document.getElementById('shirt-collar');
    const shirtPreview = document.getElementById('shirt-preview');
    const shirtGarmentWrapper = shirtPreview.querySelector('.garment-wrapper');
    
    // Size sliders for pants
    const waistSlider = document.getElementById('waist');
    const waistValue = document.getElementById('waist-value');
    const hipSlider = document.getElementById('hip');
    const hipValue = document.getElementById('hip-value');
    const inseamSlider = document.getElementById('inseam');
    const inseamValue = document.getElementById('inseam-value');
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('length-value');
    
    // Size sliders for shirt
    const neckSlider = document.getElementById('neck');
    const neckValue = document.getElementById('neck-value');
    const chestSlider = document.getElementById('chest');
    const chestValue = document.getElementById('chest-value');
    const shirtLengthSlider = document.getElementById('shirt-length');
    const shirtLengthValue = document.getElementById('shirt-length-value');
    
    // Initialize fabric overlays
    pantsFabricOverlay.src = document.querySelector('#pants-design .fabric-option.active').getAttribute('data-img');
    shirtFabricOverlay.src = document.querySelector('#shirt-design .fabric-option.active').getAttribute('data-img');
    
    // Update size value displays
    function updateSizeDisplays() {
        waistValue.textContent = waistSlider.value;
        hipValue.textContent = hipSlider.value;
        inseamValue.textContent = inseamSlider.value;
        lengthValue.textContent = lengthSlider.value;
        neckValue.textContent = neckSlider.value;
        chestValue.textContent = chestSlider.value;
        shirtLengthValue.textContent = shirtLengthSlider.value;
    }
    
    // Event listeners for size sliders
    [waistSlider, hipSlider, inseamSlider, lengthSlider, neckSlider, chestSlider, shirtLengthSlider].forEach(slider => {
        slider.addEventListener('input', updateSizeDisplays);
    });
    
    // Initialize displays
    updateSizeDisplays();
    
    // Switch between pants and shirt design
    designOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options and sections
            designOptions.forEach(opt => opt.classList.remove('active'));
            designSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked option and corresponding section
            option.classList.add('active');
            const designType = option.getAttribute('data-design');
            document.getElementById(`${designType}-design`).classList.add('active');
            
            // Reset zoom when switching designs
            resetZoom(`${designType}-preview`);
        });
    });
    
    // Fabric selection for pants
    pantsFabricOptions.forEach(option => {
        option.addEventListener('click', () => {
            pantsFabricOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            pantsFabricOverlay.src = option.getAttribute('data-img');
            animateSelection(option);
        });
    });
    
    // Fabric selection for shirt
    shirtFabricOptions.forEach(option => {
        option.addEventListener('click', () => {
            shirtFabricOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            shirtFabricOverlay.src = option.getAttribute('data-img');
            animateSelection(option);
        });
    });
    
    // Color picker for pants - Apply color directly to fabric overlay
    pantsColorPicker.addEventListener('input', () => {
        const color = pantsColorPicker.value;
        pantsFabricOverlay.style.backgroundColor = color;
        pantsFabricOverlay.style.filter = 'none';
        animateColorChange(pantsFabricOverlay);
    });
    
    // Preset colors for pants
    pantsPresetColors.forEach(color => {
        color.addEventListener('click', () => {
            const colorValue = color.getAttribute('data-color');
            pantsColorPicker.value = colorValue;
            pantsFabricOverlay.style.backgroundColor = colorValue;
            pantsFabricOverlay.style.filter = 'none';
            animateColorChange(pantsFabricOverlay);
            animateSelection(color);
        });
    });
    
    // Color picker for shirt - Apply color directly to fabric overlay
    shirtColorPicker.addEventListener('input', () => {
        const color = shirtColorPicker.value;
        shirtFabricOverlay.style.backgroundColor = color;
        shirtFabricOverlay.style.filter = 'none';
        animateColorChange(shirtFabricOverlay);
    });
    
    // Preset colors for shirt
    shirtPresetColors.forEach(color => {
        color.addEventListener('click', () => {
            const colorValue = color.getAttribute('data-color');
            shirtColorPicker.value = colorValue;
            shirtFabricOverlay.style.backgroundColor = colorValue;
            shirtFabricOverlay.style.filter = 'none';
            animateColorChange(shirtFabricOverlay);
            animateSelection(color);
        });
    });
    
    // Fit options for pants
    pantsFitOptions.forEach(option => {
        option.addEventListener('click', () => {
            pantsFitOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            animateSelection(option);
        });
    });
    
    // Fit options for shirt
    shirtFitOptions.forEach(option => {
        option.addEventListener('click', () => {
            shirtFitOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            animateSelection(option);
        });
    });
    
    // Pocket options for pants
    pantsPocketOptions.forEach(option => {
        option.addEventListener('click', () => {
            pantsPocketOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            const pocketType = option.getAttribute('data-pocket');
            updatePocketOverlay(pantsPocketOverlay, pocketType, 'pants');
            animateSelection(option);
        });
    });
    
    // Pocket options for shirt
    shirtPocketOptions.forEach(option => {
        option.addEventListener('click', () => {
            shirtPocketOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            const pocketType = option.getAttribute('data-pocket');
            updatePocketOverlay(shirtPocketOverlay, pocketType, 'shirt');
            animateSelection(option);
        });
    });
    
    // Collar options for shirt
    shirtCollarOptions.forEach(option => {
        option.addEventListener('click', () => {
            shirtCollarOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            const collarType = option.getAttribute('data-collar');
            updateCollarOverlay(shirtCollarOverlay, collarType);
            animateSelection(option);
        });
    });
    
    // Function to update pocket overlay
    function updatePocketOverlay(element, pocketType, garmentType) {
        if (pocketType === 'none') {
            element.style.backgroundImage = 'none';
        } else {
            // These would be actual pocket images in a real implementation
            element.style.backgroundImage = `url('images/${garmentType}-${pocketType}-pocket.png')`;
            element.classList.add('animate');
            setTimeout(() => element.classList.remove('animate'), 500);
        }
    }
    
    // Function to update collar overlay
    function updateCollarOverlay(element, collarType) {
        element.style.backgroundImage = `url('images/shirt-${collarType}-collar.png')`;
        element.classList.add('animate');
        setTimeout(() => element.classList.remove('animate'), 500);
    }
    
    // Zoom functionality
    function setupZoom(previewId) {
        const preview = document.getElementById(previewId);
        const wrapper = preview.querySelector('.garment-wrapper');
        const zoomInBtn = preview.querySelector('.zoom-in');
        const zoomOutBtn = preview.querySelector('.zoom-out');
        const resetZoomBtn = preview.querySelector('.reset-zoom');
        
        let scale = 1;
        let posX = 0;
        let posY = 0;
        let isDragging = false;
        let startX, startY;
        
        // Zoom in
        zoomInBtn.addEventListener('click', () => {
            scale = Math.min(scale + 0.1, 2);
            updateTransform();
        });
        
        // Zoom out
        zoomOutBtn.addEventListener('click', () => {
            scale = Math.max(scale - 0.1, 1);
            updateTransform();
        });
        
        // Reset zoom
        resetZoomBtn.addEventListener('click', () => {
            scale = 1;
            posX = 0;
            posY = 0;
            updateTransform();
        });
        
        // Mouse events for panning
        preview.addEventListener('mousedown', (e) => {
            if (scale > 1) {
                isDragging = true;
                startX = e.clientX - posX;
                startY = e.clientY - posY;
                preview.style.cursor = 'grabbing';
            }
        });
        
        preview.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            posX = e.clientX - startX;
            posY = e.clientY - startY;
            updateTransform();
        });
        
        preview.addEventListener('mouseup', () => {
            isDragging = false;
            preview.style.cursor = 'grab';
        });
        
        preview.addEventListener('mouseleave', () => {
            isDragging = false;
            preview.style.cursor = 'grab';
        });
        
        // Touch events for mobile
        preview.addEventListener('touchstart', (e) => {
            if (scale > 1) {
                isDragging = true;
                startX = e.touches[0].clientX - posX;
                startY = e.touches[0].clientY - posY;
            }
        }, { passive: true });
        
        preview.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            posX = e.touches[0].clientX - startX;
            posY = e.touches[0].clientY - startY;
            updateTransform();
        }, { passive: true });
        
        preview.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        function updateTransform() {
            wrapper.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
        }
    }
    
    function resetZoom(previewId) {
        const preview = document.getElementById(previewId);
        const wrapper = preview.querySelector('.garment-wrapper');
        wrapper.style.transform = 'translate(0, 0) scale(1)';
    }
    
    // Initialize zoom for both previews
    setupZoom('pants-preview');
    setupZoom('shirt-preview');
    
    // Modification points functionality
    function setupModificationPoints() {
        const modificationPoints = document.querySelectorAll('.modification-point');
        
        modificationPoints.forEach(point => {
            let isDragging = false;
            let offsetX, offsetY;
            
            point.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.clientX - point.getBoundingClientRect().left;
                offsetY = e.clientY - point.getBoundingClientRect().top;
                point.style.cursor = 'grabbing';
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const parentRect = point.parentElement.getBoundingClientRect();
                let newX = e.clientX - parentRect.left - offsetX;
                let newY = e.clientY - parentRect.top - offsetY;
                
                // Constrain to parent boundaries
                newX = Math.max(0, Math.min(newX, parentRect.width - point.offsetWidth));
                newY = Math.max(0, Math.min(newY, parentRect.height - point.offsetHeight));
                
                point.style.left = `${(newX / parentRect.width) * 100}%`;
                point.style.top = `${(newY / parentRect.height) * 100}%`;
            });
            
            document.addEventListener('mouseup', () => {
                isDragging = false;
                point.style.cursor = 'move';
            });
        });
    }
    
    setupModificationPoints();
    
    // Share with tailor functionality - directly open email
    shareDesignBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const activeDesign = document.querySelector('.design-section.active');
            const designType = activeDesign.id.includes('pants') ? 'pants' : 'shirt';
            
            // Get design details
            const fabric = activeDesign.querySelector('.fabric-option.active').getAttribute('data-fabric');
            const color = activeDesign.querySelector('.color-picker').value;
            const fit = activeDesign.querySelector('.fit-option.active').getAttribute('data-fit');
            
            // Create email subject and body
            const subject = `Custom ${designType} Design`;
            const body = `Hello,\n\nI would like to share my custom ${designType} design with you:\n\n- Fabric: ${fabric}\n- Color: ${color}\n- Fit: ${fit}\n\nPlease let me know if you have any questions.\n\nThank you!`;
            
            // Open default email client
            window.location.href = `mailto:abdulkadher1977@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    });
    
    // Add to cart
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const activeDesign = document.querySelector('.design-section.active');
            const designType = activeDesign.id.includes('pants') ? 'pants' : 'shirt';
            
            // Get current design specifications
            const fabric = activeDesign.querySelector('.fabric-option.active').getAttribute('data-fabric');
            const color = activeDesign.querySelector('.color-picker').value;
            const fit = activeDesign.querySelector('.fit-option.active').getAttribute('data-fit');
            const pockets = activeDesign.querySelector('.pocket-option.active')?.getAttribute('data-pocket') || 'none';
            const collar = activeDesign.querySelector('.collar-option.active')?.getAttribute('data-collar') || 'none';
            
            // Get measurements
            const measurements = {
                waist: waistSlider.value,
                hip: hipSlider.value,
                inseam: inseamSlider.value,
                length: lengthSlider.value,
                neck: neckSlider.value,
                chest: chestSlider.value,
                sleeve: document.getElementById('sleeve').value,
                shirtLength: shirtLengthSlider.value
            };
            
            // Create design data
            const designData = {
                type: designType,
                fabric: fabric,
                color: color,
                fit: fit,
                pockets: pockets,
                collar: collar,
                measurements: measurements,
                price: designType === 'pants' ? 19.99 : 15.99,
                image: designType === 'pants' ? 'images/pants-base.png' : 'images/shirt-base.png'
            };
            
            addToCart(designData);
        });
    });
    
    // Add item to cart
    function addToCart(designData) {
        const cart = JSON.parse(localStorage.getItem('enarmous-cart')) || [];
        const newItem = {
            id: Date.now(),
            type: 'custom-' + designData.type,
            title: `Custom ${designData.type.charAt(0).toUpperCase() + designData.type.slice(1)}`,
            image: designData.image,
            price: designData.price,
            quantity: 1,
            designData: designData
        };
        
        cart.push(newItem);
        localStorage.setItem('enarmous-cart', JSON.stringify(cart));
        updateCartCount();
        animateCart();
        showNotification(`Custom ${designData.type} added to cart!`, 'success');
    }
    
    // Update cart count in the header
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('enarmous-cart')) || [];
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = cartCount;
        });
    }
    
    // Animate cart icon
    function animateCart() {
        const cartIcon = document.querySelector('.cart-link');
        cartIcon.classList.add('cart-bounce');
        setTimeout(() => {
            cartIcon.classList.remove('cart-bounce');
        }, 1000);
    }
    
    // Show notification
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
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
    
    // Animation functions
    function animateSelection(element) {
        element.classList.add('pulse-animation');
        setTimeout(() => {
            element.classList.remove('pulse-animation');
        }, 500);
    }
    
    function animateColorChange(element) {
        element.classList.add('color-change');
        setTimeout(() => {
            element.classList.remove('color-change');
        }, 500);
    }
    
    function animateButton(button) {
        button.classList.add('button-click');
        setTimeout(() => {
            button.classList.remove('button-click');
        }, 300);
    }
    
    // Initialize cart count on page load
    updateCartCount();
});