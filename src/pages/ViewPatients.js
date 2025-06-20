import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewPatients = () => {
  const [patients, setPatients] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients');
      setPatients(res.data);
    } catch (error) {
      setMessage('❌ Failed to fetch patients');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this patient?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/patients/${id}`);
      setMessage('✅ Patient deleted successfully');
      fetchPatients();
    } catch (error) {
      setMessage('❌ Error deleting patient');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🧑‍🤝‍🧑 All Patients</h2>
      {message && <p style={styles.message}>{message}</p>}

      {patients.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777' }}>No patients found.</p>
      ) : (
        <div style={styles.list}>
          {patients.map((patient) => (
            <div key={patient.id} style={styles.card}>
              <div>
                <h3 style={styles.name}>{patient.name}</h3>
                <p style={styles.email}>{patient.email}</p>
              </div>
              <button
                onClick={() => handleDelete(patient.id)}
                style={styles.deleteButton}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    fontSize: '28px',
    color: '#007bff',
    marginBottom: '20px',
  },
  message: {
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: '15px 20px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  name: {
    margin: 0,
    fontSize: '18px',
    color: '#333',
  },
  email: {
    margin: '5px 0 0',
    fontSize: '14px',
    color: '#555',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
};

export default ViewPatients;
