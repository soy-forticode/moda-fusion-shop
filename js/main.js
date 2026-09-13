/* ===== MENU MOBILE (DEFINITIVO) ===== */
(function() {
    'use strict';
    
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Crear overlay si no existe
    let overlay = document.querySelector('.nav__overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav__overlay';
        document.body.appendChild(overlay);
    }
    
    function openMenu() {
        if (navMenu) {
            navMenu.classList.add('show');
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        }
    }
    
    function closeMenu() {
        if (navMenu) {
            navMenu.classList.remove('show');
            overlay.classList.remove('show');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    }
    
    // Abrir menú
    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openMenu();
        });
    }
    
    // Cerrar menú (botón X)
    if (navClose) {
        navClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        });
    }
    
    // Cerrar al hacer clic en un enlace
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });
    
    // Cerrar al hacer clic en el overlay
    overlay.addEventListener('click', function() {
        closeMenu();
    });
    
    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('show')) {
            closeMenu();
        }
    });
    
    // Cerrar al redimensionar a escritorio
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        }, 100);
    });
    
    console.log('✅ Menú móvil inicializado correctamente');
})();

/* ===== HEADER SCROLL ===== */
(function() {
    const header = document.getElementById('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scroll');
            } else {
                header.classList.remove('scroll');
            }
        });
    }
})();

/* ===== SEARCH ===== */
(function() {
    const searchBtn = document.getElementById('search-btn');
    const searchClose = document.getElementById('search-close');
    const search = document.getElementById('search');
    const searchInput = document.querySelector('.search__input');

    if (searchBtn && search) {
        searchBtn.addEventListener('click', function() {
            search.classList.add('show');
            if (searchInput) {
                setTimeout(function() {
                    searchInput.focus();
                }, 300);
            }
        });
    }

    if (searchClose && search) {
        searchClose.addEventListener('click', function() {
            search.classList.remove('show');
        });
    }

    // Cerrar búsqueda con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && search && search.classList.contains('show')) {
            search.classList.remove('show');
        }
    });

    // Cerrar búsqueda al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (search && search.classList.contains('show')) {
            if (!search.contains(e.target) && !searchBtn.contains(e.target)) {
                search.classList.remove('show');
            }
        }
    });
})();

/* ===== SCROLL UP ===== */
(function() {
    const scrollUp = document.getElementById('scroll-up');
    
    if (scrollUp) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 400) {
                scrollUp.classList.add('show');
            } else {
                scrollUp.classList.remove('show');
            }
        });
        
        scrollUp.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
})();

/* ===== ACTIVE NAV LINK ===== */
(function() {
    const navLinks = document.querySelectorAll('.nav__link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === 'index.html' && href === '#')) {
            link.classList.add('active-link');
        }
        
        link.addEventListener('click', function() {
            navLinks.forEach(function(l) {
                l.classList.remove('active-link');
            });
            link.classList.add('active-link');
        });
    });
})();

/* ===== FILTROS DE PRODUCTOS ===== */
(function() {
    const filters = document.querySelectorAll('.products__filter');
    const productsContainer = document.getElementById('products-container');
    
    if (filters.length > 0 && productsContainer) {
        filters.forEach(function(filter) {
            filter.addEventListener('click', function() {
                filters.forEach(function(f) {
                    f.classList.remove('active');
                });
                filter.classList.add('active');
                
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
})();

/* ===== SELECTOR DE COLORES ===== */
(function() {
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
})();

/* ===== ANIMACIONES AL SCROLL ===== */
(function() {
    const animateElements = document.querySelectorAll(
        '.products__card, .categories__card, .testimonials__card, .offers__container'
    );
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animateElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    } else {
        // Fallback para navegadores antiguos
        animateElements.forEach(function(el) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }
})();

/* ===== NEWSLETTER ===== */
(function() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                alert('¡Gracias por suscribirte ' + emailInput.value + '! Revisa tu correo para el descuento.');
                newsletterForm.reset();
                // Guardar en localStorage
                try {
                    let subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
                    subscribers.push({
                        email: emailInput.value,
                        date: new Date().toISOString()
                    });
                    localStorage.setItem('subscribers', JSON.stringify(subscribers));
                } catch (e) {
                    // Si localStorage no está disponible, ignorar
                }
            }
        });
    }
})();


/* ===== PRODUCTOS POR CATEGORÍA EN LA PÁGINA DE PRODUCTOS ===== */
(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria');
    
    if (categoria) {
        const filters = document.querySelectorAll('.products__filter');
        filters.forEach(function(filter) {
            if (filter.getAttribute('data-filter') === categoria) {
                filter.click();
            }
        });
    }
})();

/* ===== CERRAR TOASTS ===== */
document.addEventListener('click', function(e) {
    if (e.target.closest('.toast__close')) {
        const toast = e.target.closest('.toast');
        if (toast) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(function() {
                toast.remove();
            }, 300);
        }
    }
});

console.log('Moda Fusión - Tienda Online');
console.log('Desarrollado por FortiCode Dev');
console.log('© 2026 Todos los derechos reservados');