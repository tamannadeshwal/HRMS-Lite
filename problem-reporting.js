

// Mock database of problem reports (replace with API calls)
const problemReports = [];

// Mock database of student internships
const studentInternships = [
    { id: 'INT001', studentId: 'STU001234', companyName: 'Google', status: 'Active' },
    { id: 'INT002', studentId: 'STU001234', companyName: 'Microsoft', status: 'Active' },
    { id: 'INT003', studentId: 'STU001235', companyName: 'Amazon', status: 'Active' }
];

// ============================================
// DATABASE/API FUNCTIONS
// ============================================

/**
 * Get internships for current student
 * @param {string} studentId - Student ID
 * @returns {array} - Array of internships
 */
function getStudentInternships(studentId) {
    return studentInternships.filter(internship => internship.studentId === studentId);
}

/**
 * Populate internship select dropdown
 */
function populateInternshipSelect() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};
    const internshipSelect = document.getElementById('internshipSelect');

    if (!internshipSelect) return;

    const internships = getStudentInternships(currentUser.studentId);

    // Clear existing options except the first one
    internshipSelect.innerHTML = '<option value="">Choose an internship</option>';

    if (internships.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No internships found. Please add an internship first.';
        option.disabled = true;
        internshipSelect.appendChild(option);
        return;
    }

    internships.forEach(internship => {
        const option = document.createElement('option');
        option.value = internship.id;
        option.textContent = `${internship.companyName} (${internship.status})`;
        internshipSelect.appendChild(option);
    });
}

/**
 * Submit problem report to API
 * @param {object} problemData - Problem data to submit
 * @returns {Promise} - Promise with submission result
 */
function submitProblemReportAPI(problemData) {
    return new Promise((resolve, reject) => {
        // Simulate API call with timeout
        setTimeout(() => {
            try {
                // In production, replace this with:
                // fetch('/api/problems/report', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(problemData)
                // })

                const reportId = 'RPT' + Date.now();
                const report = {
                    reportId,
                    ...problemData,
                    submittedAt: new Date().toISOString(),
                    status: 'Submitted'
                };

                problemReports.push(report);

                const response = {
                    success: true,
                    message: 'Problem report submitted successfully',
                    reportId: reportId,
                    data: report
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
 * Validate internship selection
 * @param {string} value - Selected internship ID
 * @returns {object} - Validation result
 */
function validateInternshipSelect(value) {
    if (!value) {
        return { valid: false, message: 'Please select an internship' };
    }

    // Check if internship exists
    const internship = studentInternships.find(int => int.id === value);
    if (!internship) {
        return { valid: false, message: 'Selected internship is invalid' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate problem category
 * @param {string} value - Problem category
 * @returns {object} - Validation result
 */
function validateProblemCategory(value) {
    if (!value) {
        return { valid: false, message: 'Please select a problem category' };
    }

    const validCategories = [
        'Salary/Stipend',
        'Working Conditions',
        'Harassment',
        'Work Hours',
        'Task Mismatch',
        'Supervisor',
        'Academic',
        'Other'
    ];

    if (!validCategories.includes(value)) {
        return { valid: false, message: 'Please select a valid category' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate problem title
 * @param {string} value - Problem title
 * @returns {object} - Validation result
 */
function validateProblemTitle(value) {
    if (!value.trim()) {
        return { valid: false, message: 'Problem Title is required' };
    }

    if (value.trim().length < 5) {
        return { valid: false, message: 'Problem Title must be at least 5 characters' };
    }

    if (value.trim().length > 150) {
        return { valid: false, message: 'Problem Title must not exceed 150 characters' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate problem description
 * @param {string} value - Problem description
 * @returns {object} - Validation result
 */
function validateProblemDescription(value) {
    if (!value.trim()) {
        return { valid: false, message: 'Detailed Description is required' };
    }

    if (value.trim().length < 20) {
        return { valid: false, message: 'Description must be at least 20 characters' };
    }

    if (value.trim().length > 3000) {
        return { valid: false, message: 'Description must not exceed 3000 characters' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate problem date
 * @param {string} value - Problem date (YYYY-MM-DD format)
 * @returns {object} - Validation result
 */
function validateProblemDate(value) {
    if (!value) {
        return { valid: false, message: 'Problem Date is required' };
    }

    const problemDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxPastDate = new Date();
    maxPastDate.setMonth(maxPastDate.getMonth() - 12); // Last 12 months

    if (problemDate > today) {
        return { valid: false, message: 'Problem Date cannot be in the future' };
    }

    if (problemDate < maxPastDate) {
        return { valid: false, message: 'Problem Date cannot be more than 12 months old' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate severity level
 * @param {string} value - Severity level
 * @returns {object} - Validation result
 */
function validateSeverity(value) {
    if (!value) {
        return { valid: false, message: 'Please select severity level' };
    }

    const validSeverities = ['Low', 'Medium', 'High', 'Critical'];
    if (!validSeverities.includes(value)) {
        return { valid: false, message: 'Please select a valid severity level' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate reported before radio button
 * @param {string} value - Radio button value (yes/no)
 * @returns {object} - Validation result
 */
function validateReported(value) {
    if (!value) {
        return { valid: false, message: 'Please indicate if this was reported before' };
    }

    if (!['yes', 'no'].includes(value)) {
        return { valid: false, message: 'Invalid selection' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate previous report details
 * @param {string} reported - Whether reported before (yes/no)
 * @param {string} previousReportDetails - Previous report details
 * @returns {object} - Validation result
 */
function validatePreviousReportDetails(reported, previousReportDetails) {
    if (reported === 'yes') {
        if (!previousReportDetails.trim()) {
            return { valid: false, message: 'Please provide details of previous report' };
        }

        if (previousReportDetails.trim().length < 10) {
            return { valid: false, message: 'Previous report details must be at least 10 characters' };
        }
    }

    return { valid: true, message: '' };
}

/**
 * Validate witnesses (optional)
 * @param {string} value - Witnesses
 * @returns {object} - Validation result
 */
function validateWitnesses(value) {
    if (!value) {
        return { valid: true, message: '' }; // Optional field
    }

    if (value.length > 500) {
        return { valid: false, message: 'Witnesses field must not exceed 500 characters' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate evidence (optional)
 * @param {string} value - Evidence
 * @returns {object} - Validation result
 */
function validateEvidence(value) {
    if (!value) {
        return { valid: true, message: '' }; // Optional field
    }

    if (value.length > 500) {
        return { valid: false, message: 'Evidence field must not exceed 500 characters' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate terms acceptance
 * @param {boolean} value - Terms checkbox value
 * @returns {object} - Validation result
 */
function validateAcceptTerms(value) {
    if (!value) {
        return { valid: false, message: 'You must accept the terms to submit' };
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
function getProblemFormData() {
    const reportedRadio = document.querySelector('input[name="reported"]:checked');

    return {
        internshipSelect: document.getElementById('internshipSelect').value,
        problemCategory: document.getElementById('problemCategory').value,
        problemTitle: document.getElementById('problemTitle').value.trim(),
        problemDescription: document.getElementById('problemDescription').value.trim(),
        problemDate: document.getElementById('problemDate').value,
        severity: document.getElementById('severity').value,
        reported: reportedRadio ? reportedRadio.value : '',
        previousReportDetails: document.getElementById('previousReportDetails').value.trim(),
        witnesses: document.getElementById('witnesses').value.trim(),
        evidence: document.getElementById('evidence').value.trim(),
        anonymousReport: document.getElementById('anonymousReport').checked,
        acceptTerms: document.getElementById('acceptTerms').checked
    };
}

/**
 * Clear all form inputs
 */
function clearProblemForm() {
    const form = document.getElementById('problemForm');
    if (form) {
        form.reset();
    }
    // Hide previous report details section
    const previousReportDiv = document.getElementById('previousReportDiv');
    if (previousReportDiv) {
        previousReportDiv.style.display = 'none';
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
    if (!fieldElement) return;

    const errorElement = fieldElement.parentElement.querySelector('.error-text');
    if (errorElement) {
        if (message) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            if (fieldElement.type !== 'radio') {
                fieldElement.classList.add('error');
            }
        } else {
            errorElement.classList.remove('show');
            if (fieldElement.type !== 'radio') {
                fieldElement.classList.remove('error');
            }
        }
    }
}

/**
 * Display error for radio buttons
 * @param {string} fieldName - Field name
 * @param {string} message - Error message
 */
function displayRadioError(fieldName, message) {
    const radioGroup = document.querySelector(`input[name="${fieldName}"]`);
    if (!radioGroup) return;

    const errorElement = radioGroup.closest('.form-group').querySelector('.error-text');
    if (errorElement) {
        if (message) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        } else {
            errorElement.classList.remove('show');
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
        if (fieldName === 'reported') {
            displayRadioError(fieldName, errorMessage);
        } else {
            const fieldElement = document.getElementById(fieldName);
            if (fieldElement) {
                displayError(fieldElement, errorMessage);
            }
        }
    }
}

/**
 * Clear all error displays
*/
function clearAllErrors() {
const errorElements = document.querySelectorAll('.error-text');
const inputElements = document.querySelectorAll(
'.form-group input[type="text"], ' +
'.form-group input[type="date"], ' +
'.form-group select, ' +
'.form-group textarea'
);

errorElements.forEach(el => el.classList.remove('show'));
inputElements.forEach(el => el.classList.remove('error'));
}

// ============================================
// VALIDATION AGGREGATION
// ============================================

/**

Validate entire problem form

@param {object} formData - Form data to validate

@returns {object} - Object with errors (empty if valid)
*/
function validateProblemForm(formData) {
const errors = {};

// Validate Internship Selection
const internshipValidation = validateInternshipSelect(formData.internshipSelect);
if (!internshipValidation.valid) {
errors.internshipSelect = internshipValidation.message;
}

// Validate Problem Category
const categoryValidation = validateProblemCategory(formData.problemCategory);
if (!categoryValidation.valid) {
errors.problemCategory = categoryValidation.message;
}

// Validate Problem Title
const titleValidation = validateProblemTitle(formData.problemTitle);
if (!titleValidation.valid) {
errors.problemTitle = titleValidation.message;
}

// Validate Problem Description
const descriptionValidation = validateProblemDescription(formData.problemDescription);
if (!descriptionValidation.valid) {
errors.problemDescription = descriptionValidation.message;
}

// Validate Problem Date
const dateValidation = validateProblemDate(formData.problemDate);
if (!dateValidation.valid) {
errors.problemDate = dateValidation.message;
}

// Validate Severity
const severityValidation = validateSeverity(formData.severity);
if (!severityValidation.valid) {
errors.severity = severityValidation.message;
}

// Validate Reported Before
const reportedValidation = validateReported(formData.reported);
if (!reportedValidation.valid) {
errors.reported = reportedValidation.message;
}

// Validate Previous Report Details if applicable
const previousReportValidation = validatePreviousReportDetails(
formData.reported,
formData.previousReportDetails
);
if (!previousReportValidation.valid) {
errors.previousReportDetails = previousReportValidation.message;
}

// Validate Witnesses
const witnessesValidation = validateWitnesses(formData.witnesses);
if (!witnessesValidation.valid) {
errors.witnesses = witnessesValidation.message;
}

// Validate Evidence
const evidenceValidation = validateEvidence(formData.evidence);
if (!evidenceValidation.valid) {
errors.evidence = evidenceValidation.message;
}

// Validate Terms Acceptance
const termsValidation = validateAcceptTerms(formData.acceptTerms);
if (!termsValidation.valid) {
errors.acceptTerms = termsValidation.message;
}

return errors;
}

// ============================================
// DYNAMIC FIELD VISIBILITY
// ============================================

/**

Setup dynamic field visibility based on "reported before" radio button
*/
function setupDynamicFieldVisibility() {
const reportedRadios = document.querySelectorAll('input[name="reported"]');
const previousReportDiv = document.getElementById('previousReportDiv');

reportedRadios.forEach(radio => {
radio.addEventListener('change', function() {
if (this.value === 'yes') {
previousReportDiv.style.display = 'flex';
previousReportDiv.style.flexDirection = 'column';
} else {
previousReportDiv.style.display = 'none';
// Clear the field if hidden
document.getElementById('previousReportDetails').value = '';
}
});
});
}

// ============================================
// REAL-TIME VALIDATION SETUP
// ============================================

/**

Setup real-time validation for problem form fields
*/
function setupProblemRealtimeValidation() {
const internshipSelect = document.getElementById('internshipSelect');
const categorySelect = document.getElementById('problemCategory');
const titleInput = document.getElementById('problemTitle');
const descriptionInput = document.getElementById('problemDescription');
const dateInput = document.getElementById('problemDate');
const severitySelect = document.getElementById('severity');
const previousReportInput = document.getElementById('previousReportDetails');
const witnessesInput = document.getElementById('witnesses');
const evidenceInput = document.getElementById('evidence');

// Internship selection validation
if (internshipSelect) {
internshipSelect.addEventListener('change', function() {
const result = validateInternshipSelect(this.value);
displayError(this, result.message);
});
}

// Category validation
if (categorySelect) {
categorySelect.addEventListener('change', function() {
const result = validateProblemCategory(this.value);
displayError(this, result.message);
});
}

// Title validation
if (titleInput) {
titleInput.addEventListener('blur', function() {
const result = validateProblemTitle(this.value);
displayError(this, result.message);
});
titleInput.addEventListener('focus', function() {
displayError(this, '');
});
}

// Description validation
if (descriptionInput) {
descriptionInput.addEventListener('blur', function() {
const result = validateProblemDescription(this.value);
displayError(this, result.message);
});
descriptionInput.addEventListener('focus', function() {
displayError(this, '');
});
}

// Date validation
if (dateInput) {
dateInput.addEventListener('blur', function() {
const result = validateProblemDate(this.value);
displayError(this, result.message);
});
dateInput.addEventListener('focus', function() {
displayError(this, '');
});
}

// Severity validation
if (severitySelect) {
severitySelect.addEventListener('change', function() {
const result = validateSeverity(this.value);
displayError(this, result.message);
});
}

// Previous report details validation
if (previousReportInput) {
previousReportInput.addEventListener('blur', function() {
const reported = document.querySelector('input[name="reported"]:checked').value;
const result = validatePreviousReportDetails(reported, this.value);
displayError(this, result.message);
});
previousReportInput.addEventListener('focus', function() {
displayError(this, '');
});
}

// Witnesses validation
if (witnessesInput) {
witnessesInput.addEventListener('blur', function() {
const result = validateWitnesses(this.value);
displayError(this, result.message);
});
witnessesInput.addEventListener('focus', function() {
displayError(this, '');
});
}

// Evidence validation
if (evidenceInput) {
evidenceInput.addEventListener('blur', function() {
const result = validateEvidence(this.value);
displayError(this, result.message);
});
evidenceInput.addEventListener('focus', function() {
displayError(this, '');
});
}
}

// ============================================
// FORM SUBMISSION
// ============================================

/**

Handle problem form submission

@param {Event} event - Form submit event
*/
async function handleProblemSubmit(event) {
event.preventDefault();

// Get form data
const formData = getProblemFormData();

// Validate form
const errors = validateProblemForm(formData);

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
submitButton.textContent = 'Submitting Report...';
submitButton.disabled = true;

 // Get current user from sessionStorage
 const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};

 // Get selected internship info
 const selectedInternship = studentInternships.find(
     int => int.id === formData.internshipSelect
 );

 // Prepare data for submission
 const problemDataToSubmit = {
     ...formData,
     studentId: currentUser.studentId,
     studentEmail: currentUser.email,
     internshipName: selectedInternship ? selectedInternship.companyName : '',
     submittedAt: new Date().toISOString()
 };

 // Call submission API
 const response = await submitProblemReportAPI(problemDataToSubmit);

 // Store report data in sessionStorage
 sessionStorage.setItem('lastProblemReport', JSON.stringify(problemDataToSubmit));

 // Show success message
 let successMessage = 'Problem report submitted successfully!\n\n' +
                     'Report ID: ' + response.reportId + '\n' +
                     'Category: ' + formData.problemCategory + '\n' +
                     'Severity: ' + formData.severity;

 if (formData.anonymousReport) {
     successMessage += '\n\nThis report has been submitted anonymously.';
 }

 successMessage += '\n\nRedirecting to dashboard...';

 alert(successMessage);

 // Clear form
 clearProblemForm();

 // Redirect to dashboard after 1 second
 setTimeout(() => {
     window.location.href = 'student-dashboard.html';
 }, 1000);
} catch (error) {
// Show error message
console.error('Problem submission error:', error);
alert('Error submitting problem report:\n' + error.message + '\n\nPlease try again.');

 // Reset button state
 submitButton.textContent = originalText;
 submitButton.disabled = false;
}
}

/**

Setup form submission handler
*/
function setupProblemFormSubmission() {
const problemForm = document.getElementById('problemForm');

if (problemForm) {
problemForm.addEventListener('submit', handleProblemSubmit);
}
}

// ============================================
// INITIALIZATION
// ============================================

/**

Initialize all problem form functionality when DOM is ready
*/
document.addEventListener('DOMContentLoaded', function() {
populateInternshipSelect();
setupDynamicFieldVisibility();
setupProblemRealtimeValidation();
setupProblemFormSubmission();
console.log('Problem reporting form initialized');
});