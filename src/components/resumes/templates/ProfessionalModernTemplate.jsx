import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setEditingSection,
  updateAchievementList,
  updateLanguageList,
  toggleSectionVisibility,
} from '../../../redux/slices/resumeBuilderSlice';
import './ProfessionalModernTemplate.css';
import { defaultResumeData } from "../../../constants/defaultResumeData";


// ... imports
const ProfessionalModernTemplate = ({ resumeData = defaultResumeData, layoutConfig, themeColor }) => {
  const dispatch = useDispatch();
  const finalResumeData =
    resumeData && Object.keys(resumeData).length > 0 ? resumeData : defaultResumeData;

  const contact =
    finalResumeData.contactInfo ||
    finalResumeData.resumeContactInfoResponse ||
    defaultResumeData.contactInfo;
  const isVisible = (sectionId) => layoutConfig?.find((s) => s.id === sectionId)?.visible;
  const fullName = `${contact.firstName || 'YOUR'} ${contact.lastName || 'NAME'}`.trim();

  const formatDate = (date) => {
    if (!date) return '';
    return date instanceof Date ? date.toLocaleDateString() : date;
  };

  const hasData = (list) => Array.isArray(list) && list.length > 0;

  const formatEducationLevel = (level) => {
    if (!level) return '';
    const normalized = level.toUpperCase().replace(/\s/g, '');
    const map = {
      TENTH: 'X',
      TWELFTH: 'XII',
      DIPLOMA: 'Diploma',
      BACHELORS: "Bachelor's",
      MASTERS: "Master's",
      MBA: 'MBA',
      PHD: 'Ph.D.',
      POST_DOCTORATE: 'Post-Doc',
    };
    return map[normalized] || level;
  };

  return (
    <div
      className="professional-modern-template container"
      style={{
        '--primary-color': themeColor || '#0A66FF',
        '--section-heading-color': themeColor || '#0A66FF',
        '--text-color': '#000',
      }}
    >
      <div className="professional-modern-template-header text-center mb-3">
        <h1 className="professional-modern-template-name" onClick={() => dispatch(setEditingSection('contact'))}>
          {fullName}
        </h1>
        <h2 className="professional-modern-template-role" onClick={() => dispatch(setEditingSection('summary'))}>
          {resumeData.title || 'Your Role / Title'}
        </h2>
      </div>

      <div className="row professional-modern-template-main">
        {/* SIDEBAR */}
        <div className="col-md-4 professional-modern-template-sidebar">
          {isVisible('contact') && (
            <div className="professional-modern-template-section">
              <h3 className="section-title text-white">CONTACT</h3>
              <p>{contact.email || 'email@example.com'}</p>
              <p>{contact.phoneNumber || '+91 9876543210'}</p>
              <p>{[contact.city, contact.state, contact.country].filter(Boolean).join(', ') || 'Your Location'}</p>
            </div>
          )}

          {isVisible('education') && (
            <div className="professional-modern-template-section" onClick={() => dispatch(setEditingSection('education'))}>
              <h3 className="section-title text-white">EDUCATION</h3>
              {(hasData(resumeData.educationList) ? resumeData.educationList : []).map((edu, i) => (
                <p key={i}>
                  <strong>{formatEducationLevel(edu.level)}</strong>
                  {edu.degree && <> | <strong>{edu.degree}</strong></>}
                  {edu.stream && <> in <strong>{edu.stream}</strong></>}
                  {edu.institute && <> | {edu.institute}</>}
                  {edu.university && <> | {edu.university}</>}
                  {(edu.startYear || edu.endYear || edu.currentlyStudying) && (
                    <> | {[edu.startYear, edu.currentlyStudying ? 'Present' : edu.endYear].filter(Boolean).join(' - ')}</>
                  )}
                  {edu.percentage && <> | {edu.percentage} {parseFloat(edu.percentage) <= 10 ? 'CGPA' : '%'}</>}
                </p>
              ))}
            </div>
          )}

          {isVisible('skills') && (
            <div className="professional-modern-template-section" onClick={() => dispatch(setEditingSection('skills'))}>
              <h3 className="section-title text-white">SKILLS</h3>
              <div className="d-flex flex-wrap">
                {(resumeData.skillList || []).map((skill, i) => (
                  <span key={i} className="badge bg-light text-dark me-1 mb-1" style={{ fontSize: '12px' }}>
                    {skill.skillName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {isVisible('certifications') && (
            <div className="professional-modern-template-section" onClick={() => dispatch(setEditingSection('certifications'))}>
              <h3 className="section-title text-white">CERTIFICATIONS</h3>
              {(resumeData.certificationList || []).map((cert, i) => (
                <p key={i}>
                  <strong>{cert.title}</strong><br />
                  {cert.issuer && `${cert.issuer}`}<br />
                  {cert.issueDate && formatDate(cert.issueDate)} - {cert.expiryDate ? formatDate(cert.expiryDate) : 'No Expiry'}<br />
                  {cert.proficiencyLevel && `Level: ${cert.proficiencyLevel}`}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* MAIN CONTENT */}
        <div className="col-md-8 professional-modern-template-content">
          <div className="professional-modern-template-section" onClick={() => dispatch(setEditingSection('summary'))}>
            <h3 className="section-title">CAREER OBJECTIVE</h3>
            <p>{resumeData.summary || 'Professional and ethical candidate passionate about learning.'}</p>
          </div>

          {isVisible('experience') && (
            <div
              className="professional-modern-template-section"
              onClick={() => dispatch(setEditingSection('experience'))}
            >
              <h3 className="section-title">WORK EXPERIENCE</h3>
              {(resumeData.experienceList || []).map((exp, i) => {
                const descriptionList = (() => {
                  if (Array.isArray(exp.description)) return exp.description;
                  if (typeof exp.description === 'string') {
                    return exp.description.split('\n').filter((d) => d.trim() !== '');
                  }
                  return [];
                })();

                return (
                  <div className="job mb-3" key={i}>
                    <h4>{exp.jobTitle} | {exp.companyName}</h4>
                    <p className="date-location">
                      {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)} /{' '}
                      {[exp.city, exp.country].filter(Boolean).join(', ')}
                    </p>
                    {Array.isArray(descriptionList) && descriptionList.length > 0 && (
                      <ul>
                        {descriptionList.slice(0, 3).map((d, j) => (
                          <li key={j} style={{ textAlign: 'justify' }}>{d}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {isVisible('projects') && (
            <div className="professional-modern-template-section" onClick={() => dispatch(setEditingSection('projects'))}>
              <h3 className="section-title">PROJECTS</h3>
              {(resumeData.projectList || []).map((proj, i) => (
                <div className="project mb-3" key={i}>
                  <h4>
                    {proj.title} | {proj.techStack}
                    {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer"> | GitHub</a>}
                    {proj.liveLink && <a href={proj.liveLink} target="_blank" rel="noreferrer"> | Live</a>}
                  </h4>
                  <p>{proj.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalModernTemplate;

