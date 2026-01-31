// Login Functionality

// Mock user database (replace with actual API calls)
const mockUsers = [
    { studentId: 'STU001', email: 'student1@university.edu', password: 'password123' },
    { studentId: 'STU002', email: 'student2@university.edu', password: 'password456' },
    { studentId: 'STU003', email: 'student3@university.edu', password: 'password789' }
];

// Check if user exists in database
function authenticateUser(studentIdOrEmail, password) {
    return mockUsers.find(user => 
        (user.studentId === studentIdOrEmail || user.email === studentIdOrEmail) && 
        user.password === password
    );
}

// Save login credentials to localStorage (if remember me is checked)
function saveLoginCredentials(studentIdOrEmail, rememberMe) {
    if (rememberMe) {
        localStorage.setItem('rememberedStudentId', studentIdOrEmail);
        localStorage.setItem('rememberMeChecked', 'true');
    } else {
        localStorage.removeItem('rememberedStudentId');
        localStorage.removeItem('rememberMeChecked');
    }
}

// Load saved credentials on page load
function loadSavedCredentials() {
    const studentIdInput = document.getElementById('studentIdLogin');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    
    if (studentIdInput && rememberMeCheckbox) {
        const rememberedId = localStorage.getItem('rememberedStudentId');
        const rememberMeChecked = localStorage.getItem('rememberMeChecked');
        
        if (rememberedId) {
            studentIdInput.value = rememberedId;
        }
        
        if (rememberMeChecked === 'true') {
            rememberMeCheckbox.checked = true;
        }
    }
}

// Handle form submission
function handleLoginSubmit(event) {
    event.preventDefault();
    
    clearAllErrors();
    
    const studentIdInput = document.getElementById('studentIdLogin');
    const passwordInput = document.getElementById('passwordLogin');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    
    const studentIdOrEmail = studentIdInput.value.trim();
    const password = passwordInput.value;
    
    // Validate both fields
    const studentIdValidation = validateStudentIdLogin(studentIdOrEmail);
    const passwordValidation = validatePasswordLogin(password);
    
    let hasErrors = false;
    
    if (!studentIdValidation.valid) {
        displayError(studentIdInput, studentIdValidation.message);
        hasErrors = true;
    }
    
    if (!passwordValidation.valid) {
        displayError(passwordInput, passwordValidation.message);
        hasErrors = true;
    }
    
    if (hasErrors) {
        return;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;
    
    // Simulate API call (replace with actual authentication)
    setTimeout(() => {
        const user = authenticateUser(studentIdOrEmail, password);
        
        if (user) {
            // Save credentials if remember me is checked
            saveLoginCredentials(studentIdOrEmail, rememberMeCheckbox.checked);
            
            // Store user info in sessionStorage
            sessionStorage.setItem('currentUser', JSON.stringify({
                studentId: user.studentId,
                email: user.email
            }));
            
            // Show success message
            alert('Login successful! Redirecting to dashboard...');
            
            // Redirect to student dashboard
            window.location.href = 'student-dashboard.html';
        } else {
            // Show error message
            displayError(studentIdInput, 'Invalid Student ID/Email or Password');
            displayError(passwordInput, '');
            
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }, 1500);
}

// Setup form submission
function setupFormSubmission() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
}

// Handle forgot password
function setupForgotPassword() {
    const forgotPasswordLink = document.querySelector('.forgot-password');
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Forgot password feature coming soon!\nPlease contact your administrator.');
            // In production, redirect to forgot-password.html or open a modal
        });
    }
}

// Initialize all login functionality
document.addEventListener('DOMContentLoaded', function() {
    loadSavedCredentials();
    setupFormSubmission();
    setupForgotPassword();
});