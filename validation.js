// Form Validation Functions

// Validate Student ID or Email
function validateStudentIdLogin(value) {
    // Check if it's a valid email or student ID format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const studentIdRegex = /^[A-Z0-9]{6,12}$/i; // Adjust pattern based on your student ID format
    
    if (!value.trim()) {
        return { valid: false, message: 'Student ID or Email is required' };
    }
    
    if (emailRegex.test(value)) {
        return { valid: true, message: '' };
    }
    
    if (studentIdRegex.test(value)) {
        return { valid: true, message: '' };
    }
    
    return { valid: false, message: 'Please enter a valid Student ID or Email' };
}

// Validate Password
function validatePasswordLogin(value) {
    if (!value) {
        return { valid: false, message: 'Password is required' };
    }
    
    if (value.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters' };
    }
    
    return { valid: true, message: '' };
}

// Display error message
function displayError(fieldElement, message) {
    const errorElement = fieldElement.parentElement.querySelector('.error-text');
    if (errorElement) {
        if (message) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            fieldElement.classList.add('error');
        } else {
            errorElement.classList.remove('show');
            fieldElement.classList.remove('error');
        }
    }
}

// Clear all errors
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-text');
    const inputElements = document.querySelectorAll('.form-group input');
    
    errorElements.forEach(el => el.classList.remove('show'));
    inputElements.forEach(el => el.classList.remove('error'));
}

// Real-time validation on input
function setupRealtimeValidation() {
    const studentIdInput = document.getElementById('studentIdLogin');
    const passwordInput = document.getElementById('passwordLogin');
    
    if (studentIdInput) {
        studentIdInput.addEventListener('blur', function() {
            const result = validateStudentIdLogin(this.value);
            displayError(this, result.message);
        });
        
        studentIdInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            const result = validatePasswordLogin(this.value);
            displayError(this, result.message);
        });
        
        passwordInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }
}

// Initialize validation when DOM is ready
document.addEventListener('DOMContentLoaded', setupRealtimeValidation);