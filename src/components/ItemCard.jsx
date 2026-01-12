import React from 'react';

function ItemCard({ item }) {
  // Check if it's lost or found to change the badge color
  const statusColor = item.status === 'lost' ? 'bg-danger' : 'bg-success';

  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title fw-bold text-uppercase">{item.title}</h5>
            <span className={`badge ${statusColor}`}>{item.status}</span>
          </div>
          <p className="card-text text-muted small">
            <i className="bi bi-geo-alt-fill me-1"></i> {item.location}
          </p>
          <p className="card-text">{item.description}</p>
          <div className="mt-3 pt-3 border-top">
            <p className="mb-0 small text-secondary">Contact Person:</p>
            <p className="fw-bold mb-0">{item.contact_info}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;