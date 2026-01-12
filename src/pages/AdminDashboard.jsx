import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/login');
    }
    fetchItems();
  }, [sortOrder]); // Refetch when sort changes

  const fetchItems = async () => {
    const { data } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: sortOrder === 'asc' });
    setItems(data || []);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      const { error } = await supabase.from('items').delete().eq('id', id);
      if (!error) {
        setItems(items.filter(item => item.id !== id));
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  // --- STATS CALCULATION ---
  const lostCount = items.filter(i => i.status === 'lost').length;
  const foundCount = items.filter(i => i.status === 'found').length;

  // --- SEARCH FILTER ---
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-5">
      {/* HEADER SECTION */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-0">Admin Dashboard</h1>
          <p className="text-muted">Manage all RUPP Community reports</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline-danger fw-bold rounded-pill px-4">
          Logout
        </button>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-dark text-white p-3 text-center" style={{ borderRadius: '15px' }}>
            <h6 className="opacity-75">Total Reports</h6>
            <h2 className="fw-bold m-0">{items.length}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-danger text-white p-3 text-center" style={{ borderRadius: '15px' }}>
            <h6 className="opacity-75">Lost Items</h6>
            <h2 className="fw-bold m-0">{lostCount}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-success text-white p-3 text-center" style={{ borderRadius: '15px' }}>
            <h6 className="opacity-75">Found Items</h6>
            <h2 className="fw-bold m-0">{foundCount}</h2>
          </div>
        </div>
      </div>

      {/* --- TABLE TOOLS (Search & Sort) --- */}
      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <input 
            type="text" 
            className="form-control border-2 shadow-sm" 
            placeholder="Search reports by title or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select 
            className="form-select border-2 shadow-sm fw-bold" 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* --- TABLE DATA --- */}
      <div className="table-responsive bg-white shadow rounded-4 p-3">
        <table className="table table-hover align-middle">
          <thead>
            <tr className="text-muted small text-uppercase">
              <th>Item Details</th>
              <th>Status</th>
              <th>Reported Date</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>
                  <div className="fw-bold">{item.title}</div>
                  <div className="small text-muted">📍 {item.location}</div>
                </td>
                <td>
                  <span className={`badge px-3 py-2 rounded-pill ${item.status === 'lost' ? 'bg-danger' : 'bg-success'}`}>
                    {item.status.toUpperCase()}
                  </span>
                </td>
                <td className="small text-muted">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="text-end">
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="btn btn-sm btn-danger px-3 rounded-pill fw-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-5 text-muted">
                  No reports found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;