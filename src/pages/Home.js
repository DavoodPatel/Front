import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏥 Medical Insurance Portal</h1>
          <p style={styles.subtitle}>Secure your health with our trusted policies</p>
        </div>

        <div style={styles.buttons}>
          <button onClick={() => navigate('/packages')} style={styles.button}>
            View Packages
          </button>
          <button onClick={() => navigate('/doctor-login')} style={styles.button}>
            Doctor Login
          </button>
          <button onClick={() => navigate('/hr-login')} style={styles.button}>
            HR Login
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #e0f7fa, #fff3e0)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
    textAlign: 'center',
  },
  header: {
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#007bff',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#555',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  button: {
    padding: '15px 30px',
    fontSize: '1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    transition: 'transform 0.2s ease, background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  },
};

export default Home;
