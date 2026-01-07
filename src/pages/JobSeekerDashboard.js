import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './DashboardPage.css';

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, applicationsResponse] = await Promise.all([
        api.get('/applications/stats'),
        api.get('/applications?limit=5'),
      ]);

      setStats(statsResponse.data);
      setRecentApplications(applicationsResponse.data.applications || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'accepted':
      case 'approved':
        return 'status-accepted';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Job Seeker Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back, {user?.name}!</p>
          </div>
          <Link to="/job-seeker/profile" className="profile-button">
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
                  <p>Pending</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>{stats.acceptedApplications}</h3>
                  <p>Accepted</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <h3>{stats.rejectedApplications}</h3>
                  <p>Rejected</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h2 className="section-title">Quick Actions</h2>
              <div className="actions-grid">
                <Link to="/jobs" className="action-card">
                  <div className="action-icon">🔍</div>
                  <h3>Browse Jobs</h3>
                  <p>Find new opportunities</p>
                </Link>
                <Link to="/job-seeker/applications" className="action-card">
                  <div className="action-icon">📋</div>
                  <h3>My Applications</h3>
                  <p>Track your applications</p>
                </Link>
                <Link to="/job-seeker/profile" className="action-card">
                  <div className="action-icon">👤</div>
                  <h3>Update Profile</h3>
                  <p>Manage your profile</p>
                </Link>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="recent-section">
              <div className="section-header">
                <h2 className="section-title">Recent Applications</h2>
                <Link to="/job-seeker/applications" className="view-all-link">
                  View All
                </Link>
              </div>

              {recentApplications.length > 0 ? (
                <div className="applications-list">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="application-item">
                      <div className="application-content">
                        <h3 className="application-title">{application.job_title}</h3>
                        <p className="application-company">{application.company_name}</p>
                        <p className="application-date">
                          Applied on: {new Date(application.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="application-status">
                        <span className={`status-badge ${getStatusClass(application.status)}`}>
                          {application.status || 'Pending'}
                        </span>
                        <Link to={`/jobs/${application.job_id}`} className="view-job-link">
                          View Job
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You haven't applied to any jobs yet.</p>
                  <Link to="/jobs" className="browse-jobs-button">
                    Browse Jobs
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

export default JobSeekerDashboard;
