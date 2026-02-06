import './ErrorMessage.css';

const ErrorMessage = ({ title = 'Error', message, onRetry }) => {
  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">{title}</h3>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="error-retry-btn">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
