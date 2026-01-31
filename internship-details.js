// Internship Details Form Functionality

// Mock database of internships (replace with API calls)
const existingInternships = [
    {
        studentId: 'STU001234',
        companyName: 'Google',
        startDate: '2024-01-15',
        endDate: '2024-03-15'
    },
    {
        studentId: 'STU001235',
        companyName: 'Microsoft',
        startDate: '2024-02-01',
        endDate: '2024-04-01'
    }
];

// ============================================
// DATABASE/API FUNCTIONS
// ============================================

/**
 * Check if internship already exists for student
 * @param {string} studentId - Student ID
 * @param {string} companyName - Company name
 * @returns {boolean} - True if internship exists
 */
function internshipExists(studentId, companyName) {
    return existingInternships.some(internship =>
        internship.studentId === studentId &&
        internship.companyName.toLowerCase() === companyName.toLowerCase()
    );
}

/**
 * Submit internship details to API
 * @param {object} internshipData - Internship data to submit
 * @returns {Promise} - Promise with submission result
 */
function submitInternshipAPI(internshipData) {
    return new Promise((resolve, reject) => {
        // Simulate API call with timeout
        setTimeout(() => {
            try {
                // In production, replace this with:
                // fetch('/api/internships/submit', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(internshipData)
                // })

                // Get current user from sessionStorage
                const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};

                // Add to mock database
                existingInternships.push({
                    studentId: currentUser.studentId,
                    companyName: internshipData.companyName,
                    startDate: internshipData.startDate,
                    endDate: internshipData.endDate
                });

                const response = {
                    success: true,
                    message: 'Internship details submitted successfully',
                    internshipId: 'INT' + Date.now(),
                    data: internshipData
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
 * Validate company name
 * @param {string} value - Company name to validate
 * @returns {object} - Validation result
 */
function validateCompanyName(value) {
    if (!value.trim()) {
        return { valid: false, message: 'Company Name is required' };
    }

    if (value.trim().length < 2) {
        return { valid: false, message: 'Company Name must be at least 2 characters' };
    }

    if (value.trim().length > 100) {
        return { valid: false, message: 'Company Name must not exceed 100 characters' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate company city (optional)
 * @param {string} value - City name
 * @returns {object} - Validation result
 */
function validateCompanyCity(value) {
    if (value && value.length > 50) {
        return { valid: false, message: 'City name must not exceed 50 characters' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate company state (optional)
 * @param {string} value - State name
 * @returns {object} - Validation result
 */
function validateCompanyState(value) {
    if (value && value.length > 50) {
        return { valid: false, message: 'State name must not exceed 50 characters' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate company type
 * @param {string} value - Company type
 * @returns {object} - Validation result
 */
function validateCompanyType(value) {
    if (!value) {
        return { valid: false, message: 'Company Type is required' };
    }

    const validTypes = ['IT', 'Finance', 'Manufacturing', 'Research', 'Startup', 'Government', 'Other'];
    if (!validTypes.includes(value)) {
        return { valid: false, message: 'Please select a valid company type' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate internship type
 * @param {string} value - Internship type
 * @returns {object} - Validation result
 */
function validateInternshipType(value) {
    if (!value) {
        return { valid: false, message: 'Type of Internship is required' };
    }

    const validTypes = ['Technical', 'Research', 'Industrial', 'Core', 'Other'];
    if (!validTypes.includes(value)) {
        return { valid: false, message: 'Please select a valid internship type' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate start date
 * @param {string} value - Start date (YYYY-MM-DD format)
 * @returns {object} - Validation result
 */
function validateStartDate(value) {
    if (!value) {
        return { valid: false, message: 'Start Date is required' };
    }

    const startDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Allow dates from 2 years ago to future
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 2);

    if (startDate < minDate) {
        return { valid: false, message: 'Start Date cannot be more than 2 years in the past' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate end date
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {object} - Validation result
 */
function validateEndDate(startDate, endDate) {
    if (!endDate) {
        return { valid: false, message: 'End Date is required' };
    }

    if (!startDate) {
        return { valid: false, message: 'Please fill Start Date first' };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
        return { valid: false, message: 'End Date must be after Start Date' };
    }

    // Maximum 12 months internship duration
    const maxDuration = new Date(start);
    maxDuration.setMonth(maxDuration.getMonth() + 12);

    if (end > maxDuration) {
        return { valid: false, message: 'Internship duration cannot exceed 12 months' };
    }

    return { valid: true, message: '' };
}

/**
 * Calculate internship duration in days
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {number} - Duration in days
 */
function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Validate working hours
 * @param {string} workingHours - Total working hours
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {object} - Validation result
 */
function validateWorkingHours(workingHours, startDate, endDate) {
    if (!workingHours) {
        return { valid: false, message: 'Total Working Hours is required' };
    }

    const hours = parseInt(workingHours);

    if (isNaN(hours) || hours <= 0) {
        return { valid: false, message: 'Working Hours must be a positive number' };
    }

    if (hours > 10000) {
        return { valid: false, message: 'Working Hours seems too high (max 10000)' };
    }

    // Optional: Check if hours are reasonable for duration
    if (startDate && endDate) {
        const durationDays = calculateDuration(startDate, endDate);
        const maxHours = durationDays * 8; // Assuming max 8 hours per day

        if (hours > maxHours) {
            return {
                valid: false,
                message: `Working Hours cannot exceed ${maxHours} hours for ${durationDays} days`
            };
        }
    }

    return { valid: true, message: '' };
}

/**
 * Validate stipend (optional)
 * @param {string} value - Stipend amount
 * @returns {object} - Validation result
 */
function validateStipend(value) {
    if (!value) {
        return { valid: true, message: '' }; // Optional field
    }

    const stipend = parseInt(value);

    if (isNaN(stipend) || stipend < 0) {
        return { valid: false, message: 'Stipend must be a non-negative number' };
    }

    if (stipend > 500000) {
        return { valid: false, message: 'Stipend amount seems too high' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate supervisor name
 * @param {string} value - Supervisor name
 * @returns {object} - Validation result
 */
function validateSupervisorName(value) {
    if (!value.trim()) {
        return { valid: false, message: 'Supervisor Name is required' };
    }

    if (value.trim().length < 3) {
        return { valid: false, message: 'Supervisor Name must be at least 3 characters' };
    }

    if (!/^[a-zA-Z\s]+$/.test(value)) {
        return { valid: false, message: 'Supervisor Name can only contain letters and spaces' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate supervisor email
 * @param {string} value - Supervisor email
 * @returns {object} - Validation result
 */
function validateSupervisorEmail(value) {
    if (!value.trim()) {
        return { valid: false, message: 'Supervisor Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate project title
 * @param {string} value - Project title
 * @returns {object} - Validation result
 */
function validateProjectTitle(value) {
    if (!value.trim()) {
        return { valid: false, message: 'Project Title is required' };
    }

    if (value.trim().length < 5) {
        return { valid: false, message: 'Project Title must be at least 5 characters' };
    }

    if (value.trim().length > 150) {
        return { valid: false, message: 'Project Title must not exceed 150 characters' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate project description (optional)
 * @param {string} value - Project description
 * @returns {object} - Validation result
 */
function validateProjectDescription(value) {
    if (!value) {
        return { valid: true, message: '' }; // Optional field
    }

    if (value.length > 2000) {
        return { valid: false, message: 'Project Description must not exceed 2000 characters' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate performance rating
 * @param {string} value - Performance rating
 * @returns {object} - Validation result
 */
function validatePerformanceRating(value) {
    if (!value) {
        return { valid: false, message: 'Performance Rating is required' };
    }

    const validRatings = ['Excellent', 'Very Good', 'Good', 'Average', 'Poor'];
    if (!validRatings.includes(value)) {
        return { valid: false, message: 'Please select a valid rating' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate skills acquired (optional)
 * @param {string} value - Skills acquired
 * @returns {object} - Validation result
 */
function validateSkillsAcquired(value) {
    if (!value) {
        return { valid: true, message: '' }; // Optional field
    }

    if (value.length > 1000) {
        return { valid: false, message: 'Skills description must not exceed 1000 characters' };
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
function getInternshipFormData() {
    return {
        companyName: document.getElementById('companyName').value.trim(),
        companyCity: document.getElementById('companyCity').value.trim(),
        companyState: document.getElementById('companyState').value.trim(),
        companyType: document.getElementById('companyType').value,
        internshipType: document.getElementById('internshipType').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        workingHours: document.getElementById('workingHours').value,
        stipend: document.getElementById('stipend').value,
        supervisorName: document.getElementById('supervisorName').value.trim(),
        supervisorEmail: document.getElementById('supervisorEmail').value.trim(),
        projectTitle: document.getElementById('projectTitle').value.trim(),
        projectDescription: document.getElementById('projectDescription').value.trim(),
        performanceRating: document.getElementById('performanceRating').value,
        skillsAcquired: document.getElementById('skillsAcquired').value.trim()
    };
}

/**
 * Clear all form inputs
 */
function clearInternshipForm() {
    const form = document.getElementById('internshipForm');
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
    const inputElements = document.querySelectorAll(
        '.form-group input, .form-group select, .form-group textarea'
    );

    errorElements.forEach(el => el.classList.remove('show'));
    inputElements.forEach(el => el.classList.remove('error'));
}

// ============================================
// VALIDATION AGGREGATION
// ============================================

/**
 * Validate entire internship form
 * @param {object} formData - Form data to validate
 * @returns {object} - Object with errors (empty if valid)
 */
function validateInternshipForm(formData) {
    const errors = {};

    // Validate Company Information
    const companyNameValidation = validateCompanyName(formData.companyName);
    if (!companyNameValidation.valid) {
        errors.companyName = companyNameValidation.message;
    }

    const companyCityValidation = validateCompanyCity(formData.companyCity);
    if (!companyCityValidation.valid) {
        errors.companyCity = companyCityValidation.message;
    }

    const companyStateValidation = validateCompanyState(formData.companyState);
    if (!companyStateValidation.valid) {
        errors.companyState = companyStateValidation.message;
    }

    const companyTypeValidation = validateCompanyType(formData.companyType);
    if (!companyTypeValidation.valid) {
        errors.companyType = companyTypeValidation.message;
    }

    // Validate Internship Details
    const internshipTypeValidation = validateInternshipType(formData.internshipType);
    if (!internshipTypeValidation.valid) {
        errors.internshipType = internshipTypeValidation.message;
    }

    const startDateValidation = validateStartDate(formData.startDate);
    if (!startDateValidation.valid) {
        errors.startDate = startDateValidation.message;
    }

    const endDateValidation = validateEndDate(formData.startDate, formData.endDate);
    if (!endDateValidation.valid) {
        errors.endDate = endDateValidation.message;
    }

    const workingHoursValidation = validateWorkingHours(
        formData.workingHours,
        formData.startDate,
        formData.endDate
    );
    if (!workingHoursValidation.valid) {
        errors.workingHours = workingHoursValidation.message;
    }

    const stipendValidation = validateStipend(formData.stipend);
    if (!stipendValidation.valid) {
        errors.stipend = stipendValidation.message;
    }

    // Validate Supervisor & Project Details
    const supervisorNameValidation = validateSupervisorName(formData.supervisorName);
    if (!supervisorNameValidation.valid) {
        errors.supervisorName = supervisorNameValidation.message;
    }

    const supervisorEmailValidation = validateSupervisorEmail(formData.supervisorEmail);
    if (!supervisorEmailValidation.valid) {
        errors.supervisorEmail = supervisorEmailValidation.message;
    }

    const projectTitleValidation = validateProjectTitle(formData.projectTitle);
    if (!projectTitleValidation.valid) {
        errors.projectTitle = projectTitleValidation.message;
    }

    const projectDescriptionValidation = validateProjectDescription(formData.projectDescription);
    if (!projectDescriptionValidation.valid) {
        errors.projectDescription = projectDescriptionValidation.message;
    }

    // Validate Performance & Skills
    const performanceRatingValidation = validatePerformanceRating(formData.performanceRating);
    if (!performanceRatingValidation.valid) {
        errors.performanceRating = performanceRatingValidation.message;
    }

    const skillsAcquiredValidation = validateSkillsAcquired(formData.skillsAcquired);
    if (!skillsAcquiredValidation.valid) {
        errors.skillsAcquired = skillsAcquiredValidation.message;
    }

    return errors;
}

// ============================================
// REAL-TIME VALIDATION SETUP
// ============================================

/**
 * Setup real-time validation for internship form fields
 */
function setupInternshipRealtimeValidation() {
    const companyNameInput = document.getElementById('companyName');
    const companyCityInput = document.getElementById('companyCity');
    const companyStateInput = document.getElementById('companyState');
    const companyTypeInput = document.getElementById('companyType');
    const internshipTypeInput = document.getElementById('internshipType');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const workingHoursInput = document.getElementById('workingHours');
    const stipendInput = document.getElementById('stipend');
    const supervisorNameInput = document.getElementById('supervisorName');
    const supervisorEmailInput = document.getElementById('supervisorEmail');
    const projectTitleInput = document.getElementById('projectTitle');
    const projectDescriptionInput = document.getElementById('projectDescription');
    const performanceRatingInput = document.getElementById('performanceRating');
    const skillsAcquiredInput = document.getElementById('skillsAcquired');

    // Company Name validation
    if (companyNameInput) {
        companyNameInput.addEventListener('blur', function() {
            const result = validateCompanyName(this.value);
            displayError(this, result.message);
        });
        companyNameInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }

    // Company City validation
    if (companyCityInput) {
        companyCityInput.addEventListener('blur', function() {
            const result = validateCompanyCity(this.value);
            displayError(this, result.message);
        });
        companyCityInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }

    // Company State validation
    if (companyStateInput) {
        companyStateInput.addEventListener('blur', function() {
            const result = validateCompanyState(this.value);
            displayError(this, result.message);
        });
        companyStateInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }

    // Company Type validation
    if (companyTypeInput) {
        companyTypeInput.addEventListener('change', function() {
            const result = validateCompanyType(this.value);
            displayError(this, result.message);
        });
    }

    // Internship Type validation
    if (internshipTypeInput) {
        internshipTypeInput.addEventListener('change', function() {
            const result = validateInternshipType(this.value);
            displayError(this, result.message);
        });
    }

    // Start Date validation
    if (startDateInput) {
        startDateInput.addEventListener('blur', function() {
            const result = validateStartDate(this.value);
            displayError(this, result.message);
            // Re-validate end date if it exists
            if (endDateInput && endDateInput.value) {
                const endDateResult = validateEndDate(this.value, endDateInput.value);
                displayError(endDateInput, endDateResult.message);
            }
        });
        startDateInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }

    // End Date validation
    if (endDateInput) {
        endDateInput.addEventListener('blur', function() {
            const result = validateEndDate(startDateInput.value, this.value);
            displayError(this, result.message);
            // Re-validate working hours if it exists
            if (workingHoursInput && workingHoursInput.value) {
                const hoursResult = validateWorkingHours(
                    workingHoursInput.value,
                    startDateInput.value,
                    this.value
                );
                displayError(workingHoursInput, hoursResult.message);
            }
        });
        endDateInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }

    // Working Hours validation
    if (workingHoursInput) {
        workingHoursInput.addEventListener('blur', function() {
            const result = validateWorkingHours(
                this.value,
                startDateInput.value,
                endDateInput.value
            );
            displayError(this, result.message);
        });
        workingHoursInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }

    // Stipend validation
    if (stipendInput) {
        stipendInput.addEventListener('blur', function() {
            const result = validateStipend(this.value);
            displayError(this, result.message);
        });
        stipendInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }

    // Supervisor Name validation
    if (supervisorNameInput) {
        supervisorNameInput.addEventListener('blur', function() {
            const result = validateSupervisorName(this.value);
            displayError(this, result.message);
        });
        supervisorNameInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }

    // Supervisor Email validation
    if (supervisorEmailInput) {
        supervisorEmailInput.addEventListener('blur', function() {
            const result = validateSupervisorEmail(this.value);
            displayError(this, result.message);
        });
        supervisorEmailInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }

    // Project Title validation
    if (projectTitleInput) {
        projectTitleInput.addEventListener('blur', function() {
            const result = validateProjectTitle(this.value);
            displayError(this, result.message);
        });
        projectTitleInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }

    // Project Description validation
    if (projectDescriptionInput) {
        projectDescriptionInput.addEventListener('blur', function() {
            const result = validateProjectDescription(this.value);
            displayError(this, result.message);
        });
        projectDescriptionInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }

    // Performance Rating validation
    if (performanceRatingInput) {
        performanceRatingInput.addEventListener('change', function() {
            const result = validatePerformanceRating(this.value);
            displayError(this, result.message);
        });
    }

    // Skills Acquired validation
    if (skillsAcquiredInput) {
        skillsAcquiredInput.addEventListener('blur', function() {
            const result = validateSkillsAcquired(this.value);
            displayError(this, result.message);
        });
        skillsAcquiredInput.addEventListener('focus', function() {
            displayError(this, '');
        });
    }
}

// ============================================
// FORM SUBMISSION
// ============================================

/**
 * Handle internship form submission
 * @param {Event} event - Form submit event
 */
async function handleInternshipSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = getInternshipFormData();

    // Validate form
    const errors = validateInternshipForm(formData);

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
        submitButton.textContent = 'Submitting Details...';
        submitButton.disabled = true;

        // Get current user from sessionStorage
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};

        // Check if internship already exists
        if (internshipExists(currentUser.studentId, formData.companyName)) {
            throw new Error('You have already submitted internship details for ' + formData.companyName);
        }

        // Prepare data with additional info
        const internshipDataToSubmit = {
            ...formData,
            studentId: currentUser.studentId,
            duration: calculateDuration(formData.startDate, formData.endDate),
            submittedAt: new Date().toISOString()
        };

        // Call submission API
        const response = await submitInternshipAPI(internshipDataToSubmit);

        // Store internship data in sessionStorage
        sessionStorage.setItem('lastInternshipData', JSON.stringify(internshipDataToSubmit));

        // Show success message
        alert('Internship details submitted successfully!\n\n' +
              'Internship ID: ' + response.internshipId + '\n' +
              'Company: ' + formData.companyName + '\n' +
              'Duration: ' + internshipDataToSubmit.duration + ' days\n\n' +
              'Redirecting to dashboard...');

        // Clear form
        clearInternshipForm();

        // Redirect to dashboard after 1 second
        setTimeout(() => {
            window.location.href = 'student-dashboard.html';
        }, 1000);

    } catch (error) {
        // Show error message
        console.error('Internship submission error:', error);
        alert('Error submitting internship details:\n' + error.message + '\n\nPlease try again.');

        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

/**
 * Setup form submission handler
 */
function setupInternshipFormSubmission() {
    const internshipForm = document.getElementById('internshipForm');

    if (internshipForm) {
        internshipForm.addEventListener('submit', handleInternshipSubmit);
    }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all internship form functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    setupInternshipRealtimeValidation();
    setupInternshipFormSubmission();
    console.log('Internship details form initialized');
});