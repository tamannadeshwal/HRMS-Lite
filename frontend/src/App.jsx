import { useState } from 'react';
import EmployeeList from './pages/EmployeeList';
import AttendanceList from './pages/AttendanceList';
import EmployeeDetail from './pages/EmployeeDetail';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('employees');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const handleSelectEmployee = (id) => {
    setSelectedEmployeeId(id);
  };

  const handleBackToList = () => {
    setSelectedEmployeeId(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">🏢 HRMS Lite</h1>
          <p className="app-subtitle">Human Resource Management System</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {selectedEmployeeId ? (
            <EmployeeDetail
              employeeId={selectedEmployeeId}
              onBack={handleBackToList}
            />
          ) : (
            <>
              <nav className="app-nav">
                <button
                  className={`nav-button ${activeTab === 'employees' ? 'active' : ''}`}
                  onClick={() => setActiveTab('employees')}
                >
                  👥 Employees
                </button>
                <button
                  className={`nav-button ${activeTab === 'attendance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('attendance')}
                >
                  📅 Attendance
                </button>
              </nav>

              <div className="app-content">
                {activeTab === 'employees' && (
                  <EmployeeList onSelectEmployee={handleSelectEmployee} />
                )}
                {activeTab === 'attendance' && <AttendanceList />}
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>© 2024 HRMS Lite - Built with React, Express, Prisma & SQLite</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
