// ============================================
// MOCK DATA
// ============================================

const students = [
    {
        studentId: 'STU001',
        name: 'Rahul Sharma',
        email: 'rahul@gmail.com',
        department: 'CSE',
        semester: 6,
        phone: '9876543210'
    },
    {
        studentId: 'STU002',
        name: 'Ananya Verma',
        email: 'ananya@gmail.com',
        department: 'ECE',
        semester: 5,
        phone: '9123456780'
    }
];

const internships = [
    {
        studentId: 'STU001',
        companyName: 'Google',
        type: 'Technical',
        startDate: '2024-01-01',
        endDate: '2024-03-01',
        hours: 240,
        status: 'Pending'
    },
    {
        studentId: 'STU002',
        companyName: 'Microsoft',
        type: 'Technical',
        startDate: '2024-02-01',
        endDate: '2024-04-01',
        hours: 200,
        status: 'Approved'
    }
];

const problems = [
    {
        studentName: 'Rahul Sharma',
        title: 'Excess Working Hours',
        description: 'More than 8 hours daily',
        severity: 'High',
        status: 'Pending'
    }
];

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadStatistics();
    loadStudents();
    loadInternships();
    loadProblems();
    setupFilters();
});

// ============================================
// STATISTICS
// ============================================

function loadStatistics() {
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalInternships').textContent = internships.length;
    document.getElementById('totalProblems').textContent = problems.length;
    document.getElementById('pendingProblems').textContent =
        problems.filter(p => p.status === 'Pending').length;
}

// ============================================
// STUDENTS
// ============================================

function loadStudents(filterText = '', department = '') {
    const tbody = document.getElementById('studentsTableBody');
    const noData = document.getElementById('noStudentsMsg');

    tbody.innerHTML = '';

    const filtered = students.filter(s =>
        (s.name.toLowerCase().includes(filterText) ||
            s.email.toLowerCase().includes(filterText) ||
            s.studentId.toLowerCase().includes(filterText)) &&
        (department === '' || s.department === department)
    );

    if (filtered.length === 0) {
        noData.style.display = 'block';
        return;
    }

    noData.style.display = 'none';

    filtered.forEach(s => {
        tbody.innerHTML += `
            <tr>
                <td>${s.studentId}</td>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>${s.department}</td>
                <td>${s.semester}</td>
                <td>${s.phone}</td>
                <td>
                    <button onclick="openStudentModal('${s.studentId}')">View</button>
                </td>
            </tr>
        `;
    });
}

function openStudentModal(studentId) {
    const student = students.find(s => s.studentId === studentId);
    if (!student) return;

    document.getElementById('studentModalBody').innerHTML = `
        <p><strong>ID:</strong> ${student.studentId}</p>
        <p><strong>Name:</strong> ${student.name}</p>
        <p><strong>Email:</strong> ${student.email}</p>
        <p><strong>Department:</strong> ${student.department}</p>
        <p><strong>Semester:</strong> ${student.semester}</p>
        <p><strong>Phone:</strong> ${student.phone}</p>
    `;

    document.getElementById('studentModal').classList.add('show');
}

// ============================================
// INTERNSHIPS
// ============================================

function loadInternships(search = '', status = '') {
    const tbody = document.getElementById('internshipsTableBody');
    const noData = document.getElementById('noInternshipsMsg');

    tbody.innerHTML = '';

    const filtered = internships.filter(i =>
        (i.companyName.toLowerCase().includes(search) ||
            i.studentId.toLowerCase().includes(search)) &&
        (status === '' || i.status === status)
    );

    if (filtered.length === 0) {
        noData.style.display = 'block';
        return;
    }

    noData.style.display = 'none';

    filtered.forEach(i => {
        tbody.innerHTML += `
            <tr>
                <td>${i.studentId}</td>
                <td>${i.companyName}</td>
                <td>${i.type}</td>
                <td>${i.startDate}</td>
                <td>${i.endDate}</td>
                <td>${i.hours}</td>
                <td>${i.status}</td>
                <td>
                    <button onclick="openInternshipModal()">View</button>
                </td>
            </tr>
        `;
    });
}

function openInternshipModal() {
    document.getElementById('internshipModal').classList.add('show');
}

// ============================================
// PROBLEMS
// ============================================

function loadProblems(search = '', severity = '') {
    const list = document.getElementById('problemsList');
    const noData = document.getElementById('noProblemsMsg');

    list.innerHTML = '';

    const filtered = problems.filter(p =>
        (p.studentName.toLowerCase().includes(search) ||
            p.title.toLowerCase().includes(search)) &&
        (severity === '' || p.severity === severity)
    );

    if (filtered.length === 0) {
        noData.style.display = 'block';
        return;
    }

    noData.style.display = 'none';

    filtered.forEach(p => {
        list.innerHTML += `
            <div class="problem-card">
                <h3>${p.title}</h3>
                <p><strong>Student:</strong> ${p.studentName}</p>
                <p><strong>Severity:</strong> ${p.severity}</p>
                <p><strong>Status:</strong> ${p.status}</p>
                <button onclick="openProblemModal()">View</button>
            </div>
        `;
    });
}

function openProblemModal() {
    document.getElementById('problemModal').classList.add('show');
}

// ============================================
// FILTERS & SEARCH
// ============================================

function setupFilters() {
    document.getElementById('searchStudent').addEventListener('input', e => {
        loadStudents(e.target.value.toLowerCase(),
            document.getElementById('departmentFilter').value);
    });

    document.getElementById('departmentFilter').addEventListener('change', e => {
        loadStudents(document.getElementById('searchStudent').value.toLowerCase(),
            e.target.value);
    });

    document.getElementById('searchInternship').addEventListener('input', e => {
        loadInternships(e.target.value.toLowerCase(),
            document.getElementById('statusFilter').value);
    });

    document.getElementById('statusFilter').addEventListener('change', e => {
        loadInternships(document.getElementById('searchInternship').value.toLowerCase(),
            e.target.value);
    });

    document.getElementById('searchProblem').addEventListener('input', e => {
        loadProblems(e.target.value.toLowerCase(),
            document.getElementById('severityFilter').value);
    });

    document.getElementById('severityFilter').addEventListener('change', e => {
        loadProblems(document.getElementById('searchProblem').value.toLowerCase(),
            e.target.value);
    });
}
