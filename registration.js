// Registration Functionality for Internship Management System

// Mock database of existing users (replace with API calls to your backend)
const existingUsers = [
    { studentId: 'STU001234', email: 'student1@university.edu' },
    { studentId: 'STU001235', email: 'student2@university.edu' },
    { studentId: 'STU001236', email: 'student3@university.edu' }
];

// ============================================
// DATABASE/API FUNCTIONS
// ============================================

/**
 * Check if email already exists in database
 * @param {string} email - Email to check
 * @returns {boolean} - True if email exists
 */
function emailExists(email) {
    return existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
}

/**
 * Check if student ID already exists in database
 * @param {string} studentId - Student ID to check
 * @returns {boolean} - True if student ID exists
 */
function studentIdExists(studentId) {
    return existingUsers.some(user => user.studentId === studentId);
}

/**
 * Register new user (API call simulation)
 * @param {object} userData - User data to register
 * @returns {Promise} - Promise with registration result
 */
function registerUserAPI(userData) {
    return new Promise((resolve, reject) => {
        // Simulate API call with timeout
        setTimeout(() => {
            try {
                // In production, replace this with:
                // fetch('/api/auth/register', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(userData)
                // })

                // Add user to mock database (remove in production)
                existingUsers.push({
                    studentId: userData.studentId,
                    email: userData.email
                });

                const response = {
                    success: true,
                    message: 'Account created successfully',
                    user: {
                        studentId: userData.studentId,
                        email: userData.email,
                        fullName: userData.fullName,
                        department: userData.department
                    }
                };

                resolve(response);
            } catch (error) {
                reject(error);
            }
        }, 1500);
    });
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate full name
 * @param {string} value - Full name to validate
 * @returns {object} - Validation result with valid flag and message
 */
function validateFullName(value) {
    if (!value.trim()) {
        return { valid: false, message: 'Full Name is required' };
    }
    
    if (value.trim().length < 3) {
        return { valid: false, message: 'Full Name must be at least 3 characters' };
    }
    
    // Only letters and spaces allowed
    if (!/^[a-zA-Z\s]+$/.test(value)) {
        return { valid: false, message: 'Full Name can only contain letters and spaces' };
    }
    
    return { valid: true, message: '' };
}

/**
 * Validate email format
 * @param {string} value - Email to validate
 * @returns {object} - Validation result
 */
function validateEmail(value) {
    if (!value.trim()) {
        return { valid: false, message: 'Email is required' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    
    return { valid: true, message: '' };
}

/**
 * Validate student ID format
 * @param {string} value - Student ID to validate
 * @returns {object} - Validation result
 */
function validateStudentId(value) {
    if (!value.trim()) {
        return { valid: false, message: 'Student ID is required' };
    }
    
    // Student ID format: STU followed by 6-8 digits
    const studentIdRegex = /^STU\d{6,8}$/i;
    if (!studentIdRegex.test(value)) {
        return { valid: false, message: 'Student ID must be in format STU000000' };
    }
    
    return { valid: true, message: '' };
}

/**
 * Validate department selection
 * @param {string} value - Department value
 * @returns {object} - Validation result
 */
function validateDepartment(value) {
    if (!value) {
        return { valid: false, message: 'Department is required' };
    }
    
    const validDepartments = ['CSE', 'ECE', 'ME', 'CE', 'BIO', 'IT'];
    if (!validDepartments.includes(value)) {
        return { valid: false, message: 'Please select a valid department' };
    }
    
    return { valid: true, message: '' };
}

/**
 * Validate semester
 * @param {string} value - Semester value
 * @returns {object} - Validation result
 */
function validateSemester(value) {
    if (!value) {
        return { valid: false, message: 'Current Semester is required' };
    }
    
    const semesterNum = parseInt(value);
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
        return { valid: false, message: 'Semester must be between 1 and 8' };
    }
    
    return { valid: true, message: '' };
}

/**
 * Validate phone number
 * @param {string} value - Phone number to validate
 * @returns {object} - Validation result
 */
function validatePhoneNumber(value) {
    if (!value.trim()) {
        return { valid: false, message: 'Phone Number is required' };
    }
    
    // 10 digit phone number (Indian format)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(value.replace(/\D/g, ''))) {
        return { valid: false, message: 'Phone Number must be 10 digits' };
    }
    
    return { valid: true, message: '' };
}

/**
 * Validate password strength
 * @param {string} value - Password to validate
 * @returns {object} - Validation result
 */
function validatePassword(value) {
    if (!value) {
        return { valid: false, message: 'Password is required' };
    }
    
    if (value.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters' };
    }
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(value)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    // Check for lowercase letter
    if (!/[a-z]/.test(value)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    // Check for number
    if (!/[0-9]/.test(value)) {
        return { valid: false, message: 'Password must contain at least one number' };
    }
    
    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
        return { valid: false, message: 'Password must contain at least one special character' };
    }
    
    return { valid: true, message: '' };
}

/**
 * Validate confirm password matches password
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {object} - Validation result
 */
function validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) {
        return { valid: false, message: 'Please confirm your password' };
    }
    
    if (password !== confirmPassword) {
        return { valid: false, message: 'Passwords do not match' };
    }
    
    return { valid: true, message: '' };
}

// ============================================
// FORM DATA FUNCTIONS
// ============================================

/**
 * Get all form data
 * @returns {object} - Form data object
 */
function getRegistrationFormData() {
    return {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        studentId: document.getElementById('studentId').value.trim().toUpperCase(),
        department: document.getElementById('department').value,
        semester: document.getElementById('semester').value,
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };
}

/**
 * Clear all form inputs
 */
function clearRegistrationForm() {
    const form = document.getElementById('registrationForm');
    if (form) {
        form.reset();
    }
}

// ============================================
// ERROR DISPLAY FUNCTIONS
// ============================================

/**
 * Display error for a specific field
 * @param {HTMLElement} fieldElement - Input field element
 * @param {string} message - Error message to display
 */
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

/**
 * Display all validation errors
 * @param {object} errors - Object with field names as keys and error messages as values
 */
function displayValidationErrors(errors) {
    clearAllErrors();
    
    for (const [fieldName, errorMessage] of Object.entries(errors)) {
        const fieldElement = document.getElementById(fieldName);
        if (fieldElement) {
            displayError(fieldElement, errorMessage);
        }
    }
}

/**
 * Clear all error displays
 */
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-text');
    const inputElements = document.querySelectorAll('.form-group input, .form-group select');
    
    errorElements.forEach(el => el.classList.remove('show'));
    inputElements.forEach(el => el.classList.remove('error'));
}

// ============================================
// VALIDATION AGGREGATION
// ============================================

/**
 * Validate entire registration form
 * @param {object} formData - Form data to validate
 * @returns {object} - Object with errors (empty if valid)
 */
function validateRegistrationForm(formData) {
    const errors = {};
    
    // Validate Full Name
    const fullNameValidation = validateFullName(formData.fullName);
    if (!fullNameValidation.valid) {
        errors.fullName = fullNameValidation.message;
    }
    
    // Validate Email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
        errors.email = emailValidation.message;
    } else if (emailExists(formData.email)) {
        errors.email = 'This email is already registered';
    }
    
    // Validate Student ID
    const studentIdValidation = validateStudentId(formData.studentId);
    if (!studentIdValidation.valid) {
        errors.studentId = studentIdValidation.message;
    } else if (studentIdExists(formData.studentId)) {
        errors.studentId = 'This Student ID is already registered';
    }
    
    // Validate Department
    const departmentValidation = validateDepartment(formData.department);
    if (!departmentValidation.valid) {
        errors.department = departmentValidation.message;
    }
    
    // Validate Semester
    const semesterValidation = validateSemester(formData.semester);
    if (!semesterValidation.valid) {
        errors.semester = semesterValidation.message;
    }
    
    // Validate Phone Number
    const phoneValidation = validatePhoneNumber(formData.phoneNumber);
    if (!phoneValidation.valid) {
        errors.phoneNumber = phoneValidation.message;
    }
    
    // Validate Password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
        errors.password = passwordValidation.message;
    }
    
    // Validate Confirm Password
    const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (!confirmPasswordValidation.valid) {
        errors.confirmPassword = confirmPasswordValidation.message;
    }
    
    return errors;
}

// ============================================
// REAL-TIME VALIDATION SETUP
// ============================================

/**
 * Setup real-time validation for registration form fields
 */
function setupRegistrationRealtimeValidation() {
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const studentIdInput = document.getElementById('studentId');
    const departmentInput = document.getElementById('department');
    const semesterInput = document.getElementById('semester');
    const phoneInput = document.getElementById('phoneNumber');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Full Name validation
    if (fullNameInput) {
        fullNameInput.addEventListener('blur', function() {
            const result = validateFullName(this.value);
            displayError(this, result.message);
        });
        fullNameInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }
    
    // Email validation
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const result = validateEmail(this.value);
            if (result.valid && emailExists(this.value)) {
                displayError(this, 'This email is already registered');
            } else {
                displayError(this, result.message);
            }
        });
        emailInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }
    
    // Student ID validation
    if (studentIdInput) {
        studentIdInput.addEventListener('blur', function() {
            const result = validateStudentId(this.value);
            if (result.valid && studentIdExists(this.value.toUpperCase())) {
                displayError(this, 'This Student ID is already registered');
            } else {
                displayError(this, result.message);
            }
        });
        studentIdInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }
    
    // Department validation
    if (departmentInput) {
        departmentInput.addEventListener('change', function() {
            const result = validateDepartment(this.value);
            displayError(this, result.message);
        });
    }
    
    // Semester validation
    if (semesterInput) {
        semesterInput.addEventListener('blur', function() {
            const result = validateSemester(this.value);
            displayError(this, result.message);
        });
        semesterInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }
    
    // Phone Number validation
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            const result = validatePhoneNumber(this.value);
            displayError(this, result.message);
        });
        phoneInput.addEventListener('focus', function() {
            displayError(this, '');
        });
        // Auto format phone number on input
        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
            if (this.value.length > 10) {
                this.value = this.value.slice(0, 10);
            }
        });
    }
    
    // Password validation
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            const result = validatePassword(this.value);
            displayError(this, result.message);
        });
        passwordInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }
    
    // Confirm Password validation
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('blur', function() {
            const result = validateConfirmPassword(passwordInput.value, this.value);
            displayError(this, result.message);
        });
        confirmPasswordInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }
}

// ============================================
// FORM SUBMISSION
// ============================================

/**
 * Handle registration form submission
 * @param {Event} event - Form submit event
 */
async function handleRegistrationSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = getRegistrationFormData();
    
    // Validate form
    const errors = validateRegistrationForm(formData);
    
    // If there are errors, display them and return
    if (Object.keys(errors).length > 0) {
        displayValidationErrors(errors);
        console.warn('Validation errors:', errors);
        return;
    }
    
    // Clear errors if form is valid
    clearAllErrors();
    
    // Get submit button
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
        // Show loading state
        submitButton.textContent = 'Creating Account...';
        submitButton.disabled = true;
        
        // Call registration API
        const response = await registerUserAPI(formData);
        
        // Store user data for next page (optional)
        sessionStorage.setItem('newUserData', JSON.stringify({
            studentId: response.user.studentId,
            email: response.user.email,
            fullName: response.user.fullName,
            department: response.user.department,
            registeredAt: new Date().toISOString()
        }));
        
        // Show success message
        alert('Account created successfully!\n\nYour Student ID: ' + response.user.studentId + '\n\nRedirecting to login...');
        
        // Clear form
        clearRegistrationForm();
        
        // Redirect to login page after 1 second
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        
    } catch (error) {
        // Show error message
        console.error('Registration error:', error);
        alert('An error occurred during registration. Please try again.');
        
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

/**
 * Setup form submission handler
 */
function setupRegistrationFormSubmission() {
    const registrationForm = document.getElementById('registrationForm');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistrationSubmit);
    }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all registration functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    setupRegistrationRealtimeValidation();
    setupRegistrationFormSubmission();
    console.log('Registration form initialized');
});