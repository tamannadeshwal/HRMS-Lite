import './Card.css';

const Card = ({ children, className = '', title, actions }) => {
  return (
    <div className={`card ${className}`}>
      {(title || actions) && (
        <div className="card-header">
          {title && <h2 className="card-title">{title}</h2>}
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
};

export default Card;
