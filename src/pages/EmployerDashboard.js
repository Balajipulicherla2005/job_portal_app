import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import './DashboardPage.css';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, jobsResponse] = await Promise.all([
        api.get('/employer/stats'),
        api.get('/employer/jobs?limit=5'),
      ]);

      setStats(statsResponse.data);
      setRecentJobs(jobsResponse.data.jobs || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success('Job deleted successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Employer Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back, {user?.name}!</p>
          </div>
          <Link to="/employer/profile" className="profile-button">
            Edit Profile
          </Link>
        </div>

        {loading ? (
          <p className="loading-text">Loading dashboard...</p>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💼</div>
                <div className="stat-content">
                  <h3>{stats.totalJobs}</h3>
                  <p>Total Jobs Posted</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>{stats.activeJobs}</h3>
                  <p>Active Jobs</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-content">
                  <h3>{stats.totalApplications}</h3>
                  <p>Total Applications</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3>{stats.pendingApplications}</h3>
                  <p>Pending Review</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h2 className="section-title">Quick Actions</h2>
              <div className="actions-grid">
                <Link to="/employer/jobs/create" className="action-card">
                  <div className="action-icon">➕</div>
                  <h3>Post New Job</h3>
                  <p>Create a new job listing</p>
                </Link>
                <Link to="/employer/dashboard" className="action-card">
                  <div className="action-icon">📋</div>
                  <h3>Manage Jobs</h3>
                  <p>View and edit your jobs</p>
                </Link>
                <Link to="/employer/profile" className="action-card">
                  <div className="action-icon">🏢</div>
                  <h3>Company Profile</h3>
                  <p>Update company information</p>
                </Link>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="recent-section">
              <div className="section-header">
                <h2 className="section-title">Your Recent Job Listings</h2>
                <Link to="/employer/jobs/create" className="view-all-link">
                  Post New Job
                </Link>
              </div>

              {recentJobs.length > 0 ? (
                <div className="jobs-list">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="job-item-dashboard">
                      <div className="job-content">
                        <h3 className="job-title-dashboard">{job.title}</h3>
                        <p className="job-meta-dashboard">
                          {job.location} • {job.job_type}
                        </p>
                        <p className="job-date">
                          Posted: {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="job-actions">
                        <span className="status-badge status-accepted">
                          {job.application_count || 0} Applications
                        </span>
                        <div className="job-actions-group">
                          <Link
                            to={`/employer/jobs/${job.id}/applications`}
                            className="view-job-link"
                          >
                            View Applications
                          </Link>
                          <Link to={`/employer/jobs/${job.id}/edit`} className="edit-job-link">
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="delete-job-button"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You haven't posted any jobs yet.</p>
                  <Link to="/employer/jobs/create" className="create-job-button">
                    Post Your First Job
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
