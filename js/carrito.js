/* ===== CARRITO.JS - Gestión del Carrito (VERSIÓN CORREGIDA) ===== */
(function() {
    'use strict';
    
    const CART_KEY = 'moda_fusion_cart';
    
    // ===== FUNCIONES PRINCIPALES =====
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch (e) {
            return [];
        }
    }
    
    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartBadge();
        return cart;
    }
    
    function addToCart(productId, title, price, image, category) {
        let cart = getCart();
        const existingProduct = cart.find(function(item) {
            return item.id === productId;
        });
        
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                id: productId,
                title: title || 'Producto',
                price: price || 0,
                image: image || '',
                category: category || 'Producto',
                quantity: 1
            });
        }
        
        saveCart(cart);
        return cart;
    }
    
    function removeFromCart(productId) {
        let cart = getCart();
        cart = cart.filter(function(item) {
            return item.id !== productId;
        });
        saveCart(cart);
        return cart;
    }
    
    function updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            return removeFromCart(productId);
        }
        
        let cart = getCart();
        const product = cart.find(function(item) {
            return item.id === productId;
        });
        
        if (product) {
            product.quantity = quantity;
            saveCart(cart);
        }
        return cart;
    }
    
    function getTotalItems() {
        const cart = getCart();
        return cart.reduce(function(sum, item) {
            return sum + (item.quantity || 1);
        }, 0);
    }
    
    function getTotalPrice() {
        const cart = getCart();
        return cart.reduce(function(sum, item) {
            return sum + ((item.price || 0) * (item.quantity || 1));
        }, 0);
    }
    
    // ===== ACTUALIZAR BADGE =====
    function updateCartBadge() {
        const badge = document.querySelector('.nav__cart-badge');
        if (badge) {
            const total = getTotalItems();
            badge.textContent = total;
            badge.style.display = total > 0 ? 'flex' : 'none';
        }
    }
    
    // ===== RENDERIZAR CARRITO =====
    function renderCart() {
        const cartContainer = document.getElementById('cart-items');
        const emptyContainer = document.getElementById('cart-empty');
        const contentContainer = document.getElementById('cart-content');
        const subtotalEl = document.getElementById('cart-subtotal');
        const shippingEl = document.getElementById('cart-shipping');
        const totalEl = document.getElementById('cart-total');
        
        if (!cartContainer) return;
        
        const cart = getCart();
        
        // Mostrar/ocultar carrito vacío
        if (cart.length === 0) {
            if (emptyContainer) emptyContainer.style.display = 'block';
            if (contentContainer) contentContainer.style.display = 'none';
            return;
        }
        
        if (emptyContainer) emptyContainer.style.display = 'none';
        if (contentContainer) contentContainer.style.display = 'block';
        
        // Renderizar items
        cartContainer.innerHTML = '';
        
        cart.forEach(function(item) {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart__item';
            
            // Asegurar que la imagen tenga ruta correcta
            let imagePath = item.image || '';
            if (imagePath && !imagePath.startsWith('assets/') && !imagePath.startsWith('http')) {
                imagePath = 'assets/img/productos/' + imagePath;
            }
            
            itemEl.innerHTML = `
                <div class="cart__item-image">
                    <img src="${imagePath || 'assets/img/placeholder.jpg'}" alt="${item.title || 'Producto'}" loading="lazy" onerror="this.src='assets/img/placeholder.jpg'">
                </div>
                <div class="cart__item-info">
                    <h4>${item.title || 'Producto'}</h4>
                    <span class="cart__item-category">${item.category || 'Producto'}</span>
                    <span class="cart__item-price">€${(item.price || 0).toFixed(2)}</span>
                </div>
                <div class="cart__item-actions">
                    <div class="cart__item-quantity">
                        <button class="cart__qty-btn" data-id="${item.id}" data-action="decrease">−</button>
                        <span class="cart__qty-value">${item.quantity || 1}</span>
                        <button class="cart__qty-btn" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                    <button class="cart__item-remove" data-id="${item.id}" aria-label="Eliminar producto">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            cartContainer.appendChild(itemEl);
        });
        
        // Actualizar totales
        const subtotal = getTotalPrice();
        const shipping = subtotal > 50 ? 0 : 4.99;
        const total = subtotal + shipping;
        
        if (subtotalEl) subtotalEl.textContent = '€' + subtotal.toFixed(2);
        if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Gratis' : '€' + shipping.toFixed(2);
        if (totalEl) totalEl.textContent = '€' + total.toFixed(2);
        
        // Eventos de los botones
        document.querySelectorAll('.cart__qty-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = this.getAttribute('data-id');
                const action = this.getAttribute('data-action');
                const cart = getCart();
                const product = cart.find(function(item) {
                    return item.id === id;
                });
                
                if (product) {
                    if (action === 'increase') {
                        updateQuantity(id, (product.quantity || 1) + 1);
                    } else if (action === 'decrease') {
                        updateQuantity(id, (product.quantity || 1) - 1);
                    }
                    renderCart();
                }
            });
        });
        
        document.querySelectorAll('.cart__item-remove').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = this.getAttribute('data-id');
                removeFromCart(id);
                renderCart();
            });
        });
    }
    
    // ===== AÑADIR AL CARRITO (FUNCIÓN MEJORADA) =====
    function setupAddToCartButtons() {
        const buttons = document.querySelectorAll('.products__card-cart');
        
        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const card = this.closest('.products__card');
                if (!card) {
                    console.warn('No se encontró la tarjeta del producto');
                    return;
                }
                
                // Obtener datos del producto
                const id = this.getAttribute('data-id');
                const titleEl = card.querySelector('.products__card-title');
                const priceEl = card.querySelector('.products__card-price');
                const imageEl = card.querySelector('.products__card-image img');
                const categoryEl = card.querySelector('.products__card-category');
                
                // Debug: ver qué estamos obteniendo
                console.log('ID:', id);
                console.log('Título:', titleEl ? titleEl.textContent : 'No encontrado');
                console.log('Precio:', priceEl ? priceEl.textContent : 'No encontrado');
                
                if (!titleEl || !priceEl || !imageEl) {
                    console.warn('Faltan datos del producto');
                    return;
                }
                
                const title = titleEl.textContent.trim();
                const image = imageEl.getAttribute('src') || '';
                const category = categoryEl ? categoryEl.textContent.trim() : 'Producto';
                
                // Extraer precio correctamente
                let priceText = priceEl.textContent.trim();
                let price = parseFloat(priceText.replace('€', '').replace(',', '.').trim());
                
                // Si tiene precio con descuento (ej: "€49.99 €39.99")
                const oldPrice = priceEl.querySelector('.price-old');
                if (oldPrice) {
                    const newPriceText = priceEl.textContent.replace(oldPrice.textContent, '').trim();
                    price = parseFloat(newPriceText.replace('€', '').replace(',', '.').trim());
                }
                
                if (isNaN(price)) {
                    console.warn('Precio inválido:', priceText);
                    price = 0;
                }
                
                console.log('Añadiendo al carrito:', { id, title, price, image, category });
                
                // Añadir al carrito
                addToCart(id, title, price, image, category);
                
                // Actualizar badge
                updateCartBadge();
                
                // Feedback visual
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> ¡Añadido!';
                this.classList.add('added');
                setTimeout(function() {
                    this.innerHTML = originalText;
                    this.classList.remove('added');
                }.bind(this), 1500);
            });
        });
    }
    
    // ===== INICIALIZAR =====
    function init() {
        console.log('🛒 Inicializando carrito...');
        updateCartBadge();
        setupAddToCartButtons();
        
        if (document.getElementById('cart-items')) {
            renderCart();
        }
        
        console.log('✅ carrito.js cargado correctamente');
        console.log('📦 Carrito actual:', getCart());
    }
    
    // ===== EXPONER FUNCIONES =====
    window.cart = {
        getCart: getCart,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        updateQuantity: updateQuantity,
        getTotalItems: getTotalItems,
        getTotalPrice: getTotalPrice,
        renderCart: renderCart,
        updateCartBadge: updateCartBadge
    };
    
    // Ejecutar al cargar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();