import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function HomePage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedDate, setSelectedDate] = useState('');

  // --- 1. TIME HELPER FUNCTION ---
  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return postDate.toLocaleDateString(); 
  };

  useEffect(() => {
    const fetchItems = async () => {
      let query = supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: sortOrder === 'asc' });

      if (filter !== 'all') query = query.eq('status', filter);

      if (selectedDate) {
        const startOfDay = `${selectedDate}T00:00:00`;
        const endOfDay = `${selectedDate}T23:59:59`;
        query = query.gte('created_at', startOfDay).lte('created_at', endOfDay);
      }
      
      const { data } = await query;
      setItems(data || []);
    };
    fetchItems();
  }, [filter, sortOrder, selectedDate]);

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-vh-100 bg-light pb-5">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-primary text-white border-bottom border-white border-4 shadow-sm mb-4">
        <div className="container py-5 text-center">
          <h1 className="display-4 fw-bold">RUPP Community Board</h1>
          <p className="lead opacity-75">Find your belongings within the RUPP community.</p>
        </div>
      </div>

      <div className="container">
        {/* --- SEARCH & FILTERS ROW --- */}
        <div className="row g-3 mb-4 align-items-center">
          <div className="col-lg-7">
            <div className="input-group input-group-lg shadow-sm border border-2 border-black rounded">
              <span className="input-group-text bg-white border-0">🔍</span>
              <input 
                type="text" 
                className="form-control border-0" 
                placeholder="Search name or location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-lg-5">
            <div className="d-flex gap-2">
              <div className="d-flex align-items-center bg-white p-2 rounded border border-2 border-black shadow-sm flex-grow-1">
                <span className="me-2 fw-bold small">Day:</span>
                <input 
                  type="date" 
                  className="form-control form-control-sm border-0 fw-bold"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="d-flex align-items-center bg-white p-2 rounded border border-2 border-black shadow-sm">
                <span className="me-2 fw-bold small">Sort:</span>
                <select 
                  className="form-select form-select-sm border-0 fw-bold" 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="desc">Newest</option>
                  <option value="asc">Oldest</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* --- CATEGORY BUTTONS --- */}
        <div className="d-flex flex-wrap gap-3 justify-content-center mb-5">
          {['all', 'lost', 'found'].map((type) => (
            <button 
              key={type}
              onClick={() => setFilter(type)} 
              className={`btn btn-lg px-5 py-3 fw-bold shadow-sm transition-all ${
                filter === type 
                  ? (type === 'lost' ? 'btn-danger' : type === 'found' ? 'btn-success' : 'btn-dark') 
                  : (type === 'lost' ? 'btn-outline-danger' : type === 'found' ? 'btn-outline-success' : 'btn-outline-dark')
              }`}
              style={{ 
                borderRadius: '15px', 
                minWidth: '180px', 
                borderWidth: '3px' // Makes the border thick like your "Lost" button
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* --- GRID ITEMS --- */}
        <div className="row">
          {filteredItems.map(item => (
            <div key={item.id} className="col-md-6 col-lg-4 mb-4">
              <div 
                className="card h-100 border-0 shadow-sm overflow-hidden" 
                style={{ borderRadius: '20px', cursor: 'pointer', transition: '0.3s' }}
                onClick={() => setSelectedItem(item)}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img src={item.image_url || 'https://via.placeholder.com/300'} style={{ height: '240px', objectFit: 'cover' }} alt={item.title} />
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className={`badge px-3 py-2 rounded-pill ${item.status === 'lost' ? 'bg-danger' : 'bg-success'}`}>
                      {item.status.toUpperCase()}
                    </span>
                    {/* RELATIVE TIME ADDED HERE */}
                    <small className="text-muted fw-bold">{formatRelativeTime(item.created_at)}</small>
                  </div>
                  <h4 className="fw-bold mb-2">{item.title}</h4>
                  <p className="text-muted mb-0">📍 {item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- DETAIL POPUP (MODAL) --- */}
      {selectedItem && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 3000 }}
          onClick={() => setSelectedItem(null)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '25px', overflow: 'hidden' }}>
              <div className="modal-header border-0 position-absolute end-0 top-0" style={{ zIndex: 10 }}>
                <button type="button" className="btn-close bg-white rounded-circle p-2 m-2" onClick={() => setSelectedItem(null)}></button>
              </div>
              
              <div className="modal-body p-0">
                {selectedItem.image_url && (
                  <img src={selectedItem.image_url} className="w-100" style={{ height: '300px', objectFit: 'cover' }} alt={selectedItem.title} />
                )}
                
                <div className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h2 className="fw-bold m-0">{selectedItem.title}</h2>
                    <span className={`badge px-3 py-2 rounded-pill ${selectedItem.status === 'lost' ? 'bg-danger' : 'bg-success'}`}>
                      {selectedItem.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* RELATIVE TIME ADDED TO MODAL */}
                  <p className="text-muted mb-4 d-flex align-items-center">
                    <span className="me-2">📅</span> 
                    {new Date(selectedItem.created_at).toLocaleDateString()}
                    <span className="mx-2 text-secondary">•</span>
                    <span className="text-primary fw-bold">{formatRelativeTime(selectedItem.created_at)}</span>
                  </p>
                  
                  <hr />
                  
                  <div className="mb-4">
                    <label className="fw-bold text-primary small text-uppercase mb-1 d-block">Location</label>
                    <p className="fs-5">📍 {selectedItem.location}</p>
                  </div>

                  <div className="mb-4">
                    <label className="fw-bold text-primary small text-uppercase mb-1 d-block">Description</label>
                    <p className="bg-light p-3 rounded-3">{selectedItem.description || 'No description provided.'}</p>
                  </div>
                  
                  <div className="bg-primary text-white p-3 rounded-4 shadow-sm">
                    <label className="fw-bold small text-uppercase mb-1 d-block opacity-75">Contact</label>
                    <p className="m-0 fs-4 fw-bold">{selectedItem.contact_info}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;