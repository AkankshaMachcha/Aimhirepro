import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadResumeSummaries } from '../../redux/slices/resumeListSlice';
import MatchResumeCard from '../../components/resumes/MatchResumeCard';
import Loader from '../../components/common/Loader';
import '../../assets/css/MatchJDPage.css';
import {
  loadResumeForEdit,
  cloneResumeFromMeta,
} from '../../redux/slices/resumeBuilderSlice';
import { toast } from 'react-toastify';
import { getResumeByVersion } from '../../services/resumeService';
import { useNavigate } from 'react-router-dom';

const MatchJDPage = () => {
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
    navigate(`/dashboard/match-jd/${versionLabel}`);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div className="match-jd-page">
  <div className="container">
    <h2 className="text-center match-jd-heading">Match a Resume with Job Description</h2>
    <p className="match-jd-subtext">
      Select a resume you'd like to match with a job description. This helps you identify skill gaps and increase your chances of getting hired.
    </p>

    <div className="row match-jd-grid">
      {summaries.map((summary, idx) => (
        <div key={idx} className="col-lg-4 col-md-6 col-sm-12 mb-4">
          <div className="resume-card p-3 rounded" onClick={() => handleView(summary.versionLabel)}>
            <MatchResumeCard
              summary={summary}
              onEdit={() => handleEdit(summary.versionLabel)}
              onClone={() => handleClone(summary.versionLabel)}
              onView={() => handleView(summary.versionLabel)}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
  );

};

export default MatchJDPage;
