import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Jobs.css';

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    job_type: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (searchFilters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchFilters.keyword) params.append('keyword', searchFilters.keyword);
      if (searchFilters.location) params.append('location', searchFilters.location);
      if (searchFilters.job_type) params.append('job_type', searchFilters.job_type);

      const response = await api.get(`/jobs?${params.toString()}`);
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(filters);
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      location: '',
      job_type: '',
    });
    fetchJobs({});
  };

  return (
    <div className="jobs-page">
      <div className="jobs-container">
        <h1 className="page-title">Find Your Perfect Job</h1>

        {/* Search Filters */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-row">
              <input
                type="text"
                name="keyword"
                placeholder="Job title, keywords..."
                value={filters.keyword}
                onChange={handleFilterChange}
                className="search-input"
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={filters.location}
                onChange={handleFilterChange}
                className="search-input"
              />
              <select
                name="job_type"
                value={filters.job_type}
                onChange={handleFilterChange}
                className="search-select"
              >
                <option value="">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div className="search-buttons">
              <button type="submit" className="search-button">
                Search Jobs
              </button>
              <button type="button" onClick={handleReset} className="reset-button">
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Jobs List */}
        <div className="jobs-list-section">
          {loading ? (
            <p className="loading-text">Loading jobs...</p>
          ) : jobs.length > 0 ? (
            <>
              <p className="results-count">{jobs.length} jobs found</p>
              <div className="jobs-list">
                {jobs.map((job) => (
                  <div key={job.id} className="job-item">
                    <div className="job-header">
                      <h2 className="job-item-title">{job.title}</h2>
                      <span className="job-type-badge">{job.job_type}</span>
                    </div>
                    <p className="job-company">{job.company_name}</p>
                    <div className="job-details">
                      <span className="job-detail">📍 {job.location}</span>
                      {job.salary_range && (
                        <span className="job-detail">💰 {job.salary_range}</span>
                      )}
                    </div>
                    <p className="job-description">
                      {job.description?.substring(0, 150)}
                      {job.description?.length > 150 ? '...' : ''}
                    </p>
                    <div className="job-footer">
                      <span className="job-date">
                        Posted: {new Date(job.created_at).toLocaleDateString()}
                      </span>
                      <Link to={`/jobs/${job.id}`} className="view-job-button">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-jobs">
              <p>No jobs found matching your criteria.</p>
              <p>Try adjusting your search filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListPage;
