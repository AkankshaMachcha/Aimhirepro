import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal, Spinner } from "react-bootstrap";
import { getResumeByVersion } from "../../services/resumeService";
import { toast } from "react-toastify";
import ResumeTemplateRenderer from "../../components/resumes/ResumeTemplateRenderer";
import { matchResumeWithJD } from "../../services/resumeService";
import "../../assets/css/ResumeMatchPage.css";
import VisibilityIcon from '@mui/icons-material/Visibility';


const ResumeMatchPage = () => {
  const { versionLabel } = useParams();
  const navigate = useNavigate();
  const { layoutConfig } = useSelector((state) => state.resumeBuilder);

  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [jdText, setJdText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await getResumeByVersion(versionLabel);
        setResumeData(data);
      } catch (err) {
        toast.error("Failed to load resume.");
        navigate("/dashboard/match-jd");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [versionLabel, navigate]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setMatchResult(null);
    try {
      const result = await matchResumeWithJD(versionLabel, jdText);
      console.log("Match Result Response:", result);
      navigate("/dashboard/match-jd/analysis", {
        state: {
          resumeData,
          matchResult: result.data
        }
      });
    } catch (err) {
      toast.error("Match analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading resume...</p>;

  return (
    <div className="resume-match container">
      {/* Header */}
      <div className="resume-match__header text-center">
        <h2 className="resume-match__heading">Resume Match Analysis</h2>
        <p className="resume-match__subheading">
          Paste a job description to evaluate how well this resume matches the role.
        </p>
        <Button
          variant="outline-primary"
          startIcon={<VisibilityIcon />}
          className="resume-match__view-btn"
          onClick={() => setShowModal(true)}
        >
          View Resume
        </Button>
      </div>

      {/* JD Input */}
      <div className="resume-match__form mx-auto mt-4">
        <label htmlFor="jdInput" className="resume-match__label">
          Paste Job Description
        </label>
        <textarea
          id="jdInput"
          rows="10"
          className="resume-match__textarea form-control"
          placeholder="Paste the job description here..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />
        <div className="text-center mt-4">
          <Button
            variant="success"
            className="resume-match__analyze-btn"
            disabled={!jdText.trim() || analyzing}
            onClick={handleAnalyze}
          >
            {analyzing ? <Spinner size="sm" animation="border" /> : "Analyze Match"}
          </Button>
        </div>
      </div>

      {/* Result */}
      {matchResult && (
        <div className="mt-5 resume-match__result card p-4">
          <h4 className="text-success mb-3"> Match Score: {matchResult.matchScore}%</h4>

          <div className="mb-3">
            <h5 className="fw-semibold">Section Scores:</h5>
            <ul className="row">
              {Object.entries(matchResult.sectionScores || {}).map(([key, val]) => (
                <li key={key} className="col-md-4 small">
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {val}%
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-3">
            <h5 className="fw-semibold"> ATS Checklist:</h5>
            <ul className="row">
              {Object.entries(matchResult.atsChecklist || {}).map(([key, val]) => (
                <li key={key} className="col-md-4 small">
                  <strong>{key}:</strong> {val ? "✔️" : "❌"}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-3">
            <h5 className="fw-semibold"> Hard Skills:</h5>
            <p><strong>Required:</strong> {matchResult.jdKeywords?.hardSkillsRequired?.join(", ") || "—"}</p>
            <p><strong>Matched:</strong> {matchResult.hardSkills?.matched?.join(", ") || "—"}</p>
            <p><strong>Missing:</strong> {matchResult.hardSkills?.missing?.join(", ") || "—"}</p>
          </div>

          <div className="mb-3">
            <h5 className="fw-semibold"> Soft Skills:</h5>
            <p><strong>Required:</strong> {matchResult.jdKeywords?.softSkillsRequired?.join(", ") || "—"}</p>
            <p><strong>Matched:</strong> {matchResult.softSkills?.matched?.join(", ") || "—"}</p>
            <p><strong>Missing:</strong> {matchResult.softSkills?.missing?.join(", ") || "—"}</p>
          </div>

          <div className="mb-3">
            <h5 className="fw-semibold">Measurable Results Found:</h5>
            <p>{matchResult.measurableResults?.length > 0 ? matchResult.measurableResults.join(", ") : "None found."}</p>
          </div>

          <div className="mb-3">
            <h5 className="fw-semibold"> Gaps:</h5>
            <p>Experience Gap: {matchResult.experienceGap ? "Yes" : " No"}</p>
            <p>Education Gap: {matchResult.educationGap ? " Yes" : " No"}</p>
          </div>

          <div className="mb-2">
            <h5 className="fw-semibold">Suggestions:</h5>
            <ul>
              {matchResult.suggestions.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}


      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Resume Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resumeData ? (
            <div className="p-3 bg-white">
              <ResumeTemplateRenderer
                resumeData={resumeData}
                templateName={resumeData.templateName || "DefaultTemplate"}
                themeColor={resumeData.themeColor || "#0057d9"}
                layoutConfig={Array.isArray(layoutConfig) ? layoutConfig : []}
              />
            </div>
          ) : (
            <p>Loading resume...</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ResumeMatchPage;
