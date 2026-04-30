// contact.js - OneBalance Contact Page Scripts

document.addEventListener('DOMContentLoaded', () => {
  initFormTabs();
  initFormSubmission();
  initAccordion();
  initPhoneFormatting();
  initChatWidget();
  initAutoFocus();
});

/**
 * Form Tab Switching with ARIA support
 */
function initFormTabs() {
  const tabs = document.querySelectorAll('.form-tab');
  const forms = document.querySelectorAll('.form-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('onclick').match(/'([^']+)'/)[1];
      
      // Update tab states
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update form states
      forms.forEach(form => {
        form.classList.remove('active');
      });
      document.getElementById(targetId + '-form').classList.add('active');
    });
  });
}

/**
 * Form Submission Handler
 */
function initFormSubmission() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const formType = form.dataset.formType;
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Validation
      if (!validateForm(form)) {
        return;
      }
      
      // Submit
      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        // Simulate API call
        await submitFormData(formData, formType);
        
        // Success
        showSuccessMessage(formType);
        form.reset();
        
      } catch (error) {
        showErrorMessage();
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  });
}

/**
 * Form Validation
 */
function validateForm(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll('[required]');
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#e53e3e';
      field.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.1)';
      isValid = false;
    } else {
      field.style.borderColor = '#e2e8f0';
      field.style.boxShadow = 'none';
    }
  });
  
  return isValid;
}

/**
 * Submit Form Data (Mock API)
 */
async function submitFormData(formData, formType) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 2s API response
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        resolve();
      } else {
        reject(new Error('Server error'));
      }
    }, 2000);
  });
}

/**
 * Show Success Message
 */
function showSuccessMessage(formType) {
  const messages = {
    'support': 'Thank you! Your support request has been submitted. Our team will contact you within 5 minutes.',
    'business': 'Thank you! Your business inquiry has been submitted. We will contact you within 24 hours.',
    'compliance': 'Thank you! Your compliance inquiry has been submitted. We will contact you within 2 hours.',
    'media': 'Thank you! Your media inquiry has been submitted. We will contact you within 2 hours.'
  };
  
  showToast(messages[formType], 'success');
}

/**
 * Show Error Message
 */
function showErrorMessage() {
  showToast('Sorry, there was an error submitting your form. Please try again.', 'error');
}

/**
 * Show Toast Notification
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // Style the toast
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#2c7a7b'};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 9999;
    transform: translateX(120%);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 10);
  
  // Hide toast after 5 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

/**
 * FAQ Accordion
 */
function initAccordion() {
  const buttons = document.querySelectorAll('.accordion-button');
  
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const target = document.getElementById(targetId);
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      
      // Close all other accordions
      document.querySelectorAll('.accordion-collapse.show').forEach(item => {
        if (item !== target) {
          item.classList.remove('show');
        }
      });
      
      // Toggle current accordion
      if (isExpanded) {
        target.classList.remove('show');
        button.setAttribute('aria-expanded', 'false');
      } else {
        target.classList.add('show');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * Phone Number Formatting
 */
function initPhoneFormatting() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      
      // Auto-format for Malawi numbers
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
    
    // Add placeholder
    if (!input.placeholder) {
      input.placeholder = '+265 99 123 4567';
    }
  });
}

/**
 * Live Chat Widget
 */
function initChatWidget() {
  // Auto-detect user's preferred chat app
  const isWhatsAppAvailable = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isWhatsAppAvailable) {
    const chatBtn = document.querySelector('.chat-button');
    if (chatBtn) {
      chatBtn.title = 'Chat with us on WhatsApp';
      chatBtn.innerHTML = '💬';
    }
  }
}

/**
 * Open WhatsApp Chat
 */
function openChat() {
  const phone = '+265991234567';
  const name = getUserName() || 'Customer';
  const message = encodeURIComponent(`Hello OneBalance! My name is ${name}. I need assistance with:`);
  const url = `https://wa.me/${phone}?text=${message}`;
  
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Get User Name (from localStorage or prompt)
 */
function getUserName() {
  let name = localStorage.getItem('onebalance_user_name');
  
  if (!name) {
    name = prompt('What is your name?', '');
    if (name) {
      localStorage.setItem('onebalance_user_name', name);
    }
  }
  
  return name;
}

/**
 * Auto Focus based on URL parameters
 */
function initAutoFocus() {
  const urlParams = new URLSearchParams(window.location.search);
  const inquiryType = urlParams.get('inquiry');
  
  if (inquiryType) {
    // Switch to the appropriate tab
    const tab = document.querySelector(`.form-tab[onclick*="${inquiryType}"]`);
    if (tab) {
      tab.click();
    }
    
    // Scroll to form
    const form = document.getElementById(`${inquiryType}-form`);
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/**
 * Track Form Engagement (for analytics)
 */
function trackFormEngagement() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        // Track form start
        console.log(`User started filling ${form.dataset.formType} form`);
      });
      
      input.addEventListener('blur', () => {
        if (input.value) {
          // Track field completion
          console.log(`User completed ${input.name} field`);
        }
      });
    });
  });
}

// Initialize tracking
document.addEventListener('DOMContentLoaded', trackFormEngagement);