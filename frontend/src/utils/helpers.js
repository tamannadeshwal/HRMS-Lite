import { format, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'MMM dd, yyyy');
  } catch (error) {
    return '';
  }
};

export const formatDateTime = (date) => {
  if (!date) return '';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return '';
  }
};

export const formatDateInput = (date) => {
  if (!date) return '';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'yyyy-MM-dd');
  } catch (error) {
    return '';
  }
};

export const getStatusColor = (status) => {
  const colors = {
    present: '#10b981',
    absent: '#ef4444',
    leave: '#f59e0b',
    'half-day': '#3b82f6',
  };
  return colors[status] || '#6b7280';
};

export const getStatusLabel = (status) => {
  const labels = {
    present: 'Present',
    absent: 'Absent',
    leave: 'Leave',
    'half-day': 'Half Day',
  };
  return labels[status] || status;
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
