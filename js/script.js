// OneBalance Super-App Website JavaScript
document.addEventListener('DOMContentLoaded', function () {
    
    // 1. MOBILE MENU TOGGLE
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // 2. ANIMATED COUNTERS
    
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // Format number with commas
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    function checkScroll() {
        statNumbers.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                if (!element.classList.contains('animated')) {
                    element.classList.add('animated');
                    animateCounter(element);
                }
            }
        });
    }

    // Check on load and scroll
    window.addEventListener('load', checkScroll);
    window.addEventListener('scroll', checkScroll);


    // 3. FAQ ACCORDION
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const faqItem = this.parentElement;
            const answer = this.nextElementSibling;

            // Close other open items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current item
            faqItem.classList.toggle('active');

            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    // 4. MERCHANT FORM HANDLING
    const merchantForm = document.getElementById('merchantRegistrationForm');

    if (merchantForm) {
        merchantForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = {
                businessName: document.getElementById('businessName').value,
                tradingName: document.getElementById('tradingName').value,
                businessCategory: document.getElementById('businessCategory').value,
                city: document.getElementById('city').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                email: document.getElementById('email').value,
                paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };

            // Validate form
            if (!validateMerchantForm(formData)) {
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;

            // Simulate API call (replace with actual API endpoint)
            setTimeout(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Show success message
                showFormMessage('success', 'Application submitted successfully! Our team will contact you within 48 hours.');

                // Reset form
                merchantForm.reset();

                // Log data (in production, send to server)
                console.log('Merchant Application:', formData);

                // Send to Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'merchant_application', {
                        'business_category': formData.businessCategory,
                        'city': formData.city
                    });
                }

            }, 1500);
        });
    }

    function validateMerchantForm(data) {
    // Basic validation
    if (!data.businessName || data.businessName.trim().length < 2) {
        showFormMessage('error', 'Please enter a valid business name');
        return false;
    }

    // Phone validation with multiple format support
    if (!data.phoneNumber || !validateMalawiPhone(data.phoneNumber)) {
        showFormMessage('error', 
            'Please enter a valid Malawi phone number. Examples:\n' +
            '+265 XXX XXX XXX\n' +
            '265XXXXXXXXX\n' +
            '0XXXXXXXXX');
        return false;
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        showFormMessage('error', 'Please enter a valid email address');
        return false;
    }

    if (!data.paymentMethod) {
        showFormMessage('error', 'Please select a payment method');
        return false;
    }

    return true;
}

// Separate function for phone validation
function validateMalawiPhone(phone) {
    if (!phone) return false;
    
    // Remove all non-digit characters except plus at the beginning
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    
    // Acceptable formats:
    // 1. +265XXXXXXXXX (international format)
    // 2. 265XXXXXXXXX (without plus)
    // 3. 0XXXXXXXXX (local format)
    // Where X is 7-12 digits
    
    const phoneRegex = /^(\+?265|0)\d{7,12}$/;
    
    if (!phoneRegex.test(cleanPhone)) {
        return false;
    }
    
    // Additional check for valid prefix
    const prefix = cleanPhone.startsWith('+') ? cleanPhone.substring(1, 4) : 
                   cleanPhone.startsWith('265') ? '265' : '0';
    
    // Check if number length is appropriate for the prefix
    const numberPart = cleanPhone.replace(/^\+?/, '').replace(/^(265|0)/, '');
    
    if (prefix === '265' && (numberPart.length < 7 || numberPart.length > 12)) {
        return false;
    }
    
    if (prefix === '0' && (numberPart.length < 7 || numberPart.length > 12)) {
        return false;
    }
    
    return true;
}

// Optional: Format phone number automatically
function formatMalawiPhone(phone) {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    if (cleanPhone.startsWith('+265')) {
        // Format: +265 XXX XXX XXX
        const numberPart = cleanPhone.substring(4);
        return `+265 ${numberPart.substring(0, 3)} ${numberPart.substring(3, 6)} ${numberPart.substring(6)}`;
    } else if (cleanPhone.startsWith('265')) {
        // Format: 265 XXX XXX XXX
        const numberPart = cleanPhone.substring(3);
        return `265 ${numberPart.substring(0, 3)} ${numberPart.substring(3, 6)} ${numberPart.substring(6)}`;
    } else if (cleanPhone.startsWith('0')) {
        // Format: 0XXX XXX XXX
        const numberPart = cleanPhone.substring(1);
        return `0${numberPart.substring(0, 3)} ${numberPart.substring(3, 6)} ${numberPart.substring(6)}`;
    }
    
    return phone;
}

    function showFormMessage(type, message) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="close-message">&times;</button>
        `;

        // Add to form
        const formContainer = document.querySelector('.form-container');
        formContainer.insertBefore(messageDiv, formContainer.firstChild);

        // Add close button functionality
        messageDiv.querySelector('.close-message').addEventListener('click', function () {
            messageDiv.remove();
        });

        // Auto-remove after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    messageDiv.remove();
                }
            }, 5000);
        }

        // Add CSS for messages
        const style = document.createElement('style');
        style.textContent = `
            .form-message {
                padding: var(--spacing-md);
                border-radius: var(--radius-md);
                margin-bottom: var(--spacing-lg);
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
                animation: slideDown 0.3s ease;
            }
            
            .form-message.success {
                background: rgba(56, 161, 105, 0.1);
                border: 1px solid rgba(56, 161, 105, 0.3);
                color: var(--success);
            }
            
            .form-message.error {
                background: rgba(229, 62, 62, 0.1);
                border: 1px solid rgba(229, 62, 62, 0.3);
                color: var(--danger);
            }
            
            .close-message {
                background: none;
                border: none;
                font-size: var(--font-size-xl);
                color: inherit;
                cursor: pointer;
                margin-left: auto;
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;

        if (!document.querySelector('#form-message-styles')) {
            style.id = 'form-message-styles';
            document.head.appendChild(style);
        }
    }


    // 5. NEWSLETTER FORM

    const newsletterForm = document.getElementById('newsletterForm');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = this.querySelector('input[type="email"]').value;
            const city = this.querySelector('select').value;

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            if (!city) {
                alert('Please select your city');
                return;
            }

            // Show loading
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;

            // Simulate API call
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                button.style.background = 'var(--success)';

                // Reset after 2 seconds
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                    button.disabled = false;
                    newsletterForm.reset();
                }, 2000);

                // Log subscription
                console.log('Newsletter Subscription:', { email, city });

                // Send to analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup', {
                        'city': city
                    });
                }

            }, 1000);
        });
    }

    
    // 6. SMOOTH SCROLLING
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    
    // 7. SERVICE CARDS ANIMATION
    
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    
    // 8. NETWORK BRIDGE ANIMATION
    
    const networkBridge = document.querySelector('.network-bridge');

    if (networkBridge) {
        const arrows = networkBridge.querySelectorAll('.bridge-arrow');

        function animateArrows() {
            arrows.forEach((arrow, index) => {
                arrow.style.animation = `pulse 2s ease-in-out ${index * 0.5}s infinite`;
            });
        }

        // Add CSS animation
        const pulseAnimation = document.createElement('style');
        pulseAnimation.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 0.5; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(pulseAnimation);

        // Start animation when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateArrows();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(networkBridge);
    }

    
    // 9. SCROLL ANIMATIONS

    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .security-card, .testimonial-card, .step-content');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.classList.add('fade-in-up');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);

    
    // 10. DOWNLOAD BUTTON TRACKING
    
    document.querySelectorAll('.btn-primary, .nav-link.cta-button').forEach(button => {
        if (button.textContent.includes('Download') || button.textContent.includes('App')) {
            button.addEventListener('click', function () {
                // Send to analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'app_download_click', {
                        'button_location': this.closest('section')?.id || 'unknown',
                        'button_text': this.textContent.trim()
                    });
                }
            });
        }
    });

    // 11. PHONE NUMBER FORMATTING
    const phoneInput = document.getElementById('phoneNumber');

    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.startsWith('265')) {
                value = '+' + value;
            } else if (value.startsWith('0')) {
                value = '+265' + value.substring(1);
            }

            // Format: +265 99 123 4567
            if (value.length > 3) {
                value = value.replace(/(\+\d{3})(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4');
            }

            e.target.value = value;
        });
    }


    // 12. CURRENT YEAR IN FOOTER
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.copyright').forEach(element => {
        if (element.textContent.includes('2026')) {
            element.innerHTML = element.innerHTML.replace('2026', currentYear);
        }
    });

    
    // 13. LAZY LOAD IMAGES
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    
    // 14. NETWORK DETECTION (DEMO)
    
    const balanceDisplay = document.querySelector('.balance-amount');

    if (balanceDisplay && Math.random() > 0.5) {
        // Simulate network change
        setInterval(() => {
            const networks = ['Airtel', 'TNM'];
            const currentNetwork = Math.random() > 0.5 ? networks[0] : networks[1];

            const networkIndicators = document.querySelector('.network-indicators');
            if (networkIndicators) {
                networkIndicators.innerHTML = `
                    <span class="network-indicator ${currentNetwork.toLowerCase()}">${currentNetwork.toUpperCase()}</span>
                    <span class="network-indicator ${currentNetwork.toLowerCase() === 'airtel' ? 'tnm' : 'airtel'}">${currentNetwork === 'Airtel' ? 'TNM' : 'AIRTEL'}</span>
                `;
            }
        }, 5000);
    }

    
    // 15. FORM AUTO-SAVE (DRAFT)
    
    const formFields = merchantForm ? merchantForm.querySelectorAll('input, select, textarea') : [];

    formFields.forEach(field => {
        field.addEventListener('input', function () {
            const formData = {};
            formFields.forEach(f => {
                if (f.name) {
                    formData[f.name] = f.value;
                }
            });

            // Save to localStorage
            localStorage.setItem('merchant_form_draft', JSON.stringify(formData));
        });
    });

    // Load draft on page load
    window.addEventListener('load', function () {
        const draft = localStorage.getItem('merchant_form_draft');
        if (draft && merchantForm) {
            const formData = JSON.parse(draft);
            Object.keys(formData).forEach(key => {
                const field = merchantForm.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = formData[key];
                }
            });

            // Show draft restored message
            const restoreMsg = document.createElement('div');
            restoreMsg.className = 'form-message info';
            restoreMsg.innerHTML = `
                <i class="fas fa-info-circle"></i>
                <span>Draft restored from previous session</span>
                <button onclick="this.parentElement.remove()" class="close-message">&times;</button>
            `;

            const formContainer = document.querySelector('.form-container');
            if (formContainer && !formContainer.querySelector('.form-message')) {
                formContainer.insertBefore(restoreMsg, formContainer.firstChild);
            }
        }
    });

    // Clear draft on successful submission
    if (merchantForm) {
        merchantForm.addEventListener('submit', function () {
            localStorage.removeItem('merchant_form_draft');
        });
    }

    
    // 16. PRINT FUNCTIONALITY
    
    const printButton = document.createElement('button');
    printButton.innerHTML = '<i class="fas fa-print"></i>';
    printButton.className = 'print-button';
    printButton.title = 'Print this page';
    printButton.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: var(--shadow-md);
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    `;

    printButton.addEventListener('click', function () {
        window.print();
    });

    document.body.appendChild(printButton);

    
    // 17. THEME TOGGLE (LIGHT/DARK)
    
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'theme-toggle';
    themeToggle.title = 'Toggle dark mode';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 160px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--dark);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: var(--shadow-md);
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    `;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        enableDarkMode();
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', function () {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
            this.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            enableDarkMode();
            this.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });

    document.body.appendChild(themeToggle);

    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');

        // Add dark mode styles
        const darkModeStyles = document.createElement('style');
        darkModeStyles.id = 'dark-mode-styles';
        darkModeStyles.textContent = `
            body.dark-mode {
                background: #0F172A;
                color: #E2E8F0;
            }
            
            body.dark-mode .feature-card,
            body.dark-mode .security-card,
            body.dark-mode .testimonial-card,
            body.dark-mode .step-content {
                background: #1E293B;
                color: #E2E8F0;
                border-color: #334155;
            }
            
            body.dark-mode .navbar {
                background: rgba(15, 23, 42, 0.95);
            }
            
            body.dark-mode .footer {
                background: #0F172A;
            }
            
            body.dark-mode .form-container {
                background: #1E293B;
                color: #E2E8F0;
            }
            
            body.dark-mode input,
            body.dark-mode select,
            body.dark-mode textarea {
                background: #334155;
                color: #E2E8F0;
                border-color: #475569;
            }
        `;

        if (!document.getElementById('dark-mode-styles')) {
            document.head.appendChild(darkModeStyles);
        }
    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');

        const darkModeStyles = document.getElementById('dark-mode-styles');
        if (darkModeStyles) {
            darkModeStyles.remove();
        }
    }

    
    // 18. SESSION TIMEOUT WARNING
    
    let timeoutWarning;
    const timeoutDuration = 30 * 60 * 1000; // 30 minutes

    function resetTimeout() {
        clearTimeout(timeoutWarning);
        timeoutWarning = setTimeout(showTimeoutWarning, timeoutDuration);
    }

    function showTimeoutWarning() {
        const warning = document.createElement('div');
        warning.className = 'session-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <i class="fas fa-clock"></i>
                <div>
                    <h4>Session About to Expire</h4>
                    <p>Your session will expire in 2 minutes due to inactivity.</p>
                </div>
                <button onclick="extendSession()" class="btn btn-sm btn-primary">Stay Signed In</button>
            </div>
        `;

        warning.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            border: 2px solid var(--warning);
            border-radius: var(--radius-lg);
            padding: var(--spacing-md);
            box-shadow: var(--shadow-xl);
            z-index: 10000;
            animation: slideUp 0.3s ease;
        `;

        document.body.appendChild(warning);

        // Auto remove after 2 minutes
        setTimeout(() => {
            if (warning.parentElement) {
                warning.remove();
            }
        }, 120000);
    }

    window.extendSession = function () {
        resetTimeout();
        document.querySelector('.session-warning')?.remove();
    };

    // Reset timeout on user activity
    ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
        document.addEventListener(event, resetTimeout);
    });

    // Start timeout on page load
    resetTimeout();


    // 19. OFFLINE DETECTION
    window.addEventListener('online', function () {
        showOfflineMessage('You are back online!', 'success');
    });

    window.addEventListener('offline', function () {
        showOfflineMessage('You are currently offline. Some features may not work.', 'warning');
    });

    function showOfflineMessage(message, type) {
        const existing = document.querySelector('.offline-message');
        if (existing) existing.remove();

        const messageDiv = document.createElement('div');
        messageDiv.className = `offline-message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'wifi' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        `;

        messageDiv.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? 'var(--success)' : 'var(--warning)'};
            color: white;
            padding: var(--spacing-sm) var(--spacing-lg);
            border-radius: var(--radius-full);
            z-index: 10000;
            animation: slideDown 0.3s ease;
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            box-shadow: var(--shadow-md);
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.style.animation = 'slideUp 0.3s ease forwards';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 3000);
    }

    // 20. PERFORMANCE METRICS
    if ('performance' in window) {
        window.addEventListener('load', function () {
            setTimeout(() => {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;

                console.log(`Page loaded in ${loadTime}ms`);

                // Send to analytics if load time is slow
                if (loadTime > 3000 && typeof gtag !== 'undefined') {
                    gtag('event', 'slow_page_load', {
                        'load_time': loadTime,
                        'page_path': window.location.pathname
                    });
                }
            }, 0);
        });
    }

    // 21. COPYRIGHT PROTECTION
    document.addEventListener('contextmenu', function (e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            showToast('Image protected by copyright');
        }
    });

    document.addEventListener('keydown', function (e) {
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
            (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            showToast('Developer tools are disabled on this page');
        }
    });

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: var(--spacing-sm) var(--spacing-lg);
            border-radius: var(--radius-full);
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // animations
    const animationsCSS = document.createElement('style');
    animationsCSS.textContent = `
        @keyframes slideUp {
            from { transform: translate(-50%, 100%); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(animationsCSS);
});


// 22. GOOGLE ANALYTICS INTEGRATION
// ====================
// Add this script tag to your HTML head (replace with your actual GA ID)
// <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

// Initialize GA (uncomment and replace with your GA ID)

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');



// 23. ERROR HANDLING

window.addEventListener('error', function (e) {
    console.error('Global error caught:', e.error);

    // Don't show error messages for users
    e.preventDefault();

    // Send to error tracking service (optional)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': e.error.message,
            'fatal': false
        });
    }

    return true;
});


// 24. PWA SUPPORT (OPTIONAL)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}


// 25. BACK TO TOP BUTTON
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
backToTopButton.className = 'back-to-top';
backToTopButton.title = 'Back to top';
backToTopButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--primary);
    color: black;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: var(--shadow-md);
    z-index: 999;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: all 0.3s ease;
`;

backToTopButton.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

document.body.appendChild(backToTopButton);

window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
        backToTopButton.style.display = 'flex';
    } else {
        backToTopButton.style.display = 'none';
    }
});

// 26. BROWSER COMPATIBILITY CHECK
function checkBrowserCompatibility() {
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    const isEdge = !isIE && !!window.StyleMedia;

    if (isIE || isEdge) {
        const warning = document.createElement('div');
        warning.className = 'browser-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <h4>Browser Compatibility Warning</h4>
                    <p>For the best experience, please use Chrome, Firefox, or Safari.</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="btn btn-sm">Dismiss</button>
            </div>
        `;

        warning.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: var(--warning);
            color: #744210;
            padding: var(--spacing-sm);
            z-index: 10000;
            text-align: center;
        `;

        document.body.insertBefore(warning, document.body.firstChild);
    }
}

// Run compatibility check
setTimeout(checkBrowserCompatibility, 1000);


// 27. PAGE TRANSITIONS
document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('page-loaded');
});

// Add CSS for page transitions
const transitionCSS = document.createElement('style');
transitionCSS.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    body.page-loaded {
        opacity: 1;
    }
    
    .back-to-top {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    }
    
    .back-to-top.show {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(transitionCSS);

console.log('OneBalance website initialized successfully! 🚀');

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init: function () {
            console.log('OneBalance initialized');
        }
    };
}



// Cookie Consent Functions
document.addEventListener('DOMContentLoaded', function() {
    // Check if user already made a choice
    if (!localStorage.getItem('cookieConsent')) {
        document.getElementById('cookie-consent').style.display = 'block';
    }
});

function acceptCookies(type) {
    const consent = {
        type: type,
        date: new Date().toISOString(),
        preferences: {
            necessary: true,
            analytics: type === 'all',
            marketing: type === 'all'
        }
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    document.getElementById('cookie-consent').style.display = 'none';
    
    // Load analytics if accepted
    if (type === 'all') {
        loadAnalytics();
    }
}

function openCookieSettings() {
    document.getElementById('cookie-settings').style.display = 'flex';
}

function closeCookieSettings() {
    document.getElementById('cookie-settings').style.display = 'none';
}

function saveCookiePreferences() {
    const analytics = document.getElementById('analytics-cookies').checked;
    const marketing = document.getElementById('marketing-cookies').checked;
    
    const consent = {
        type: 'custom',
        date: new Date().toISOString(),
        preferences: {
            necessary: true,
            analytics: analytics,
            marketing: marketing
        }
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    document.getElementById('cookie-settings').style.display = 'none';
    document.getElementById('cookie-consent').style.display = 'none';
    
    if (analytics) {
        loadAnalytics();
    }
}

function loadAnalytics() {
    // Load Google Analytics or other analytics scripts
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID';
    script.async = true;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'YOUR-GA-ID');
}


// Rate Limiting
const formSubmissions = {};

function checkRateLimit(formId, limit = 5, timeWindow = 3600000) { // 5 per hour
    const now = Date.now();
    const userKey = `${formId}_${getUserIdentifier()}`;
    
    if (!formSubmissions[userKey]) {
        formSubmissions[userKey] = [];
    }
    
    // Clean old submissions
    formSubmissions[userKey] = formSubmissions[userKey].filter(
        timestamp => now - timestamp < timeWindow
    );
    
    if (formSubmissions[userKey].length >= limit) {
        alert('Too many submissions. Please try again later.');
        return false;
    }
    
    formSubmissions[userKey].push(now);
    return true;
}

function getUserIdentifier() {
    // Use a combination of IP (via server) and browser fingerprint
    return localStorage.getItem('session_id') || generateSessionId();
}

function generateSessionId() {
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('session_id', id);
    return id;
}

// Add to form submission
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        if (!checkRateLimit(this.id)) {
            e.preventDefault();
            return false;
        }
    });
});


// contact.js - Add reCAPTCHA validation
function validateReCaptcha() {
    const response = grecaptcha.getResponse();
    if (response.length === 0) {
        alert("Please complete the reCAPTCHA verification");
        return false;
    }
    return true;
}

// Add to form submission handlers
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        if (!validateReCaptcha()) {
            e.preventDefault();
            return false;
        }
    });
});