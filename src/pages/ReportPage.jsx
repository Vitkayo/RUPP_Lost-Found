import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function ReportPage() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  
  // 1. Item name
  const [title, setTitle] = useState('');
  // 2. Status
  const [status, setStatus] = useState('lost');
  // 3. Date and Time
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
  // 4. Location
  const [location, setLocation] = useState('');
  // 5. Contact
  const [contact, setContact] = useState('');
  // 6. Photo
  const [imageFile, setImageFile] = useState(null);
  // NEW: Description
  const [description, setDescription] = useState('');

  // Auto-date logic for "Found" items
  useEffect(() => {
    if (status === 'found') {
      const now = new Date().toISOString().slice(0, 16);
      setDateTime(now);
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = '';
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData } = await supabase.storage.from('item-images').upload(fileName, imageFile);
      if (uploadData) {
        const { data } = supabase.storage.from('item-images').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }
    }

    // SAVING TO SUPABASE (Make sure 'description' column exists in your table!)
    const { error } = await supabase.from('items').insert([{
      title,
      status,
      created_at: dateTime,
      location,
      contact_info: contact,
      description, // <--- This saves the description
      image_url: imageUrl
    }]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Report submitted successfully!");
      navigate('/');
    }
    setUploading(false);
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0 mx-auto" style={{ maxWidth: '600px', borderRadius: '15px' }}>
        <div className="card-body p-4">
          <h2 className="fw-bold mb-4 text-center text-primary">Report Item</h2>
          
          <form onSubmit={handleSubmit}>
            {/* 1. Item Name */}
            <div className="mb-3">
              <label className="form-label fw-bold">Item Name</label>
              <input type="text" className="form-control border-2 border-black" placeholder="e.g. iPhone 13, Blue Backpack" required onChange={(e)=>setTitle(e.target.value)} />
            </div>

            {/* 2. Status */}
            <div className="mb-3">
              <label className="form-label fw-bold">Status</label>
              <select className="form-select border-2 border-black" value={status} onChange={(e)=>setStatus(e.target.value)}>
                <option value="lost">Lost Item</option>
                <option value="found">Found Item</option>
              </select>
            </div>

            {/* 3. Date and Time */}
            <div className="mb-3">
              <label className="form-label fw-bold">Date and Time {status === 'found' ? '(Auto)' : '(Choose when lost)'}</label>
              <input 
                type="datetime-local" 
                className="form-control border-2 border-black" 
                value={dateTime} 
                disabled={status === 'found'} 
                onChange={(e)=>setDateTime(e.target.value)} 
                required
              />
            </div>

            {/* 4. Location */}
            <div className="mb-3">
              <label className="form-label fw-bold">Location</label>
              <input type="text" className="form-control border-2 border-black" placeholder="e.g. RUPP Campus, Building A" required onChange={(e)=>setLocation(e.target.value)} />
            </div>

            {/* 5. Contact */}
            <div className="mb-3">
              <label className="form-label fw-bold">Contact Info</label>
              <input type="text" className="form-control border-2 border-black" placeholder="Telegram username or Phone number" required onChange={(e)=>setContact(e.target.value)} />
            </div>

            {/* EXTRA: Description */}
            <div className="mb-3">
              <label className="form-label fw-bold">Item Description (Details)</label>
              <textarea 
                className="form-control border-2 border-black" 
                rows="3" 
                placeholder="Add more details about the item..."
                onChange={(e)=>setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* 6. Photo */}
            <div className="mb-4">
              <label className="form-label fw-bold">Photo</label>
              <input type="file" className="form-control border-2 border-black" accept="image/*" onChange={(e)=>setImageFile(e.target.files[0])} />
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-bold py-3 shadow" disabled={uploading}>
              {uploading ? 'SUBMITTING...' : 'SUBMIT REPORT'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;