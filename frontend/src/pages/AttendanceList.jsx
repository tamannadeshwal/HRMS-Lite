import { useState, useEffect } from 'react';
import { attendanceAPI, employeeAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { formatDate, getStatusColor, getStatusLabel } from '../utils/helpers';
import './AttendanceList.css';

const AttendanceList = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [filters, setFilters] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    status: '',
  });
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const filterParams = {};
      if (filters.employeeId) filterParams.employeeId = filters.employeeId;
      if (filters.startDate) filterParams.startDate = filters.startDate;
      if (filters.endDate) filterParams.endDate = filters.endDate;
      if (filters.status) filterParams.status = filters.status;

      const [attendanceRes, employeesRes, statsRes] = await Promise.all([
        attendanceAPI.getAll(filterParams),
        employeeAPI.getAll(),
        attendanceAPI.getStats(filterParams),
      ]);

      setAttendance(attendanceRes.data.data);
      setEmployees(employeesRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleOpenModal = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        employeeId: record.employeeId.toString(),
        date: new Date(record.date).toISOString().split('T')[0],
        status: record.status,
        notes: record.notes || '',
      });
    } else {
      setEditingRecord(null);
      setFormData({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    setFormData({
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      notes: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        employeeId: parseInt(formData.employeeId),
      };

      if (editingRecord) {
        await attendanceAPI.update(editingRecord.id, {
          date: submitData.date,
          status: submitData.status,
          notes: submitData.notes,
        });
      } else {
        await attendanceAPI.create(submitData);
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }

    try {
      await attendanceAPI.delete(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      employeeId: '',
      startDate: '',
      endDate: '',
      status: '',
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading attendance records..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  return (
    <div className="attendance-list">
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Records</div>
            <div className="stat-value">{stats.overall.total}</div>
          </div>
          <div className="stat-card stat-present">
            <div className="stat-label">Present</div>
            <div className="stat-value">{stats.overall.present}</div>
          </div>
          <div className="stat-card stat-absent">
            <div className="stat-label">Absent</div>
            <div className="stat-value">{stats.overall.absent}</div>
          </div>
          <div className="stat-card stat-leave">
            <div className="stat-label">On Leave</div>
            <div className="stat-value">{stats.overall.leave}</div>
          </div>
          <div className="stat-card stat-halfday">
            <div className="stat-label">Half Day</div>
            <div className="stat-value">{stats.overall.halfDay}</div>
          </div>
        </div>
      )}

      <Card
        title="Attendance Records"
        actions={
          <Button onClick={() => handleOpenModal()}>
            + Mark Attendance
          </Button>
        }
      >
        <div className="filters">
          <select
            value={filters.employeeId}
            onChange={(e) => handleFilterChange('employeeId', e.target.value)}
            className="filter-select"
          >
            <option value="">All Employees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            placeholder="Start Date"
            className="filter-input"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            placeholder="End Date"
            className="filter-input"
          />

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
            <option value="half-day">Half Day</option>
          </select>

          {(filters.employeeId || filters.startDate || filters.endDate || filters.status) && (
            <Button variant="secondary" size="small" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>

        {attendance.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No attendance records found"
            message={
              filters.employeeId || filters.startDate || filters.endDate || filters.status
                ? 'Try adjusting your filters'
                : 'Get started by marking attendance for employees'
            }
            action={
              <Button onClick={() => handleOpenModal()}>
                + Mark Attendance
              </Button>
            }
          />
        ) : (
          <div className="attendance-table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record.id}>
                    <td>{record.employee.name}</td>
                    <td>
                      <span className="department-badge">
                        {record.employee.department}
                      </span>
                    </td>
                    <td>{formatDate(record.date)}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(record.status) }}
                      >
                        {getStatusLabel(record.status)}
                      </span>
                    </td>
                    <td className="notes-cell">{record.notes || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleOpenModal(record)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(record.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {stats && stats.byEmployee.length > 0 && (
          <div className="employee-stats">
            <h3 className="employee-stats-title">Attendance by Employee</h3>
            <div className="employee-stats-grid">
              {stats.byEmployee.map((empStat) => (
                <div key={empStat.id} className="employee-stat-card">
                  <div className="employee-stat-name">{empStat.name}</div>
                  <div className="employee-stat-row">
                    <span>Present:</span>
                    <strong>{empStat.present}</strong>
                  </div>
                  <div className="employee-stat-row">
                    <span>Absent:</span>
                    <strong>{empStat.absent}</strong>
                  </div>
                  <div className="employee-stat-row">
                    <span>Leave:</span>
                    <strong>{empStat.leave}</strong>
                  </div>
                  <div className="employee-stat-row">
                    <span>Half Day:</span>
                    <strong>{empStat.halfDay}</strong>
                  </div>
                  <div className="employee-stat-row employee-stat-total">
                    <span>Total:</span>
                    <strong>{empStat.total}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRecord ? 'Edit Attendance' : 'Mark Attendance'}
      >
        <form onSubmit={handleSubmit} className="attendance-form">
          <div className="form-group">
            <label htmlFor="employeeId">Employee *</label>
            <select
              id="employeeId"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              required
              disabled={submitting || editingRecord}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.department}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
              disabled={submitting}
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
              <option value="half-day">Half Day</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              disabled={submitting}
              placeholder="Optional notes..."
            />
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingRecord ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AttendanceList;
