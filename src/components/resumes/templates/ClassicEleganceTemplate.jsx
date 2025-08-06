import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setEditingSection,
  toggleSectionVisibility,
} from '../../../redux/slices/resumeBuilderSlice';
import './ClassicEleganceTemplate.css';
import { defaultResumeData } from "../../../constants/defaultResumeData";

const ClassicEleganceTemplate = ({ resumeData, layoutConfig, themeColor = '#0057d8' }) => {
  const dispatch = useDispatch();

  const finalResumeData =
    resumeData && Object.keys(resumeData).length > 0 ? resumeData : defaultResumeData;

  const contact =
    finalResumeData.contactInfo ||
    finalResumeData.resumeContactInfoResponse ||
    defaultResumeData.contactInfo;

  useEffect(() => {
    const unused = ['projects', 'personalLinks','achievementList'];
    unused.forEach((id) => dispatch(toggleSectionVisibility({ id, visible: false })));
  }, [dispatch]);


  const isVisible = (id) => layoutConfig?.find((s) => s.id === id)?.visible;
  const hasData = (list) => Array.isArray(list) && list.length > 0;
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d) ? date : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  const formatDateRange = (start, end, ongoing = false) =>
    [formatDate(start), ongoing ? 'Present' : formatDate(end)].filter(Boolean).join(' - ');

  const sentenceCase = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


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
    <div className="classic-template">
      {/* HEADER */}
      <div className="classic-header text-center">
        <h1 className="classic-name" style={{ color: themeColor }} onClick={() => dispatch(setEditingSection('contact'))}>
          {`${contact.firstName || 'YOUR'} ${contact.lastName || 'NAME'}`}
        </h1>
        <p className="classic-title" onClick={() => dispatch(setEditingSection('summary'))}>
          {resumeData.title || 'Your Professional Title'}
        </p>
      </div>

      {/* CONTACT SECTION */}
      <div className="classic-divider" style={{ borderColor: themeColor }} />
      {isVisible('contact') && (
        <div className="classic-contact-section" onClick={() => dispatch(setEditingSection('contact'))}>
          {/* <iv className="classic-section-label" style={{ color: themeColor }}>CONTACT</div>d */}
          <div className="classic-contact-content text-center mx-auto">
            <div className="classic-contact-item">
              <span className="classic-contact-key">Phone</span>
              <span className="classic-contact-value">{contact.phoneNumber || '+91 9876543210'}</span>
            </div>
            <div className="classic-contact-item">
              <span className="classic-contact-key">Email</span>
              <span className="classic-contact-value">{contact.email || 'your@email.com'}</span>
            </div>
            <div className="classic-contact-item">
              <span className="classic-contact-key">Address</span>
              <span className="classic-contact-value">{[contact.city, contact.state, contact.country].filter(Boolean).join(', ') || 'Your Address'}</span>
            </div>
          </div>
        </div>
      )}
      <div className="classic-divider" style={{ borderColor: themeColor }} />

      {/* PROFILE */}
      {isVisible('summary') && (
        <div className="classic-row" onClick={() => dispatch(setEditingSection('summary'))}>
          <div className="classic-section-label" style={{ color: themeColor }}>SUMMARY</div>
          <div className="classic-section-value">
            {resumeData.summary || 'Your professional summary goes here...'}
          </div>
        </div>
      )}

      {/* EXPERIENCE */}
      {isVisible('experience') && hasData(resumeData.experienceList) && (
        <div className="classic-row" onClick={() => dispatch(setEditingSection('experience'))}>
          <div className="classic-section-label" style={{ color: themeColor }}>EMPLOYMENT HISTORY</div>
          <div className="classic-section-value">
            {resumeData.experienceList.map((exp, i) => {
              const startDate = exp.startDate
                ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : '';
              const endDate = exp.currentlyWorking
                ? 'Present'
                : exp.endDate
                  ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : '';
              const durationParts = [];
              if (exp.totalYears && parseInt(exp.totalYears) > 0) durationParts.push(`${exp.totalYears}y`);
              if (exp.totalMonths && parseInt(exp.totalMonths) > 0) durationParts.push(`${exp.totalMonths}m`);
              const duration = durationParts.join(' ');
              const location = [exp.city, exp.state, exp.country].filter(Boolean).join(', ');
              const dateRange = [startDate, endDate].filter(Boolean).join(' - ');

              const descriptionList = Array.isArray(exp.description)
                ? exp.description
                : (typeof exp.description === 'string'
                  ? exp.description.split('\n').filter(d => d.trim() !== '')
                  : []);

              return (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <p>
                    <strong>{exp.jobTitle || 'Job Title'}{exp.jobTitle && exp.companyName ? ' | ' : ''}{exp.companyName || 'Company'}</strong><br />
                    {[location, dateRange, duration].filter(Boolean).join(' | ')}
                  </p>
                  {descriptionList.length > 0 && (
                    <ul>
                      {descriptionList.slice(0, 3).map((point, j) => (
                        <li key={j}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}



      {/* EDUCATION */}
      {isVisible('education') && hasData(resumeData.educationList) && (
        <div className="classic-row" onClick={() => dispatch(setEditingSection('education'))}>
          <div className="classic-section-label" style={{ color: themeColor }}>EDUCATION</div>
          <div className="classic-section-value">
            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
              {resumeData.educationList.map((edu, i) => {
                const level = formatEducationLevel(edu.level);
                const range = [edu.startYear, edu.currentlyStudying ? 'Present' : edu.endYear].filter(Boolean).join(' - ');
                const percentage = edu.percentage ? `${edu.percentage} ${parseFloat(edu.percentage) <= 10 ? 'CGPA' : '%'}` : '';

                const details = [
                  edu.degree,
                  edu.stream,
                  edu.institute,
                  edu.university,
                  range,
                  percentage
                ].filter(Boolean).join(' | ');

                return (
                  <li key={i} style={{ marginBottom: '6px', textAlign: 'justify' }}>
                    <strong>{level}</strong>{details ? ` | ${details}` : ''}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}


      {/* SKILLS */}
      {isVisible('skills') && hasData(resumeData.skillList) && (
        <div className="classic-row" onClick={() => dispatch(setEditingSection('skills'))}>
          <div className="classic-section-label" style={{ color: themeColor }}>SKILLS</div>
          <div className="classic-section-value classic-skill-grid">
            {resumeData.skillList.map((s, i) => (
              <span key={i}>{s.skillName}</span>
            ))}
          </div>
        </div>
      )}

      {/* COURSES (CERTIFICATIONS) */}
      {isVisible('certifications') && hasData(resumeData.certificationList) && (
        <div className="classic-row" onClick={() => dispatch(setEditingSection('certifications'))}>
          <div className="classic-section-label" style={{ color: themeColor }}>COURSES</div>
          <div className="classic-section-value">
            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
              {resumeData.certificationList.map((c, i) => (
                <li key={i} style={{ marginBottom: '6px', textAlign: 'justify' }}>
                  <strong>{c.title}</strong>
                  {[
                    c.issuer,
                    formatDateRange(c.issueDate, c.expiryDate)
                  ]
                    .filter(Boolean)
                    .map((info, j) => ` | ${info}`)
                  }
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}


      {/* LANGUAGES */}
      {isVisible('languages') && hasData(resumeData.languageList) && (
        <div className="classic-row" onClick={() => dispatch(setEditingSection('languages'))}>
          <div className="classic-section-label" style={{ color: themeColor }}>LANGUAGES</div>
          <div className="classic-section-value">
            {resumeData.languageList.map((lang, i) => (
              <span key={i}>{lang.name} – {sentenceCase(lang.proficiency)}</span>
            )).reduce((prev, curr) => [prev, ' | ', curr])}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassicEleganceTemplate;
