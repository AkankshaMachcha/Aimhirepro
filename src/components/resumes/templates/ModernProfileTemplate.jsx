import React from 'react';
import { useDispatch } from 'react-redux';
import {
  setEditingSection,
} from '../../../redux/slices/resumeBuilderSlice';
import { defaultResumeData } from "../../../constants/defaultResumeData";
import './ModernProfileTemplate.css';
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaGraduationCap,
  FaBriefcase,
  FaTools,
} from 'react-icons/fa';

const ModernProfileTemplate = ({ resumeData = defaultResumeData, layoutConfig, themeColor = '#004e64' }) => {
  const dispatch = useDispatch();

  const isVisible = (sectionId) => layoutConfig?.find((s) => s.id === sectionId)?.visible;
  const hasData = (list) => Array.isArray(list) && list.length > 0;

  const finalResumeData =
    resumeData && Object.keys(resumeData).length > 0 ? resumeData : defaultResumeData;

  const contact =
    finalResumeData.contactInfo ||
    finalResumeData.resumeContactInfoResponse ||
    defaultResumeData.contactInfo;
  const fullName = `${contact.firstName || 'Lakshmi'} ${contact.lastName || 'Khanna'}`;
  const iconStyle = { color: themeColor };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d) ? date : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

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
    <div className="modern-template">
      {/* Header */}
      <div className="modern-header" style={{ backgroundColor: themeColor }}>
        <div className="modern-header-left">
          <div className="modern-name" onClick={() => dispatch(setEditingSection('contact'))}>{fullName}</div>
          <div className="modern-icons">
            <FaMapMarkerAlt style={{ color: 'white' }} />
            <span>
              {[
                contact.city || 'Noida',
                contact.state || 'Uttar Pradesh',
                contact.country || 'India'
              ].filter(Boolean).join(', ')}
            </span>
            <FaEnvelope style={{ color: 'white' }} /><span>{contact.email || 'lakshmi.khanna@example.com'}</span>
            <FaPhoneAlt style={{ color: 'white' }} /><span>{contact.phoneNumber || '9876543210'}</span>
          </div>
        </div>
      </div>

      {/* Education */}
      {isVisible('education') && (
        <div className="modern-section" onClick={() => dispatch(setEditingSection('education'))}>
          <div className="modern-section-left" style={{ color: themeColor }}>
            <FaGraduationCap style={iconStyle} /> EDUCATION
          </div>
          <div className="modern-section-right">
            <ul>
              {(hasData(resumeData.educationList) ? resumeData.educationList : []).map((edu, i) => (
                <li key={i} style={{ textAlign: 'justify', marginBottom: '5px' }}>
                  <strong>{formatEducationLevel(edu.level)}</strong>
                  {edu.degree || edu.stream ? ' | ' : ''}
                  {edu.degree && (
                    <strong>
                      {edu.degree}
                      {edu.stream && <> in {edu.stream}</>}
                    </strong>
                  )}
                  {edu.institute && <> | {edu.institute}</>}
                  {edu.university && <> | {edu.university}</>}
                  {(
                    edu.startYear ||
                    edu.endYear ||
                    edu.currentlyStudying
                  ) && (
                      <> | {[edu.startYear, edu.currentlyStudying ? 'Present' : edu.endYear].filter(Boolean).join(' - ')}</>
                    )}
                  {edu.percentage && (
                    <> | {edu.percentage} {parseFloat(edu.percentage) <= 10 ? 'CGPA' : '%'}</>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <hr className="modern-hr" />

      {/* Experience */}
      {isVisible('experience') && (
        <div className="modern-section" onClick={() => dispatch(setEditingSection('experience'))}>
          <div className="modern-section-left" style={{ color: themeColor }}>
            <FaBriefcase style={iconStyle} /> EXPERIENCE
          </div>
          <div className="modern-section-right">
            {(hasData(resumeData.experienceList) ? resumeData.experienceList : []).map((exp, index) => {
              const descriptionList = Array.isArray(exp.description)
                ? exp.description
                : typeof exp.description === 'string'
                  ? exp.description.split('\n').filter(d => d.trim() !== '')
                  : [];

              return (
                <div key={index} className="modern-detail-row">
                  <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                    <strong>{exp.jobTitle}</strong> | <strong>{exp.companyName}</strong> | {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                  </p>
                  {descriptionList.length > 0 && (
                    <ul style={{ marginTop: '5px', paddingLeft: '18px' }}>
                      {descriptionList.slice(0, 4).map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <hr className="modern-hr" />

      {/* Skills and Achievements */}
      <div className="modern-section">
        <div className="modern-section-left" style={{ color: themeColor }}>
          <FaTools style={iconStyle} /> SKILLS AND ACHIEVEMENTS
        </div>
        <div className="modern-section-right">
          <div className="modern-subsection" onClick={() => dispatch(setEditingSection('skills'))}>
            <strong>Skills:</strong><br />
            <div className="modern-skill-grid">
              {hasData(resumeData.skillList) &&
                resumeData.skillList.map((skill, i) => (
                  <span key={i}>• {skill.skillName}</span>
                ))}
            </div>
          </div>
          <div className="modern-subsection" onClick={() => dispatch(setEditingSection('achievements'))}>
            <strong>Achievements:</strong><br />
            <ul>
              {hasData(resumeData.achievementList) &&
                resumeData.achievementList.map((ach, i) => (
                  <li key={i}>
                    <strong>{ach.title}</strong>{ach.description && ` — ${ach.description}`}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <hr className="modern-hr" />

      {/* Languages */}
      <div className="modern-section">
        <div className="modern-section-left" style={{ color: themeColor }}>
          <FaTools style={iconStyle} /> LANGUAGES
        </div>
        <div className="modern-section-right" onClick={() => dispatch(setEditingSection('languages'))}>
          <ul>
            {hasData(resumeData.languageList) &&
              resumeData.languageList.map((lang, i) => (
                <li key={i}>
                  {lang.name} – {lang.proficiency?.charAt(0).toUpperCase() + lang.proficiency?.slice(1).toLowerCase() || 'Fluent'}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModernProfileTemplate;
