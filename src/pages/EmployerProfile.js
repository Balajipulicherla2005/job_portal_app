import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import './Profile.css';

const EmployerProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    company_description: '',
    company_website: '',
    company_location: '',
    company_size: '',
    industry: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      const profile = response.data;
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        company_name: profile.company_name || '',
        company_description: profile.company_description || '',
        company_website: profile.company_website || '',
        company_location: profile.company_location || '',
        company_size: profile.company_size || '',
        industry: profile.industry || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/profile', formData);
      toast.success('Profile updated successfully!');
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">Company Profile</h1>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2 className="section-title">Contact Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Contact Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Company Details</h2>

            <div className="form-group">
              <label htmlFor="company_name">Company Name *</label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company_description">Company Description</label>
              <textarea
                id="company_description"
                name="company_description"
                value={formData.company_description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe your company"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="company_website">Website</label>
                <input
                  type="url"
                  id="company_website"
                  name="company_website"
                  value={formData.company_website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="company_location">Company Location</label>
                <input
                  type="text"
                  id="company_location"
                  name="company_location"
                  value={formData.company_location}
                  onChange={handleChange}
                  placeholder="City, State/Country"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="company_size">Company Size</label>
                <select
                  id="company_size"
                  name="company_size"
                  value={formData.company_size}
                  onChange={handleChange}
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="industry">Industry</label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="e.g., Technology, Healthcare"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="save-button" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployerProfile;
