import React, { useState } from 'react';
import axios from 'axios';

const HRDashboard = () => {
  const hr = JSON.parse(localStorage.getItem('hr'));

  const [mobileNo, setMobileNo] = useState('');
  const [patient, setPatient] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [referredPatients, setReferredPatients] = useState([]);
  const [showCommission, setShowCommission] = useState(false);

  if (!hr) {
    return <p style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>⚠️ Please log in as HR to view the dashboard.</p>;
  }

  const handleViewCommissions = async () => {
    setShowCommission(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/patients/referred-by/${hr.name}`);
      setReferredPatients(res.data);
    } catch (err) {
      console.error(err);
      alert('❌ Error fetching referred patients.');
    }
  };

  const handleSearchPatient = async () => {
    setPatient(null);
    setSearchMessage('');
    try {
      const res = await axios.get(`http://localhost:5000/api/patient/by-mobile/${mobileNo}`);
      if (res.data.success && res.data.patient) {
        setPatient(res.data.patient);
      } else {
        setSearchMessage('❌ Patient not found.');
      }
    } catch (err) {
      console.error(err);
      setSearchMessage('❌ Error fetching patient info.');
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>👋 Welcome, {hr.name}</h1>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#007bff' }}>HR Dashboard</h2>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button
          onClick={handleViewCommissions}
          style={{
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          💰 View Referred Patients
        </button>
      </div>

      {showCommission && (
        <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', marginBottom: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>🧑‍🤝‍🧑 Patients Referred by You</h3>
          {referredPatients.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>#</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Mobile Number</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Address</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Referred Date</th>
                </tr>
              </thead>
              <tbody>
                {referredPatients.map((p, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px' }}>{index + 1}</td>
                    <td style={{ padding: '12px' }}>{p.name}</td>
                    <td style={{ padding: '12px' }}>{p.mobile_no}</td>
                    <td style={{ padding: '12px' }}>{p.address}</td>
                    <td style={{ padding: '12px' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#dc3545' }}>No patients referred yet.</p>
          )}
        </div>
      )}

      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>🔍 Search Patient Info</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="tel"
            placeholder="Enter Mobile Number"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />
          <button
            onClick={handleSearchPatient}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              fontSize: '16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </div>

        {searchMessage && <p style={{ color: 'red', fontWeight: 'bold' }}>{searchMessage}</p>}

        {patient && (
          <div style={{ backgroundColor: '#e9f7ef', padding: '20px', borderRadius: '10px', border: '1px solid #c3e6cb' }}>
            <h4 style={{ marginBottom: '10px', color: '#155724' }}>📋 Patient Details</h4>
            {Object.entries(patient).map(([key, value]) => (
              <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {String(value)}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;
