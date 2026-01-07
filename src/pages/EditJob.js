import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import './CreateJob.css';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    qualifications: '',
    responsibilities: '',
    location: '',
    job_type: 'Full-time',
    salary_range: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      const job = response.data;
      setFormData({
        title: job.title || '',
        description: job.description || '',
        qualifications: job.qualifications || '',
        responsibilities: job.responsibilities || '',
        location: job.location || '',
        job_type: job.job_type || 'Full-time',
        salary_range: job.salary_range || '',
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job');
      navigate('/employer/dashboard');
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
    setSubmitting(true);

    try {
      await api.put(`/jobs/${id}`, formData);
      toast.success('Job updated successfully!');
      navigate('/employer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update job');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading job...</div>;
  }

  return (
    <div className="create-job-page">
      <div className="create-job-container">
        <h1 className="page-title">Edit Job</h1>

        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-section">
            <h2 className="section-title">Job Details</h2>

            <div className="form-group">
              <label htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="City, State/Country or Remote"
                />
              </div>

              <div className="form-group">
                <label htmlFor="job_type">Job Type *</label>
                <select
                  id="job_type"
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="salary_range">Salary Range</label>
              <input
                type="text"
                id="salary_range"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                placeholder="e.g., $80,000 - $120,000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Provide a detailed description of the job"
              />
            </div>

            <div className="form-group">
              <label htmlFor="qualifications">Qualifications</label>
              <textarea
                id="qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                rows="5"
                placeholder="List the required qualifications and skills"
              />
            </div>

            <div className="form-group">
              <label htmlFor="responsibilities">Responsibilities</label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the key responsibilities"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/employer/dashboard')}
              className="cancel-button"
            >
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
