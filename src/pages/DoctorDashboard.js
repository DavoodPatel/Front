import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DoctorDashboard() {
  const [activeSection, setActiveSection] = useState(null);
  const [cashPayments, setCashPayments] = useState([]);
  const [onlinePayments, setOnlinePayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeSection === 'stats') {
      fetchPayments();
    }
  }, [activeSection]);

  const fetchPayments = async () => {
    try {
      const cashRes = await axios.get('http://localhost:5000/api/payments?method=cash');
      const onlineRes = await axios.get('http://localhost:5000/api/payments?method=online');
      setCashPayments(cashRes.data);
      setOnlinePayments(onlineRes.data);
    } catch (error) {
      console.error('❌ Error fetching payments:', error);
      alert('Failed to fetch payment data');
    }
  };

  const calculateTotal = (payments) => {
    return payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);
  };

  return (
    <div style={styles.container}>
      <div style={styles.dashboardCard}>
        <h1 style={styles.title}>👨‍⚕️ Doctor Dashboard</h1>

        <div style={styles.navButtons}>
          <button
            onClick={() => setActiveSection('stats')}
            style={getButtonStyle('stats', activeSection)}
          >
            📊 View Stats
          </button>
          <button
            onClick={() => setActiveSection('createHrId')}
            style={getButtonStyle('createHrId', activeSection)}
          >
            🆕 Create HR ID
          </button>
          <button onClick={() => navigate('/add-package')} style={styles.button}>
            ➕ Add Package
          </button>
          <button onClick={() => navigate('/view-packages')} style={styles.button}>
            📦 View Packages
          </button>
          <button onClick={() => navigate('/view-patients')} style={styles.button}>
            🧑‍🤝‍🧑 View Patients
          </button>
        </div>

        <div style={styles.cardContent}>
          {!activeSection && <p style={styles.info}>🔍 Please select an option above.</p>}

          {activeSection === 'stats' && (
            <div>
              <h2 style={styles.sectionTitle}>💰 Payment Statistics</h2>

              <div style={styles.paymentCard}>
                <h3 style={{ color: '#28a745' }}>🟢 Cash Payments</h3>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Package</th>
                      <th>Amount</th>
                      <th>Mobile</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashPayments.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.patient_name}</td>
                        <td>{payment.package_name}</td>
                        <td>₹{payment.amount}</td>
                        <td>{payment.mobile_no}</td>
                        <td>{new Date(payment.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={styles.totalAmount}>
                  🔢 Total Cash Amount: ₹ <strong>{calculateTotal(cashPayments)}</strong>
                </p>
              </div>

              <div style={styles.paymentCard}>
                <h3 style={{ color: '#007bff' }}>🔵 Online Payments</h3>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Package</th>
                      <th>Amount</th>
                      <th>Mobile</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {onlinePayments.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.patient_name}</td>
                        <td>{payment.package_name}</td>
                        <td>₹{payment.amount}</td>
                        <td>{payment.mobile_no}</td>
                        <td>{new Date(payment.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={styles.totalAmount}>
                  🔢 Total Online Amount: ₹ <strong>{calculateTotal(onlinePayments)}</strong>
                </p>
              </div>
            </div>
          )}

          {activeSection === 'createHrId' && (
            <div>
              <h2 style={styles.sectionTitle}>🆕 Create HR ID</h2>
              <form style={styles.form}>
                <label style={styles.label}>Name:</label>
                <input type="text" style={styles.input} placeholder="Enter HR Name" required />

                <label style={styles.label}>Email:</label>
                <input type="email" style={styles.input} placeholder="Enter HR Email" required />

                <label style={styles.label}>Password:</label>
                <input type="password" style={styles.input} placeholder="Set HR Password" required />

                <button type="submit" style={styles.submitButton}>Create HR</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const getButtonStyle = (name, active) => ({
  ...styles.button,
  backgroundColor: active === name ? '#007bff' : '#17a2b8',
  transform: active === name ? 'scale(1.05)' : 'scale(1)',
});

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(to right, #e0f7fa, #e3f2fd)',
    minHeight: '100vh',
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  dashboardCard: {
    width: '100%',
    maxWidth: '1100px',
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    fontSize: '2.5rem',
    marginBottom: '30px',
    color: '#007bff',
  },
  navButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  button: {
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  cardContent: {
    backgroundColor: '#fafafa',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    textAlign: 'left',
  },
  info: {
    textAlign: 'center',
    color: '#666',
    fontSize: '16px',
  },
  sectionTitle: {
    fontSize: '22px',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
  },
  paymentCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
    marginBottom: '30px',
  },
  totalAmount: {
    textAlign: 'right',
    fontSize: '18px',
    color: '#333',
    marginTop: '10px',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '15px',
    color: '#333',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
    width: '100%',
    marginBottom: '10px',
  },
  submitButton: {
    padding: '14px',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default DoctorDashboard;
