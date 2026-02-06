import { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { formatDate } from '../utils/helpers';
import './EmployeeList.css';

const EmployeeList = ({ onSelectEmployee }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    joinDate: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        joinDate: new Date(employee.joinDate).toISOString().split('T')[0],
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        email: '',
        department: '',
        position: '',
        joinDate: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      department: '',
      position: '',
      joinDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingEmployee) {
        await employeeAPI.update(editingEmployee.id, formData);
      } else {
        await employeeAPI.create(formData);
      }
      handleCloseModal();
      fetchEmployees();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      await employeeAPI.delete(id);
      fetchEmployees();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading employees..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchEmployees} />;
  }

  return (
    <div className="employee-list">
      <Card
        title="Employees"
        actions={
          <Button onClick={() => handleOpenModal()}>
            + Add Employee
          </Button>
        }
      >
        {employees.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No employees found"
            message="Get started by adding your first employee"
            action={
              <Button onClick={() => handleOpenModal()}>
                + Add Employee
              </Button>
            }
          />
        ) : (
          <div className="employee-table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <button
                        className="employee-name-link"
                        onClick={() => onSelectEmployee(employee.id)}
                      >
                        {employee.name}
                      </button>
                    </td>
                    <td>{employee.email}</td>
                    <td>
                      <span className="department-badge">
                        {employee.department}
                      </span>
                    </td>
                    <td>{employee.position}</td>
                    <td>{formatDate(employee.joinDate)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleOpenModal(employee)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(employee.id)}
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
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
      >
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <input
              type="text"
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Position *</label>
            <input
              type="text"
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="joinDate">Join Date *</label>
            <input
              type="date"
              id="joinDate"
              value={formData.joinDate}
              onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              required
              disabled={submitting}
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
              {submitting ? 'Saving...' : editingEmployee ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeList;
