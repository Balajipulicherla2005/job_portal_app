import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import './Profile.css';

const JobSeekerProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: '',
    experience: '',
    education: '',
    bio: '',
  });
  const [resume, setResume] = useState(null);
  const [currentResume, setCurrentResume] = useState(null);
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
        location: profile.location || '',
        skills: profile.skills || '',
        experience: profile.experience || '',
        education: profile.education || '',
        bio: profile.bio || '',
      });
      setCurrentResume(profile.resume_url);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setResume(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (resume) {
        data.append('resume', resume);
      }

      await api.put('/profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
        <h1 className="profile-title">My Profile</h1>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2 className="section-title">Personal Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
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

            <div className="form-row">
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

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State/Country"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about yourself"
              />
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Professional Details</h2>

            <div className="form-group">
              <label htmlFor="skills">Skills</label>
              <textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                rows="3"
                placeholder="List your skills (e.g., JavaScript, React, Node.js)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience">Work Experience</label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows="5"
                placeholder="Describe your work experience"
              />
            </div>

            <div className="form-group">
              <label htmlFor="education">Education</label>
              <textarea
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                rows="4"
                placeholder="Your educational background"
              />
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Resume</h2>

            {currentResume && (
              <div className="current-resume">
                <p>Current Resume:</p>
                <a
                  href={currentResume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-link"
                >
                  View Resume
                </a>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="resume">Upload New Resume (PDF, DOC, DOCX - Max 5MB)</label>
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="file-input"
              />
              {resume && <p className="file-name">Selected: {resume.name}</p>}
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

export default JobSeekerProfile;
