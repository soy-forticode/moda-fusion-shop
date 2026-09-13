/* ===== CHECKOUT.JS - Lógica de Pago ===== */
(function() {
    'use strict';
    
    // ===== CARGAR DATOS DEL CARRITO =====
    function loadCheckoutData() {
        const cart = window.cart ? window.cart.getCart() : [];
        const itemsContainer = document.getElementById('checkout-items');
        const subtotalEl = document.getElementById('checkout-subtotal');
        const shippingEl = document.getElementById('checkout-shipping');
        const totalSummaryEl = document.getElementById('checkout-total-summary');
        const totalBtnEl = document.getElementById('checkout-total');
        
        if (!itemsContainer) return;
        
        // Si el carrito está vacío, redirigir
        if (cart.length === 0) {
            window.location.href = 'carrito.html';
            return;
        }
        
        // Renderizar items
        itemsContainer.innerHTML = '';
        cart.forEach(function(item) {
            const itemEl = document.createElement('div');
            itemEl.className = 'checkout__item';
            itemEl.innerHTML = `
                <span class="checkout__item-name">${item.title || 'Producto'}</span>
                <span class="checkout__item-qty">x${item.quantity || 1}</span>
                <span class="checkout__item-price">€${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
            `;
            itemsContainer.appendChild(itemEl);
        });
        
        // Calcular totales
        const subtotal = window.cart ? window.cart.getTotalPrice() : 0;
        const shipping = subtotal > 50 ? 0 : 4.99;
        const total = subtotal + shipping;
        
        if (subtotalEl) subtotalEl.textContent = '€' + subtotal.toFixed(2);
        if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Gratis' : '€' + shipping.toFixed(2);
        if (totalSummaryEl) totalSummaryEl.textContent = '€' + total.toFixed(2);
        if (totalBtnEl) totalBtnEl.textContent = total.toFixed(2);
    }
    
    // ===== MÉTODOS DE PAGO =====
    function setupPaymentMethods() {
        const paymentOptions = document.querySelectorAll('input[name="payment"]');
        const cardInfo = document.getElementById('card-info');
        
        paymentOptions.forEach(function(option) {
            option.addEventListener('change', function() {
                if (this.value === 'stripe') {
                    if (cardInfo) cardInfo.classList.add('show');
                } else {
                    if (cardInfo) cardInfo.classList.remove('show');
                }
            });
        });
    }
    
    // ===== FORMATEAR NÚMERO DE TARJETA =====
    function setupCardFormatting() {
        const cardNumber = document.getElementById('card-number');
        const cardExpiry = document.getElementById('card-expiry');
        
        if (cardNumber) {
            cardNumber.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\s/g, '');
                value = value.replace(/\D/g, '');
                value = value.match(/.{1,4}/g);
                if (value) {
                    e.target.value = value.join(' ');
                }
            });
        }
        
        if (cardExpiry) {
            cardExpiry.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }
    }
    
    // ===== ENVÍO DEL FORMULARIO =====
    function setupFormSubmit() {
        const form = document.getElementById('checkout-form');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar campos
            const name = document.getElementById('checkout-name');
            const email = document.getElementById('checkout-email');
            const phone = document.getElementById('checkout-phone');
            const address = document.getElementById('checkout-address');
            const city = document.getElementById('checkout-city');
            const zip = document.getElementById('checkout-zip');
            const terms = document.getElementById('checkout-terms');
            
            if (!name.value || !email.value || !phone.value || !address.value || !city.value || !zip.value) {
                alert('Por favor, completa todos los campos requeridos.');
                return;
            }
            
            if (!terms.checked) {
                alert('Debes aceptar los términos y condiciones.');
                return;
            }
            
            // Simular proceso de pago
            const submitBtn = document.getElementById('checkout-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando pago...';
            submitBtn.disabled = true;
            
            setTimeout(function() {
                // Guardar pedido en localStorage
                const order = {
                    id: 'MF-' + Date.now(),
                    date: new Date().toISOString(),
                    customer: {
                        name: name.value,
                        email: email.value,
                        phone: phone.value,
                        address: address.value,
                        city: city.value,
                        zip: zip.value,
                        country: document.getElementById('checkout-country').value
                    },
                    items: window.cart ? window.cart.getCart() : [],
                    total: window.cart ? window.cart.getTotalPrice() : 0,
                    payment: document.querySelector('input[name="payment"]:checked').value,
                    status: 'completado'
                };
                
                localStorage.setItem('moda_fusion_last_order', JSON.stringify(order));
                
                // Vaciar carrito
                localStorage.removeItem('moda_fusion_cart');
                
                // Mostrar éxito y redirigir
                alert('¡Pago realizado con éxito! Gracias por tu compra.');
                window.location.href = 'index.html';
            }, 2000);
        });
    }
    
    // ===== INICIALIZAR =====
    function init() {
        loadCheckoutData();
        setupPaymentMethods();
        setupCardFormatting();
        setupFormSubmit();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('✅ checkout.js cargado correctamente');
})();