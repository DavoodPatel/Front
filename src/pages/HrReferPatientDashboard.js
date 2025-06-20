import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HrReferPatientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPackage = location.state?.selectedPackage;
  const isFamily = selectedPackage?.package_type === 'family';

  const [formData, setFormData] = useState({
    name: '',
    mobile_no: '',
    father_name: '',
    mother_name: '',
    address: '',
    no_of_children: 0,
    children_names: [],
    referred_by: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'no_of_children') {
      const count = parseInt(value, 10);
      setFormData((prev) => ({
        ...prev,
        no_of_children: count,
        children_names: Array(count).fill(''),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleChildNameChange = (index, value) => {
    const updatedNames = [...formData.children_names];
    updatedNames[index] = value;
    setFormData((prev) => ({
      ...prev,
      children_names: updatedNames,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      selectedPackage,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/hr/refer-patient-dashboard', payload);

      if (res.status === 200 || res.status === 201) {
        alert('✅ Patient registered successfully!');
        navigate('/packages', {
          state: {
            registered: true,
            selectedPackage,
            mobile_no: formData.mobile_no,
          },
        });
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('❌ Error submitting form:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Error registering patient. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        Patient Registration{selectedPackage ? ` for: ${selectedPackage.name}` : ''}
      </h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />

        <label>Mobile Number</label>
        <input type="text" name="mobile_no" value={formData.mobile_no} onChange={handleInputChange} required />

        <label>Address</label>
        <textarea name="address" value={formData.address} onChange={handleInputChange} required />

        <label>Referred By</label>
        <input type="text" name="referred_by" value={formData.referred_by} onChange={handleInputChange} required />

        {isFamily && (
          <>
            <label>Father's Name</label>
            <input type="text" name="father_name" value={formData.father_name} onChange={handleInputChange} />

            <label>Mother's Name</label>
            <input type="text" name="mother_name" value={formData.mother_name} onChange={handleInputChange} />

            <label>No. of Children</label>
            <input
              type="number"
              name="no_of_children"
              min="0"
              value={formData.no_of_children}
              onChange={handleInputChange}
          
            />

            {formData.children_names.map((name, index) => (
              <div key={index}>
                <label>Child {index + 1} Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleChildNameChange(index, e.target.value)}
                  
                />
              </div>
            ))}
          </>
        )}

        <button type="submit" style={styles.submitBtn}>Submit</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '600px',
    margin: 'auto',
    fontFamily: 'Arial',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#007bff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  submitBtn: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default HrReferPatientDashboard;
