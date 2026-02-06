import { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatDate, getStatusColor, getStatusLabel } from '../utils/helpers';
import './EmployeeDetail.css';

const EmployeeDetail = ({ employeeId, onBack }) => {
  const [employee, setEmployee] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError(null);
        const [empRes, statsRes] = await Promise.all([
          employeeAPI.getById(employeeId),
          employeeAPI.getStats(employeeId),
        ]);
        setEmployee(empRes.data.data);
        setStats(statsRes.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  if (loading) {
    return <LoadingSpinner message="Loading employee details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  if (!employee) {
    return <ErrorMessage message="Employee not found" />;
  }

  return (
    <div className="employee-detail">
      <Button variant="secondary" size="small" onClick={onBack}>
        ← Back to List
      </Button>

      <Card title="Employee Information">
        <div className="employee-info-grid">
          <div className="info-item">
            <span className="info-label">Name</span>
            <span className="info-value">{employee.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{employee.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Department</span>
            <span className="info-value">
              <span className="department-badge">{employee.department}</span>
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Position</span>
            <span className="info-value">{employee.position}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Join Date</span>
            <span className="info-value">{formatDate(employee.joinDate)}</span>
          </div>
        </div>
      </Card>

      {stats && (
        <Card title="Attendance Statistics">
          <div className="stats-grid">
            <div className="stat-box stat-total">
              <div className="stat-box-label">Total Records</div>
              <div className="stat-box-value">{stats.stats.total}</div>
            </div>
            <div className="stat-box stat-present">
              <div className="stat-box-label">Present</div>
              <div className="stat-box-value">{stats.stats.present}</div>
            </div>
            <div className="stat-box stat-absent">
              <div className="stat-box-label">Absent</div>
              <div className="stat-box-value">{stats.stats.absent}</div>
            </div>
            <div className="stat-box stat-leave">
              <div className="stat-box-label">On Leave</div>
              <div className="stat-box-value">{stats.stats.leave}</div>
            </div>
            <div className="stat-box stat-halfday">
              <div className="stat-box-label">Half Day</div>
              <div className="stat-box-value">{stats.stats.halfDay}</div>
            </div>
          </div>

          {stats.stats.total > 0 && (
            <div className="attendance-percentage">
              <div className="percentage-label">Attendance Rate</div>
              <div className="percentage-value">
                {((stats.stats.present / stats.stats.total) * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </Card>
      )}

      {employee.attendance && employee.attendance.length > 0 && (
        <Card title="Recent Attendance">
          <div className="attendance-timeline">
            {employee.attendance.map((record) => (
              <div key={record.id} className="timeline-item">
                <div className="timeline-date">{formatDate(record.date)}</div>
                <div className="timeline-status">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(record.status) }}
                  >
                    {getStatusLabel(record.status)}
                  </span>
                </div>
                {record.notes && (
                  <div className="timeline-notes">{record.notes}</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default EmployeeDetail;
