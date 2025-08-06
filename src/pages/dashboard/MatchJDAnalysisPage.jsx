import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    useMediaQuery,
} from '@mui/material';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ResumeTemplateRenderer from '../../components/resumes/ResumeTemplateRenderer';
import '../../assets/css/MatchJDAnalysisPage.css';
import CloseIcon from '@mui/icons-material/Close';


const MatchJDAnalysisPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { layoutConfig } = useSelector((state) => state.resumeBuilder);
    const { resumeData, matchResult } = state || {};
    // console.log("ResumeData:", resumeData);
    // console.log("MatchResult:", matchResult);

    const [showModal, setShowModal] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    if (!resumeData || !matchResult) {
        navigate("/dashboard/match-jd");
        return null;
    }

    const renderSkillRow = (skill, matched, jdCount = 1) => (
        <tr key={skill} className={!matched ? 'table-danger' : ''}>
            <td className="text-capitalize">{skill}</td>
            <td className="text-center">
                {matched ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                ) : (
                    <CancelIcon color="error" fontSize="small" />
                )}
            </td>
            <td className="text-center">{jdCount}</td>
        </tr>
    );

    const skillTable = (type, requiredList, matchedList) => (
        <>
            <h5 className="mt-4">{type === 'hard' ? 'Hard Skills' : 'Soft Skills'}</h5>
            <div className="table-responsive">
                <table className="table table-bordered shadow-sm">
                    <thead>
                        <tr>
                            <th>Skill</th>
                            <th className="text-center">Resume</th>
                            <th className="text-center">JD</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requiredList.map(skill =>
                            renderSkillRow(skill, matchedList.includes(skill), 1)
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );

    const renderScoreBars = () =>
        Object.entries(matchResult.sectionScores || {}).map(([section, score]) => (
            <div key={section} className="mb-2">
                <div className="d-flex justify-content-between">
                    <span className="text-capitalize">{section}</span>
                    <strong>{score}%</strong>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                    <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${score}%` }}
                    ></div>
                </div>
            </div>
        ));

    const dynamicSuggestions = [...(matchResult.suggestions || [])];
    Object.entries(matchResult.atsChecklist || {}).forEach(([key, value]) => {
        if (!value) {
            const readableKey = key.replace('has', 'Add ').replace(/([A-Z])/g, ' $1').trim();
            dynamicSuggestions.push(readableKey);
        }
    });

    return (
        <div className="container mt-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <div>
                    <h3 className="fw-bold">Resume Match Analysis</h3>
                    <p className="text-muted mb-0">Your Resume vs Job Description</p>
                </div>

                <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => setShowModal(true)}
                    color="primary"
                >
                    Preview Resume
                </Button>
            </div>

            <div className="row">
                <div className="col-md-5 mb-4">
                    <div className="bg-white border rounded p-4 shadow-sm">
                        <h4 className="text-success">Match Score: {matchResult.matchScore}%</h4>
                        <div className="mt-3">{renderScoreBars()}</div>
                    </div>
                </div>

                <div className="col-md-7 mb-4">
                    <div className="bg-white border rounded p-4 shadow-sm">
                        {skillTable('hard', matchResult.jdKeywords?.hardSkillsRequired || [], matchResult.jdKeywords?.hardMatched || [])}
                        {skillTable('soft', matchResult.jdKeywords?.softSkillsRequired || [], matchResult.jdKeywords?.softMatched || [])}
                    </div>
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-md-12">
                    <div className="bg-white border rounded p-4 shadow-sm">
                        <h5 className="mb-3">Suggestions</h5>
                        <div className="ps-3">
                            {dynamicSuggestions.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {dynamicSuggestions.map((s, i) => (
                                        <li key={i} className="list-group-item py-2 px-0 border-0">
                                            <span className="text-secondary">•</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted">No suggestions at the moment. Good job!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="md" fullWidth fullScreen={fullScreen}>
                <DialogTitle sx={{ m: 0, p: 2 }} className="d-flex justify-content-between align-items-center">
                    Resume Preview
                    <IconButton
                        aria-label="close"
                        onClick={() => setShowModal(false)}
                        sx={{ color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <ResumeTemplateRenderer
                        resumeData={resumeData}
                        templateName={resumeData.templateName || "DefaultTemplate"}
                        themeColor={resumeData.themeColor || "#0057d9"}
                        layoutConfig={Array.isArray(layoutConfig) ? layoutConfig : []}
                    />
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default MatchJDAnalysisPage;
