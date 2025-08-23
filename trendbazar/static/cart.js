// Shopping Cart JavaScript with Local Storage
class ShoppingCart {
    constructor() {
        this.cart = this.loadCartFromStorage();
        this.cartModal = document.getElementById('cartModal');
        this.cartBtn = document.getElementById('cartBtn');
        this.closeCart = document.getElementById('closeCart');
        this.cartCount = document.getElementById('cartCount');
        this.cartItems = document.getElementById('cartItems');
        this.cartTotal = document.getElementById('cartTotal');
        this.clearCartBtn = document.getElementById('clearCart');
        
        this.initializeEventListeners();
        this.updateCartDisplay();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Cart modal controls
        this.cartBtn.addEventListener('click', () => this.openCartModal());
        this.closeCart.addEventListener('click', () => this.closeCartModal());
        this.clearCartBtn.addEventListener('click', () => this.clearCart());
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.cartModal) {
                this.closeCartModal();
            }
        });

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.addToCart(e));
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.cartModal.style.display === 'flex') {
                this.closeCartModal();
            }
        });
    }

    // Load cart from localStorage
    loadCartFromStorage() {
        const savedCart = localStorage.getItem('trendBazarCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCartToStorage() {
        localStorage.setItem('trendBazarCart', JSON.stringify(this.cart));
    }

    // Add product to cart
    addToCart(event) {
        const btn = event.currentTarget;
        const productId = btn.dataset.productId;
        const productName = btn.dataset.productName;
        const productPrice = parseFloat(btn.dataset.productPrice);
        const productImage = btn.dataset.productImage;

        // Check if product already exists in cart
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
            this.showNotification(`${productName} quantity updated!`, 'success');
        } else {
            this.cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
            this.showNotification(`${productName} added to cart!`, 'success');
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        this.animateCartButton();
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.showNotification('Item removed from cart!', 'info');
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCartToStorage();
                this.updateCartDisplay();
            }
        }
    }

    // Clear entire cart
    clearCart() {
        if (this.cart.length === 0) {
            this.showNotification('Cart is already empty!', 'info');
            return;
        }
        
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCartToStorage();
            this.updateCartDisplay();
            this.showNotification('Cart cleared!', 'info');
        }
    }

    // Calculate total price
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get total item count
    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Update cart display
    updateCartDisplay() {
        // Update cart count badge
        const count = this.getCartCount();
        this.cartCount.textContent = count;
        this.cartCount.style.display = count > 0 ? 'flex' : 'none';

        // Update cart total
        this.cartTotal.textContent = this.getCartTotal().toFixed(2);

        // Update cart items display
        this.updateCartItems();
    }

    // Update cart items in modal
    updateCartItems() {
        if (this.cart.length === 0) {
            this.cartItems.innerHTML = '<p class="empty-cart"><i class="fas fa-shopping-cart"></i> Your cart is empty</p>';
            return;
        }

        this.cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-item" onclick="cart.removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="cart-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `).join('');
    }

    // Open cart modal
    openCartModal() {
        this.cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.cartModal.classList.add('cart-modal-open');
    }

    // Close cart modal
    closeCartModal() {
        this.cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.cartModal.classList.remove('cart-modal-open');
    }

    // Animate cart button when item is added
    animateCartButton() {
        this.cartBtn.classList.add('cart-bounce');
        setTimeout(() => {
            this.cartBtn.classList.remove('cart-bounce');
        }, 600);
    }

    // Show notification
    showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('notification-show');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('notification-show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShoppingCart();
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation to images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
});

// Add hover effects to product cards
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});
