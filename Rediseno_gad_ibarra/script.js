// =========================================== //
// script.js - GAD Ibarra Responsive          //
// =========================================== //

class GADIbarraApp {
    constructor() {
        this.init();
    }

    // ===== INICIALIZACIÓN PRINCIPAL =====
    init() {
        console.log('🚀 Iniciando aplicación GAD Ibarra...');
        
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        try {
            // Inicializar todos los módulos
            this.setupTheme();
            this.setupNavigation();
            this.setupSearch();
            this.setupHeroSlider();
            this.setupForms();
            this.setupStats();
            this.setupAccessibility();
            this.setupChat();
            this.setupNotifications();
            this.setupScrollEffects();
            this.setupMobileNavigation();
            this.setupModals();
            this.setupServiceWorker();
            
            // Configurar eventos globales
            this.setupGlobalEvents();
            
            console.log('✅ Aplicación inicializada correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar la aplicación:', error);
        }
    }

    // ===== MANEJO DEL TEMA =====
    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Cargar tema guardado o usar preferencias del sistema
        const savedTheme = localStorage.getItem('theme') || 
                          (prefersDark.matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Actualizar ícono del botón
        this.updateThemeIcon(savedTheme);
        
        // Configurar evento del botón
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon(newTheme);
                
                // Notificar cambio
                this.showNotification(`Tema ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`, 'info');
            });
        }
        
        // Escuchar cambios en preferencias del sistema
        prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                this.updateThemeIcon(newTheme);
            }
        });
    }
    
    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                themeToggle.setAttribute('title', `Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`);
            }
        }
    }

    // ===== NAVEGACIÓN PRINCIPAL =====
    setupNavigation() {
        const menuToggle = document.getElementById('mainMenuToggle');
        const mainNav = document.getElementById('mainNav');
        const dropdowns = document.querySelectorAll('.dropdown');
        
        // Menú hamburguesa
        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                mainNav.classList.toggle('active');
                
                // Cambiar ícono
                const icons = menuToggle.querySelectorAll('.menu-icon');
                icons.forEach(icon => icon.style.backgroundColor = 
                    document.documentElement.getAttribute('data-theme') === 'dark' ? '#e5e7eb' : '#374151');
            });
            
            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mainNav.classList.remove('active');
                }
            });
            
            // Cerrar menú al presionar Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mainNav.classList.remove('active');
                }
            });
        }
        
        // Dropdowns
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (toggle && menu) {
                // En móvil: toggle con click
                if (window.innerWidth < 1024) {
                    toggle.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Cerrar otros dropdowns
                        dropdowns.forEach(other => {
                            if (other !== dropdown) {
                                other.querySelector('.dropdown-menu').style.display = 'none';
                            }
                        });
                        
                        // Toggle este dropdown
                        const isVisible = menu.style.display === 'block';
                        menu.style.display = isVisible ? 'none' : 'block';
                    });
                }
                
                // En escritorio: hover
                if (window.innerWidth >= 1024) {
                    dropdown.addEventListener('mouseenter', () => {
                        menu.style.display = 'block';
                    });
                    
                    dropdown.addEventListener('mouseleave', () => {
                        menu.style.display = 'none';
                    });
                }
            }
        });
        
        // Reconfigurar dropdowns al cambiar tamaño de ventana
        window.addEventListener('resize', () => {
            dropdowns.forEach(dropdown => {
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) {
                    if (window.innerWidth < 1024) {
                        menu.style.display = 'none';
                    } else {
                        menu.style.display = '';
                    }
                }
            });
        });
    }

    // ===== BÚSQUEDA =====
    setupSearch() {
        const searchToggle = document.getElementById('searchToggle');
        const searchContainer = document.getElementById('searchContainer');
        const searchClose = document.getElementById('searchClose');
        const searchForm = document.querySelector('.search-form');
        
        if (searchToggle && searchContainer) {
            searchToggle.addEventListener('click', () => {
                searchContainer.classList.add('active');
                const input = searchContainer.querySelector('input');
                if (input) {
                    input.focus();
                }
            });
            
            if (searchClose) {
                searchClose.addEventListener('click', () => {
                    searchContainer.classList.remove('active');
                });
            }
            
            if (searchForm) {
                searchForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const input = searchForm.querySelector('input');
                    if (input && input.value.trim()) {
                        this.performSearch(input.value.trim());
                    }
                });
            }
            
            // Cerrar búsqueda con Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && searchContainer.classList.contains('active')) {
                    searchContainer.classList.remove('active');
                }
            });
        }
    }
    
    performSearch(query) {
        console.log('🔍 Buscando:', query);
        // En una aplicación real, aquí se haría una petición AJAX
        this.showNotification(`Buscando: "${query}"`, 'info');
        
        // Simular búsqueda
        setTimeout(() => {
            this.showNotification(`Se encontraron resultados para "${query}"`, 'success');
        }, 1000);
    }

    // ===== CARRUSEL HERO =====
    setupHeroSlider() {
        const slider = document.getElementById('heroSlider');
        if (!slider) return;
        
        const slides = slider.querySelectorAll('.hero-slide');
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');
        const indicators = slider.querySelectorAll('.indicator');
        
        let currentSlide = 0;
        let slideInterval;
        
        // Función para mostrar un slide específico
        const showSlide = (index) => {
            // Validar índice
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            // Ocultar todos los slides
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // Mostrar slide actual
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
            
            currentSlide = index;
        };
        
        // Función para siguiente slide
        const nextSlide = () => {
            showSlide(currentSlide + 1);
        };
        
        // Función para slide anterior
        const prevSlide = () => {
            showSlide(currentSlide - 1);
        };
        
        // Configurar botones
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // Configurar indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
                resetInterval();
            });
        });
        
        // Auto avance
        const startInterval = () => {
            slideInterval = setInterval(nextSlide, 5000);
        };
        
        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };
        
        // Pausar al hacer hover
        slider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            startInterval();
        });
        
        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
        
        // Iniciar
        startInterval();
        
        // Asegurar que el primer slide sea visible
        showSlide(0);
    }

    // ===== FORMULARIOS =====
    setupForms() {
        // Formulario de contacto
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (this.validateForm(contactForm)) {
                    this.submitForm(contactForm);
                }
            });
            
            // Validación en tiempo real
            const inputs = contactForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        }
        
        // Newsletter
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = form.querySelector('input[type="email"]');
                
                if (email && this.validateEmail(email.value)) {
                    this.showNotification('¡Gracias por suscribirte!', 'success');
                    form.reset();
                } else {
                    this.showNotification('Por favor, introduce un email válido', 'error');
                }
            });
        });
    }
    
    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';
        
        // Limpiar errores previos
        this.clearFieldError(field);
        
        // Validaciones específicas
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'Este campo es obligatorio';
        } else if (field.type === 'email' && value) {
            if (!this.validateEmail(value)) {
                isValid = false;
                message = 'Introduce un email válido';
            }
        } else if (field.type === 'tel' && value) {
            if (!this.validatePhone(value)) {
                isValid = false;
                message = 'Introduce un teléfono válido';
            }
        }
        
        // Mostrar error si es necesario
        if (!isValid) {
            this.showFieldError(field, message);
        } else {
            field.classList.add('valid');
        }
        
        return isValid;
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    validatePhone(phone) {
        const re = /^[\d\s\-\+\(\)]{7,15}$/;
        return re.test(phone);
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        field.classList.remove('valid');
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    async submitForm(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        
        try {
            // Mostrar estado de carga
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            }
            
            // Simular envío (en producción sería una petición real)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Éxito
            this.showNotification('Mensaje enviado correctamente', 'success');
            form.reset();
            
            // Limpiar clases de validación
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.classList.remove('valid');
            });
            
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            this.showNotification('Error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
        } finally {
            // Restaurar botón
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }
    }

    // ===== ESTADÍSTICAS ANIMADAS =====
    setupStats() {
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        
        if (statNumbers.length === 0) return;
        
        // Observer para animar cuando sean visibles
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target;
                    const target = parseInt(statNumber.getAttribute('data-count'));
                    
                    this.animateCounter(statNumber, target);
                    observer.unobserve(statNumber);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }
    
    animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const duration = 2000; // 2 segundos
        const steps = 60; // 60 FPS
        const stepDuration = duration / steps;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Formatear número
            let display;
            if (target >= 1000) {
                display = Math.floor(current).toLocaleString();
            } else if (target >= 100) {
                display = Math.floor(current);
            } else {
                display = current.toFixed(1);
            }
            
            element.textContent = display;
        }, stepDuration);
    }

    // ===== ACCESIBILIDAD =====
    setupAccessibility() {
        const accessibilityToggle = document.getElementById('accessibilityToggleBtn');
        const accessibilityMenu = document.querySelector('.accessibility-menu');
        
        // Toggle menú de accesibilidad
        if (accessibilityToggle && accessibilityMenu) {
            accessibilityToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                accessibilityMenu.classList.toggle('active');
            });
            
            // Cerrar al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!accessibilityMenu.contains(e.target)) {
                    accessibilityMenu.classList.remove('active');
                }
            });
        }
        
        // Alto contraste
        const highContrastToggle = document.getElementById('highContrastToggle');
        if (highContrastToggle) {
            highContrastToggle.addEventListener('click', () => {
                document.body.classList.toggle('high-contrast');
                const isActive = document.body.classList.contains('high-contrast');
                
                this.showNotification(
                    `Modo alto contraste ${isActive ? 'activado' : 'desactivado'}`,
                    'info'
                );
                
                // Guardar preferencia
                localStorage.setItem('highContrast', isActive ? 'true' : 'false');
            });
            
            // Cargar preferencia guardada
            if (localStorage.getItem('highContrast') === 'true') {
                document.body.classList.add('high-contrast');
            }
        }
        
        // Lectura en voz alta
        const textToSpeechToggle = document.getElementById('textToSpeechToggle');
        if (textToSpeechToggle && 'speechSynthesis' in window) {
            let isSpeaking = false;
            
            textToSpeechToggle.addEventListener('click', () => {
                if (isSpeaking) {
                    window.speechSynthesis.cancel();
                    isSpeaking = false;
                    this.showNotification('Lectura detenida', 'info');
                } else {
                    this.readPageContent();
                    isSpeaking = true;
                    this.showNotification('Leyendo contenido...', 'info');
                }
            });
        }
        
        // Diseño simplificado
        const simpleLayoutToggle = document.getElementById('simpleLayoutToggle');
        if (simpleLayoutToggle) {
            simpleLayoutToggle.addEventListener('click', () => {
                document.body.classList.toggle('simple-layout');
                const isActive = document.body.classList.contains('simple-layout');
                
                this.showNotification(
                    `Diseño simplificado ${isActive ? 'activado' : 'desactivado'}`,
                    'info'
                );
                
                localStorage.setItem('simpleLayout', isActive ? 'true' : 'false');
            });
            
            // Cargar preferencia guardada
            if (localStorage.getItem('simpleLayout') === 'true') {
                document.body.classList.add('simple-layout');
            }
        }
    }
    
    readPageContent() {
        const mainContent = document.querySelector('main');
        if (!mainContent) return;
        
        // Obtener texto importante
        const headings = mainContent.querySelectorAll('h1, h2, h3');
        const paragraphs = mainContent.querySelectorAll('p');
        
        let text = '';
        
        headings.forEach((heading, index) => {
            text += `Título ${index + 1}: ${heading.textContent}. `;
        });
        
        paragraphs.forEach((paragraph, index) => {
            if (index < 5) { // Limitar a primeros 5 párrafos
                text += `${paragraph.textContent}. `;
            }
        });
        
        // Configurar y leer
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = () => {
            this.showNotification('Lectura completada', 'success');
        };
        
        window.speechSynthesis.speak(utterance);
    }

    // ===== CHAT =====
    setupChat() {
        const chatToggle = document.getElementById('chatToggle');
        const chatClose = document.getElementById('chatClose');
        const chatWidget = document.querySelector('.chat-widget');
        const chatSend = document.getElementById('chatSend');
        const chatInput = document.getElementById('chatInput');
        const chatMessages = document.getElementById('chatMessages');
        
        if (!chatWidget) return;
        
        // Toggle chat
        if (chatToggle) {
            chatToggle.addEventListener('click', () => {
                chatWidget.classList.toggle('active');
            });
        }
        
        // Cerrar chat
        if (chatClose) {
            chatClose.addEventListener('click', () => {
                chatWidget.classList.remove('active');
            });
        }
        
        // Enviar mensaje
        if (chatSend && chatInput && chatMessages) {
            const sendMessage = () => {
                const message = chatInput.value.trim();
                if (message) {
                    this.addChatMessage('user', message);
                    chatInput.value = '';
                    
                    // Simular respuesta automática
                    setTimeout(() => {
                        this.getChatResponse(message);
                    }, 1000);
                }
            };
            
            chatSend.addEventListener('click', sendMessage);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
        
        // Cargar mensajes iniciales
        this.loadInitialChatMessages();
    }
    
    addChatMessage(sender, text) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const time = new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(text)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Actualizar badge
        this.updateChatBadge();
    }
    
    loadInitialChatMessages() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        // Mensaje de bienvenida
        const welcomeMessage = `¡Hola! Soy el asistente virtual del GAD Ibarra. ¿En qué puedo ayudarte? Puedes preguntarme sobre trámites, servicios o información general del municipio.`;
        
        setTimeout(() => {
            this.addChatMessage('bot', welcomeMessage);
        }, 500);
    }
    
    getChatResponse(userMessage) {
        const responses = {
            'hola': '¡Hola! ¿Cómo puedo ayudarte hoy?',
            'tramite': 'Puedes iniciar trámites desde nuestra sección de Servicios en Línea. ¿Te interesa algún trámite en particular?',
            'pago': 'Los pagos municipales se pueden realizar en línea a través de la opción "Pago de Impuestos" o de forma presencial en nuestras oficinas.',
            'horario': 'Nuestro horario de atención es de lunes a viernes de 8:00 a 17:00. La atención presencial requiere cita previa.',
            'contacto': 'Puedes contactarnos al (06) 237-0020 o al correo info@ibarra.gob.ec',
            'servicio': 'Ofrecemos múltiples servicios: pago en línea, trámites digitales, consulta de deudas, permisos y licencias. ¿Cuál te interesa?'
        };
        
        const lowerMessage = userMessage.toLowerCase();
        let response = 'Gracias por tu consulta. Para información más detallada, te recomiendo visitar las secciones específicas de nuestro sitio web o contactarnos directamente.';
        
        // Buscar respuesta en el diccionario
        for (const [key, value] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                response = value;
                break;
            }
        }
        
        this.addChatMessage('bot', response);
    }
    
    updateChatBadge() {
        const badge = document.querySelector('.chat-badge');
        if (badge) {
            const current = parseInt(badge.textContent) || 0;
            badge.textContent = current + 1;
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===== NOTIFICACIONES =====
    setupNotifications() {
        // Contenedor ya está en el HTML
    }
    
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        // Ícono según tipo
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        if (type === 'error') icon = 'times-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <div class="notification-content">
                <p>${this.escapeHtml(message)}</p>
            </div>
            <button class="notification-close" aria-label="Cerrar notificación">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Auto-remover después de la duración
        const timer = setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
        
        // Configurar botón de cerrar
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearTimeout(timer);
                this.removeNotification(notification);
            });
        }
        
        // Animar entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        return notification;
    }
    
    removeNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // ===== EFECTOS DE SCROLL =====
    setupScrollEffects() {
        // Botón "volver arriba"
        const backToTop = document.getElementById('backToTop');
        
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });
            
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        // Animación al hacer scroll
        this.setupScrollAnimations();
    }
    
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.service-card, .news-card, .stat-card, .event-card'
        );
        
        if (animatedElements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        animatedElements.forEach(element => observer.observe(element));
    }

    // ===== NAVEGACIÓN MÓVIL =====
    setupMobileNavigation() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mainNav = document.getElementById('mainNav');
        
        if (mobileMenuToggle && mainNav) {
            mobileMenuToggle.addEventListener('click', () => {
                mainNav.classList.toggle('active');
            });
        }
        
        // Cerrar menú al hacer clic en enlace
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 1024) {
                    mainNav.classList.remove('active');
                    
                    // Cerrar dropdowns en móvil
                    const dropdowns = document.querySelectorAll('.dropdown-menu');
                    dropdowns.forEach(dropdown => {
                        dropdown.style.display = 'none';
                    });
                }
            });
        });
    }

    // ===== MODALES =====
    setupModals() {
        const modal = document.getElementById('newsletterModal');
        const modalClose = document.getElementById('modalClose');
        
        // Cerrar modal
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
        
        // Cerrar al hacer clic fuera
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
            
            // Cerrar con Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                }
            });
            
            // Mostrar modal después de 10 segundos (solo primera visita)
            if (!localStorage.getItem('newsletterShown')) {
                setTimeout(() => {
                    modal.classList.add('active');
                    localStorage.setItem('newsletterShown', 'true');
                }, 10000);
            }
        }
    }

    // ===== SERVICE WORKER =====
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(registration => {
                        console.log('✅ ServiceWorker registrado:', registration.scope);
                    })
                    .catch(error => {
                        console.log('❌ Error registrando ServiceWorker:', error);
                    });
            });
        }
    }

    // ===== EVENTOS GLOBALES =====
    setupGlobalEvents() {
        // Prevenir envíos de formulario por defecto
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM' && !e.target.classList.contains('prevented')) {
                e.preventDefault();
            }
        });
        
        // Mejorar accesibilidad de focus
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Manejar carga de imágenes
        this.handleImageLoading();
        
        // Actualizar año actual
        this.updateCurrentYear();
    }
    
    handleImageLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    updateCurrentYear() {
        const yearElements = document.querySelectorAll('.current-year');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(element => {
            element.textContent = currentYear;
        });
    }
}

// ===== INICIALIZAR APLICACIÓN =====
// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar aplicación
    window.gadIbarraApp = new GADIbarraApp();
    
    // Exponer funciones útiles globalmente
    window.showNotification = (message, type) => {
        if (window.gadIbarraApp) {
            return window.gadIbarraApp.showNotification(message, type);
        }
    };
    
    // Configurar tamaño de fuente
    const fontSizeToggle = document.getElementById('fontSizeToggle');
    if (fontSizeToggle) {
        let fontSizeLevel = 0;
        const sizes = ['16px', '18px', '20px'];
        
        fontSizeToggle.addEventListener('click', () => {
            fontSizeLevel = (fontSizeLevel + 1) % sizes.length;
            document.documentElement.style.fontSize = sizes[fontSizeLevel];
            
            const labels = ['Tamaño normal', 'Tamaño grande', 'Tamaño extra grande'];
            fontSizeToggle.setAttribute('title', labels[fontSizeLevel]);
            
            showNotification(`Tamaño de texto: ${labels[fontSizeLevel]}`, 'info');
            
            // Guardar preferencia
            localStorage.setItem('fontSize', fontSizeLevel.toString());
        });
        
        // Cargar preferencia guardada
        const savedSize = localStorage.getItem('fontSize');
        if (savedSize) {
            fontSizeLevel = parseInt(savedSize);
            document.documentElement.style.fontSize = sizes[fontSizeLevel];
        }
    }
    
    // Configurar carga perezosa de iframes
    const iframes = document.querySelectorAll('iframe[data-src]');
    iframes.forEach(iframe => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    iframe.src = iframe.dataset.src;
                    observer.unobserve(iframe);
                }
            });
        });
        
        observer.observe(iframe);
    });
});

// ===== POLYFILLS PARA NAVEGADORES ANTIGUOS =====
// IntersectionObserver polyfill
if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver no soportado, cargando polyfill...');
    
    // Cargar polyfill dinámicamente
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(script);
}

// Smooth scroll polyfill
if (!('scrollBehavior' in document.documentElement.style)) {
    console.warn('scrollBehavior no soportado, cargando polyfill...');
    
    const smoothScript = document.createElement('script');
    smoothScript.src = 'https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
    smoothScript.onload = () => {
        if (typeof smoothScrollPolyfill === 'function') {
            smoothScrollPolyfill.polyfill();
        }
    };
    document.head.appendChild(smoothScript);
}

// ===== MANEJO DE ERRORES GLOBAL =====
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
    
    // Mostrar error amigable al usuario
    if (window.gadIbarraApp) {
        window.gadIbarraApp.showNotification(
            'Ocurrió un error inesperado. Por favor, recarga la página.',
            'error'
        );
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no manejada:', event.reason);
});

// ===== OFFLINE SUPPORT =====
window.addEventListener('online', () => {
    if (window.gadIbarraApp) {
        window.gadIbarraApp.showNotification('Conexión restablecida', 'success');
    }
});

window.addEventListener('offline', () => {
    if (window.gadIbarraApp) {
        window.gadIbarraApp.showNotification(
            'Estás desconectado. Algunas funciones pueden no estar disponibles.',
            'warning'
        );
    }
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.getEntriesByType('navigation')[0];
            
            if (perfData) {
                console.log('📊 Performance Metrics:');
                console.log('- Tiempo de carga:', perfData.loadEventEnd - perfData.startTime, 'ms');
                console.log('- DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.startTime, 'ms');
                
                // Enviar métricas a analytics si es necesario
                if (typeof gtag === 'function') {
                    gtag('event', 'timing_complete', {
                        'name': 'page_load',
                        'value': Math.round(perfData.loadEventEnd - perfData.startTime),
                        'event_category': 'Performance'
                    });
                }
            }
        }, 0);
    });
}