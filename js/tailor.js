document.addEventListener('DOMContentLoaded', function() {
    // Get tailor ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tailorId = urlParams.get('id') || '1';
    
    // DOM Elements
    const tailorImg = document.getElementById('tailor-img');
    const tailorName = document.getElementById('tailor-name');
    const tailorRating = document.getElementById('tailor-rating');
    const reviewCount = document.getElementById('review-count');
    const tailorSpecialty = document.getElementById('tailor-specialty');
    const tailorAbout = document.getElementById('tailor-about');
    const servicesList = document.getElementById('services-list');
    const materialsGrid = document.getElementById('materials-grid');
    const galleryGrid = document.getElementById('gallery-grid');
    const reviewsContainer = document.getElementById('reviews-container');
    const contactTailorBtn = document.getElementById('contact-tailor');
    const bookConsultationBtn = document.getElementById('book-consultation');
    const loadMoreReviewsBtn = document.getElementById('load-more-reviews');
    const consultationModal = document.getElementById('consultation-modal');
    const closeModal = document.querySelector('.close-modal');
    const consultationForm = document.getElementById('consultation-form');
    const reviewForm = document.getElementById('review-form');
    const thankYouMessage = document.getElementById('thank-you-message');
    
    // Tailor data (in a real app, this would come from an API)
    const tailors = {
        '1': {
            name: 'Premium Stitches',
            image: 'images/B&TAILOR.jpg',
            rating: 4.5,
            reviews: 128,
            specialty: 'Specializes in custom formal wear with precision tailoring',
            about: 'With over 5 years of experience in bespoke tailoring, Premium Stitches has dressed hundreds of satisfied clients for weddings, galas, and corporate events. Our attention to detail and commitment to quality ensures every garment is a perfect fit.',
            services: [
                'Bespoke Suits',
                'Custom Shirts',
                'Wedding Attire',
                'Tuxedo Rental',
                'Alterations',
                'Personal Styling'
            ],
            materials: [
                {
                    name: 'Italian Wool',
                    image: 'images/Italian Fawn.jpg',
                    description: 'Premium fabric for suits and coats'
                },
                {
                    name: 'Egyptian Cotton',
                    image: 'images/Egyptian Cotton Fabric.jpg',
                    description: 'Luxurious fabric for shirts'
                },
                {
                    name: 'Silk',
                    image: 'images/silk.jpg',
                    description: 'For ties and pocket squares'
                },
                {
                    name: 'Linen',
                    image: 'images/leninfab.jpg',
                    description: 'Lightweight summer fabric'
                }
            ],
            gallery: [
                'images/gallery1.jpg',
                'images/gallery2.jpg',
                'images/gallery3.jpg',
                'images/gallery4.jpg'
            ],
            reviews: [
                {
                    name: 'Michael ',
                    avatar: 'images/Michael.jpg',
                    rating: 5,
                    date: '2025-05-15',
                    comment: 'Exceptional craftsmanship! My wedding suit fit perfectly and received countless compliments.'
                },
                {
                    name: 'Fire King',
                    avatar: 'images/fireking.jpg',
                    rating: 4,
                    date: '2025-04-22',
                    comment: 'Great attention to detail. The only reason I didn\'t give 5 stars is because it took a bit longer than expected.'
                }
            ]
        },
        '2': {
            name: 'Urban Threads',
            image: 'images/ura.jpg',
            rating: 4,
            reviews: 97,
            specialty: 'Modern and casual designs with contemporary fabrics',
            about: 'Urban Threads brings a fresh approach to custom clothing with modern designs and innovative fabrics. We specialize in casual wear that doesn\'t compromise on quality or fit.',
            services: [
                'Custom Jeans',
                'Casual Shirts',
                'Jackets',
                'Streetwear',
                'Denim Repair',
                'Custom Embroidery'
            ],
            materials: [
                {
                    name: 'Japanese Denim',
                    image: 'images/japanese.jpg',
                    description: 'Premium selvedge denim'
                },
                {
                    name: 'Organic Cotton',
                    image: 'images/oragnic.jpg',
                    description: 'Sustainable fabric options'
                },
                {
                    name: 'Knitted Sweater',
                    image: 'images/KnittedSweater.jpg',
                    description: 'Premium Sweater'
                },
                {
                    name: 'Technical Fabrics',
                    image: 'images/technical.jpg',
                    description: 'Performance materials'
                }
            ],
            gallery: [
                'images/upant.jpg',
                'images/ushirt.jpg',
                'images/ushirt2.jpg',
                'images/upant2.jpg'
            ],
            reviews: [
                {
                    name: 'David Kim',
                    avatar: 'images/Goku SSJ3.jpg',
                    rating: 5,
                    date: '2023-06-10',
                    comment: 'Love my custom jeans! Perfect fit and great quality.'
                },
                {
                    name: 'Emma Rodriguez',
                    avatar: 'images/spider.jpg',
                    rating: 4,
                    date: '2023-05-30',
                    comment: 'Really happy with my shirt. The fabric is super comfortable.'
                }
            ]
        }
    };
    
    // Load tailor data
    const tailor = tailors[tailorId] || tailors['1'];
    
    // Populate tailor info
    tailorImg.src = tailor.image;
    tailorName.textContent = tailor.name;
    tailorSpecialty.textContent = tailor.specialty;
    tailorAbout.textContent = tailor.about;
    
    // Set up rating stars
    setupRatingStars(tailorRating, tailor.rating);
    reviewCount.textContent = `(${tailor.reviews})`;
    
    // Populate services
    tailor.services.forEach(service => {
        const li = document.createElement('li');
        li.textContent = service;
        servicesList.appendChild(li);
    });
    
    // Populate materials
    tailor.materials.forEach(material => {
        const materialCard = document.createElement('div');
        materialCard.className = 'material-card';
        materialCard.innerHTML = `
            <div class="material-image">
                <img src="${material.image}" alt="${material.name}">
            </div>
            <div class="material-info">
                <h3>${material.name}</h3>
                <p>${material.description}</p>
            </div>
        `;
        materialsGrid.appendChild(materialCard);
    });
    
    // Populate gallery
    tailor.gallery.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${image}" alt="Tailor's work">
        `;
        galleryGrid.appendChild(galleryItem);
    });
    
    // Populate existing reviews
    loadReviews(tailor.reviews);
    
    // Helper function for dummy notifications (needed by original code)
    function showNotification(message, type) {
        console.log(`[Notification - ${type}]: ${message}`);
        // In a real app, this would display a banner or toast message
    }

    // Event listeners
    
    // CONTACT TAILOR BUTTON: Sends an email to the specified address
    contactTailorBtn.addEventListener('click', () => {
        const subject = `Enarmous Tailor Inquiry - ${tailor.name}`;
        const body = `Dear ${tailor.name},\n\nI would like to inquire about your services...`;
        
        // This is the first link to abdulkadher19970407@gmail.com
        window.location.href = `mailto:abdulkadher19970407@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
    
    // MODAL HANDLERS
    bookConsultationBtn.addEventListener('click', () => {
        consultationModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    closeModal.addEventListener('click', () => {
        consultationModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === consultationModal) {
            consultationModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // *** MODIFIED LOGIC: BOOK CONSULTATION to MAILTO ***
    consultationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Get Form Data
        const preferredDate = document.getElementById('consult-date').value;
        const preferredTime = document.getElementById('consult-time').options[document.getElementById('consult-time').selectedIndex].text;
        const notes = document.getElementById('consult-notes').value;

        // 2. Construct Email Body
        const subject = `Consultation Request for ${tailor.name}`;
        const body = `Dear Tailor,\n\nI would like to book a consultation.\n\nTailor: ${tailor.name}\nPreferred Date: ${preferredDate}\nPreferred Time: ${preferredTime}\nSpecial Requests: ${notes || 'None'}\n\nPlease contact me to confirm the booking.`;
        
        // 3. Trigger Mailto
        // This is the second link to abdulkadher19970407@gmail.com
        window.location.href = `mailto:abdulkadher19970407@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // 4. Close Modal and Reset Form
        consultationModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        showNotification('Opening email client for booking request...', 'info');
        consultationForm.reset();
    });
    // *** END MODIFIED CODE ***

    // REVIEW FORM SUBMISSION (Review "Command" is added to the top)
    reviewForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('reviewer-name').value;
        const rating = document.getElementById('review-rating').value;
        const text = document.getElementById('review-text').value;

        // Create new review object (for temporary display)
        const newReview = {
            name: name,
            avatar: 'images/placeholder-avatar.jpg', // Placeholder for new user avatar
            rating: parseInt(rating),
            date: new Date().toISOString().split('T')[0],
            comment: text
        };

        // Add the new review to the display at the top
        addSingleReviewToDisplay(newReview, reviewsContainer);

        // Show thank you message
        thankYouMessage.style.display = 'block';

        // Hide thank you message after 5 seconds
        setTimeout(() => {
            thankYouMessage.style.display = 'none';
        }, 5000);

        // Reset form
        reviewForm.reset();
        
        // Update the displayed review count (client-side only)
        tailor.reviews++; 
        setupRatingStars(tailorRating, tailor.rating);
        reviewCount.textContent = `(${tailor.reviews})`;
    });

    // LOAD MORE BUTTON (Dummy functionality)
    loadMoreReviewsBtn.addEventListener('click', () => {
        showNotification('Loading more reviews...', 'info');
        setTimeout(() => {
            showNotification('No more reviews to load', 'info');
        }, 1000);
    });
    
    // --- Helper Functions ---
    
    function setupRatingStars(container, rating) {
        container.innerHTML = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            if (i <= fullStars) {
                star.className = 'fas fa-star';
            } else if (i === fullStars + 1 && hasHalfStar) {
                star.className = 'fas fa-star-half-alt';
            } else {
                star.className = 'far fa-star';
            }
            container.appendChild(star);
        }
        
        const ratingText = document.createElement('span');
        ratingText.textContent = rating.toFixed(1);
        container.appendChild(ratingText);
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function createReviewCard(review) {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="review-header">
                <div class="reviewer">
                    <div class="reviewer-avatar">
                        <img src="${review.avatar}" alt="${review.name}" style="width: 40px; height: 40px; border-radius: 50%;">
                    </div>
                    <div class="reviewer-info">
                        <h4>${review.name}</h4>
                        <div class="rating"></div>
                    </div>
                </div>
                <div class="review-date">${formatDate(review.date)}</div>
            </div>
            <div class="review-content">
                <p>${review.comment}</p>
            </div>
        `;
        
        const ratingContainer = reviewCard.querySelector('.rating');
        setupRatingStars(ratingContainer, review.rating);
        return reviewCard;
    }

    function loadReviews(reviews) {
        reviewsContainer.innerHTML = '';
        reviews.forEach(review => {
            const reviewCard = createReviewCard(review);
            reviewsContainer.appendChild(reviewCard);
        });
    }

    function addSingleReviewToDisplay(review, container) {
        const reviewCard = createReviewCard(review);
        // Insert the new review at the very top (as requested)
        container.insertBefore(reviewCard, container.firstChild);
    }
});