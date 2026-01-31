// ============================================
// STUDENT DASHBOARD FUNCTIONALITY
// ============================================

// Mock data - internships
const mockStudentInternships = [
    {
        id: 'INT001',
        studentId: 'STU001234',
        companyName: 'Google',
        internshipType: 'Technical',
        startDate: '2024-01-15',
        endDate: '2024-03-15',
        workingHours: 240,
        stipend: 50000,
        supervisorName: 'John Smith',
        supervisorEmail: 'john.smith@google.com',
        projectTitle: 'AI Chatbot Development',
        projectDescription: 'Developed an AI-powered chatbot using Python and NLP',
        performanceRating: 'Excellent',
        skillsAcquired: 'Python, TensorFlow, NLP',
        status: 'Approved'
    },
    {
        id: 'INT002',
        studentId: 'STU001234',
        companyName: 'Microsoft',
        internshipType: 'Technical',
        startDate: '2024-05-01',
        endDate: '2024-07-01',
        workingHours: 200,
        stipend: 45000,
        supervisorName: 'Sarah Johnson',
        supervisorEmail: 'sarah.johnson@microsoft.com',
        projectTitle: 'Cloud Migration Project',
        projectDescription: 'Migrated legacy systems to Azure',
        performanceRating: 'Very Good',
        skillsAcquired: 'Azure, DevOps',
        status: 'Pending'
    }
];

// Mock data - problems
const mockStudentProblems = [
    {
        reportId: 'RPT001',
        companyName: 'Google',
        problemCategory: 'Work Hours',
        problemTitle: 'Excessive working hours',
        problemDescription: 'More than 8 hours daily',
        severity: 'High',
        reported: 'yes',
        previousReportDetails: 'Reported to HR',
        witnesses: 'John Doe',
        evidence: 'Email records',
        anonymousReport: false,
        status: 'Under Review',
        submittedAt: '2024-02-12'
    }
];

// ============================================
// INITIALIZATION
// ============================================

function loadStudentData() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

function initializeDashboard() {
    const user = loadStudentData();
    if (!user) return;

    updateStudentName(user);
    loadAndDisplayInternships(user.studentId);
    loadAndDisplayProblems();
    updateStatistics(user.studentId);
}

// ============================================
// UI UPDATES
// ============================================

function updateStudentName(student) {
    const studentName = document.getElementById('studentName');
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (studentName) studentName.textContent = student.email;
    if (welcomeMessage) {
        const name = student.email.split('@')[0];
        welcomeMessage.textContent = `Welcome back, ${name}!`;
    }
}

function updateStatistics(studentId) {
    const internships = mockStudentInternships;
    document.getElementById('internshipCount').textContent = internships.length;
    document.getElementById('hoursWorked').textContent =
        internships.reduce((t, i) => t + i.workingHours, 0);
    document.getElementById('stipendEarned').textContent =
        '₹' + internships.reduce((t, i) => t + i.stipend, 0).toLocaleString('en-IN');
    document.getElementById('completedInternships').textContent =
        internships.filter(i => i.status === 'Approved').length;
}

// ============================================
// INTERNSHIPS
// ============================================

function loadAndDisplayInternships() {
    const container = document.querySelector('.internship-container');
    container.innerHTML = '<h2>Your Internships</h2>';

    mockStudentInternships.forEach(int => {
        const statusClass = `status-${int.status.toLowerCase()}`;
        container.innerHTML += `
        <div class="internship-card">
            <h3>${escapeHtml(int.companyName)}</h3>
            <span class="status-badge ${statusClass}">${int.status}</span>
            <p>Hours: ${int.workingHours}</p>
            <p>Stipend: ₹${int.stipend}</p>
            <button onclick="viewInternshipDetails('${int.id}')">View</button>
        </div>`;
    });
}

function viewInternshipDetails(id) {
    const int = mockStudentInternships.find(i => i.id === id);
    if (!int) return alert('Not found');

    alert(`
Company: ${int.companyName}
Project: ${int.projectTitle}
Supervisor: ${int.supervisorName}
Status: ${int.status}
`);
}

// ============================================
// PROBLEMS
// ============================================

function loadAndDisplayProblems() {
    const container = document.querySelector('.problem-container');
    container.innerHTML = '<h2>Your Problem Reports</h2>';

    mockStudentProblems.forEach(p => {
        const severityClass = `severity-${p.severity.toLowerCase()}`;
        container.innerHTML += `
        <div class="problem-card">
            <h3>${escapeHtml(p.problemTitle)}</h3>
            <span class="status-badge ${severityClass}">${p.severity}</span>
            <p>${escapeHtml(p.problemDescription)}</p>
            <button onclick="viewProblemDetails('${p.reportId}')">View</button>
        </div>`;
    });
}

function viewProblemDetails(id) {
    const p = mockStudentProblems.find(r => r.reportId === id);
    if (!p) return;

    alert(`
Title: ${p.problemTitle}
Severity: ${p.severity}
Status: ${p.status}
Reported: ${p.reported === 'yes' ? 'Yes' : 'No'}
`);
}

// ============================================
// HELPERS
// ============================================

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// LOGOUT
// ============================================

function handleLogout() {
    if (confirm('Logout?')) {
        sessionStorage.clear();
        window.location.href = 'login.html';
    }
}

// ============================================
// START
// ============================================

document.addEventListener('DOMContentLoaded', initializeDashboard);
