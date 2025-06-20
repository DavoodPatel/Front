import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [mobileNo, setMobileNo] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get('http://localhost:5000/api/packages')
      .then((res) => {
        setPackages(res.data);
      })
      .catch(() => {
        alert('Failed to fetch packages');
      });

    if (location.state?.registered && location.state?.selectedPackage && location.state?.mobile_no) {
      const pkgWithMobile = {
        ...location.state.selectedPackage,
        mobile_no: location.state.mobile_no,
      };
      setSelectedPackage(pkgWithMobile);
      setMobileNo(location.state.mobile_no);
      setShowPaymentOptions(true);
    }
  }, [location.state]);

  const handleSelectPackage = (pkg) => {
    navigate('/hr-refer-patient-dashboard', { state: { selectedPackage: pkg } });
  };

  const savePackageToDatabase = async (payment_mode) => {
    try {
      if (!mobileNo) {
        alert('Mobile number not available. Cannot save package.');
        return;
      }

      const payload = {
        mobile_no: mobileNo,
        packageDetails: selectedPackage,
        payment_mode: payment_mode,
      };

      await axios.post('http://localhost:5000/api/patient/save-package', payload);
      alert(`✅ Package saved to database with ${payment_mode} payment!`);
      setShowPaymentOptions(false);
    } catch (err) {
      console.error('❌ Error saving package:', err);
      alert('Error saving package to database.');
    }
  };

  const handlePaymentChoice = async (method) => {
    if (method === 'cash') {
      alert('✅ Successfully purchased with Cash!');
      await savePackageToDatabase('cash');
    } else if (method === 'online') {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: 'rzp_test_pJmYPmKKs1w1Ct',
          amount: selectedPackage.price * 100,
          currency: 'INR',
          name: 'Medical Insurance Portal',
          description: `Payment for ${selectedPackage.name}`,
          handler: async function () {
            await savePackageToDatabase('online');
            alert('✅ Online payment successful!');
          },
          prefill: {
            contact: mobileNo,
          },
          theme: {
            color: '#007bff',
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    }
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Available Insurance Packages</h1>

      {showPaymentOptions && selectedPackage && (
        <div style={styles.paymentBox}>
          <h3>Make Payment for: {selectedPackage.name}</h3>
          <p>Price: ₹{selectedPackage.price}</p>
          <button onClick={() => handlePaymentChoice('cash')} style={styles.cashBtn}>Pay with Cash</button>
          <button onClick={() => handlePaymentChoice('online')} style={styles.onlineBtn}>Pay Online</button>
        </div>
      )}

      <div style={styles.cardContainer}>
        {packages.map((pkg) => (
          <div key={pkg.id} style={styles.card}>
            <h2>{pkg.name}</h2>
            <p style={styles.description}>{pkg.description}</p>
            <p style={styles.type}>Type: <strong>{pkg.package_type?.toUpperCase()}</strong></p>
            <p style={styles.price}>Price: ₹{parseFloat(pkg.price).toFixed(2)}</p>
            <button style={styles.button} onClick={() => handleSelectPackage(pkg)}>
              Select Package
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '40px 20px',
    backgroundColor: '#f7f9fc',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: 40,
    fontSize: '2rem',
    color: '#007bff',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    maxWidth: 1200,
    margin: '0 auto',
  },
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  description: {
    fontSize: '1rem',
    color: '#555',
    margin: '10px 0',
  },
  type: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#333',
    marginBottom: '10px',
  },
  price: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#28a745',
  },
  button: {
    marginTop: 10,
    padding: '10px 20px',
    fontSize: 16,
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  paymentBox: {
    backgroundColor: '#fff3cd',
    padding: '20px',
    marginBottom: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px solid #ffeeba',
  },
  cashBtn: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    marginRight: 10,
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
  onlineBtn: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
};

export default Packages;
