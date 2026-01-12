import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm" 
      style={{ 
        background: 'rgba(13, 110, 253, 0.95)', 
        backdropFilter: 'blur(10px)',         
        borderBottom: '4px solid white'       
      }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" style={{ letterSpacing: '1px' }}>
          <span className="me-2"></span> RUPP LOST & FOUND
        </Link>

        {/* Inside the div with className="d-flex align-items-center" */}
<div className="d-flex align-items-center">
  <Link className="nav-link text-white fw-semibold me-3 d-none d-sm-block" to="/">Board</Link>
  
  {/* ADD ONLY THIS LINE */}
  <Link className="nav-link text-white me-3 small opacity-75" to="/login">Admin</Link>
  
  <Link to="/report" className="btn btn-warning fw-bold px-3 shadow-sm border border-white border-2 rounded-pill">
    + Report Item
  </Link>
</div>
      </div>
    </nav>
  );
}

export default Navbar;