import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadResumeSummaries } from '../../redux/slices/resumeListSlice';
import ResumeCard from '../../components/resumes/ResumeCard';
import Loader from '../../components/common/Loader';
import '../../assets/css/AllResumesPage.css';
import {
  loadResumeForEdit,
  cloneResumeFromMeta,
} from '../../redux/slices/resumeBuilderSlice';
import { toast } from 'react-toastify';
import { getResumeByVersion } from '../../services/resumeService';
import { useNavigate } from 'react-router-dom';

const AllResumesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { summaries, loading, error } = useSelector((state) => state.resumeList);

  useEffect(() => {
    dispatch(loadResumeSummaries());
  }, [dispatch]);

  const handleEdit = async (versionLabel) => {
    try {
      const fullResume = await getResumeByVersion(versionLabel);
      dispatch(loadResumeForEdit(fullResume));
      navigate("/dashboard/create");
    } catch (err) {
      toast.error("Failed to load resume for editing.");
    }
  };

  const handleClone = async (versionLabel) => {
    try {
      const fullResume = await getResumeByVersion(versionLabel);
      dispatch(cloneResumeFromMeta(fullResume));
      navigate("/dashboard/create");
      toast.success("Cloning resume...");
    } catch (err) {
      toast.error("Failed to clone resume.");
    }
  };

  const handleView = (versionLabel) => {
    navigate(`/dashboard/resume/view-all/${versionLabel}`);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div className="container py-4 all-resumes-page">
      <h2 className="mb-4 fw-bold text-center all-resumes-heading">All Resumes</h2>
      <div className="row all-resumes-grid">
        {summaries.map((summary, idx) => (
          <div key={idx} className="col-lg-4 col-md-6 col-sm-12 mb-3">
            <ResumeCard
              summary={summary}
              onEdit={() => handleEdit(summary.versionLabel)}
              onClone={() => handleClone(summary.versionLabel)}
              onView={() => handleView(summary.versionLabel)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllResumesPage;
