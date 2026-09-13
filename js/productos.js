/* ===== PRODUCTOS.JS - Lógica de Productos ===== */
(function() {
    'use strict';
    
    // ===== FILTROS =====
    const filters = document.querySelectorAll('.products__filter');
    const productsContainer = document.getElementById('products-container');
    
    if (filters.length > 0 && productsContainer) {
        filters.forEach(function(filter) {
            filter.addEventListener('click', function() {
                // Actualizar filtro activo
                filters.forEach(function(f) {
                    f.classList.remove('active');
                });
                filter.classList.add('active');
                
                // Filtrar productos
                const filterValue = filter.getAttribute('data-filter');
                const products = productsContainer.querySelectorAll('.products__card');
                
                products.forEach(function(product) {
                    const category = product.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        product.style.display = 'block';
                        // Animación de entrada
                        product.style.opacity = '0';
                        product.style.transform = 'scale(0.9)';
                        setTimeout(function() {
                            product.style.opacity = '1';
                            product.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // ===== FILTRO POR URL (categoría desde enlace) =====
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria');
    
    if (categoria) {
        filters.forEach(function(filter) {
            if (filter.getAttribute('data-filter') === categoria) {
                filter.click();
            }
        });
    }
    
    // ===== SELECTOR DE COLORES =====
    const colorSelectors = document.querySelectorAll('.products__color');
    
    colorSelectors.forEach(function(color) {
        color.addEventListener('click', function(e) {
            e.stopPropagation();
            const parent = color.closest('.products__card-colors');
            if (parent) {
                parent.querySelectorAll('.products__color').forEach(function(c) {
                    c.classList.remove('active');
                });
                color.classList.add('active');
            }
        });
    });
    
    // ===== BÚSQUEDA =====
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            const searchTerm = this.value.toLowerCase().trim();
            const products = document.querySelectorAll('.products__card');
            
            products.forEach(function(product) {
                const title = product.querySelector('.products__card-title');
                const category = product.querySelector('.products__card-category');
                
                if (title && category) {
                    const titleText = title.textContent.toLowerCase();
                    const categoryText = category.textContent.toLowerCase();
                    
                    if (titleText.includes(searchTerm) || categoryText.includes(searchTerm) || searchTerm === '') {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                }
            });
        });
    }
    
    console.log('✅ productos.js cargado correctamente');
})();