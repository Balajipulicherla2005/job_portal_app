import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jobAPI } from '../services/api';
import Loading from '../components/common/Loading';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const response = await jobAPI.getMyJobs();
      setJobs(response.data);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.deleteJob(id);
        toast.success('Job deleted successfully');
        fetchMyJobs();
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Jobs</h1>
        <Link to="/create-job" className="btn btn-primary">Post New Job</Link>
      </div>

      <div className="jobs-grid">
        {jobs.length === 0 ? (
          <div className="no-results">No jobs posted yet</div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="job-card">
              <h3 className="job-title">{job.title}</h3>
              <div className="job-details">
                <span>📍 {job.location}</span>
                <span>💼 {job.jobType}</span>
              </div>
              <div className="flex gap-1 mt-2">
                <Link to={`/job-applications/${job.id}`} className="btn btn-primary btn-sm">
                  View Applications
                </Link>
                <Link to={`/edit-job/${job.id}`} className="btn btn-secondary btn-sm">
                  Edit
                </Link>
                <button onClick={() => handleDelete(job.id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyJobs;
