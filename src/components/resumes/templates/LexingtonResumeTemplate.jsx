import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setEditingSection,
  toggleSectionVisibility
} from '../../../redux/slices/resumeBuilderSlice';
import './LexingtonResumeTemplate.css';
import { defaultResumeData } from "../../../constants/defaultResumeData";

const LexingtonResumeTemplate = ({ resumeData = defaultResumeData, layoutConfig, themeColor }) => {
  const dispatch = useDispatch();

  const finalResumeData =
    resumeData && Object.keys(resumeData).length > 0 ? resumeData : defaultResumeData;

  const contact =
    finalResumeData.contactInfo ||
    finalResumeData.resumeContactInfoResponse ||
    defaultResumeData.contactInfo;
  const fullName = `${contact.firstName || 'Aiden'} ${contact.lastName || 'Williams'}`;
  const location = [contact.city, contact.state, contact.country].filter(Boolean).join(', ');

  const isVisible = (sectionId) => layoutConfig?.find((s) => s.id === sectionId)?.visible;
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


  const formatDate = (date) =>
    date instanceof Date ? date.toLocaleDateString() : date || '';

  useEffect(() => {
    const unsupported = ['certificates', 'passions'];
    unsupported.forEach((section) => {
      dispatch(toggleSectionVisibility({ id: section, visible: false }));
    });
  }, [dispatch]);

  return (
    <div
      className="lexington-template container-fluid"
      style={{
        '--primary-color': themeColor || '#05204A',
        '--section-heading-color': themeColor || '#0A66FF',
        '--text-color': '#000',
        '--bg-color': '#fff'
      }}
    >
      <div className="row no-gutters a4-page">
        <div className="col-md-8 lexington-main-panel px-4 py-4">
          <div className="lexington-header mb-4">
            <h1 className="lexington-name" onClick={() => dispatch(setEditingSection('contact'))}>{fullName}</h1>
            <h2 className="lexington-role" onClick={() => dispatch(setEditingSection('summary'))}>{resumeData.title || 'Senior Project Manager'}</h2>
            <div className="lexington-contact-info mt-2">
              <span>+{contact.phoneNumber || '+1-234-555-1234'}</span>
              <span> | {contact.email || 'aiden@example.com'}</span>
              <span> | {location || 'Columbus, OH, USA'}</span>
              {(resumeData.personalLinkList || [{ platform: 'LinkedIn', url: 'https://linkedin.com' }]).slice(0, 1).map((link, i) => (
                <span key={i}> | <a href={link.url} target="_blank" rel="noopener noreferrer">{link.platform}</a></span>
              ))}
            </div>
          </div>

          <div className="lexington-section" onClick={() => dispatch(setEditingSection('summary'))}>
            <h3 className="lexington-section-title">Summary</h3>
            <p className="lexington-summary" style={{ textAlign: 'justify' }}>
              {resumeData.summary || 'Experienced project manager with a strong background in agile methodologies and financial systems.'}
            </p>
          </div>

          {isVisible('experience') && (
            <div className="lexington-section" onClick={() => dispatch(setEditingSection('experience'))}>
              <h3 className="lexington-section-title">Experience</h3>
              {(hasData(resumeData.experienceList) ? resumeData.experienceList : [
                {
                  jobTitle: 'Senior Developer',
                  companyName: 'TechCorp',
                  startDate: '2019',
                  endDate: '2023',
                  currentlyWorking: false,
                  city: 'New York',
                  state: 'NY',
                  description: ['Led a team of 5 engineers.', 'Built scalable frontend apps.', 'Managed agile sprints.']
                }
              ]).map((exp, i) => (
                <div key={i} className="lexington-entry mb-3">
                  <div className="d-flex justify-content-between">
                    <strong>{exp.jobTitle} – {exp.companyName}</strong>
                    <span className="text-muted small">
                      {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="text-muted small" style={{ textAlign: 'justify' }}>{exp.city}, {exp.state}</div>
                  <ul className="mt-1" style={{ textAlign: 'justify' }}>
                    {(Array.isArray(exp.description)
                      ? exp.description
                      : typeof exp.description === 'string'
                        ? exp.description.split('\n').filter(line => line.trim() !== '')
                        : []
                    ).slice(0, 3).map((point, j) => (
                      <li key={j}>{point}</li>
                    ))}
                  </ul>

                </div>
              ))}
            </div>
          )}
          {isVisible('education') && (
            <div className="lexington-section" onClick={() => dispatch(setEditingSection('education'))}>
              <h3 className="lexington-section-title">Education</h3>
              {(hasData(resumeData.educationList) ? resumeData.educationList : [
                {
                  degree: 'Bachelors in Computer Science',
                  institute: 'State University',
                  startYear: '2015',
                  endYear: '2019',
                  currentlyStudying: false
                }
              ]).map((edu, i) => (
                <p key={i} style={{ textAlign: 'justify', marginBottom: '10px' }}>
                  {/* Level */}
                  {edu.level && <strong>{formatEducationLevel(edu.level)}</strong>}

                  {/* Degree + Stream */}
                  {(edu.degree || edu.stream) && (
                    <>
                      {" | "}
                      <strong>
                        {edu.degree}
                        {edu.stream && <> in {edu.stream}</>}
                      </strong>
                    </>
                  )}

                  {/* Institute */}
                  {edu.institute && <> | {edu.institute}</>}

                  {/* University */}
                  {edu.university && <> | {edu.university}</>}

                  {/* Date Range */}
                  {(edu.startYear || edu.endYear || edu.currentlyStudying) && (
                    <> | {[edu.startYear, edu.currentlyStudying ? 'Present' : edu.endYear].filter(Boolean).join(' - ')}</>
                  )}

                  {/* Percentage */}
                  {edu.percentage && (
                    <> | {edu.percentage} {parseFloat(edu.percentage) <= 10 ? 'CGPA' : '%'}</>
                  )}
                </p>

              ))}
            </div>
          )}

        </div>

        <div className="col-md-4 lexington-sidebar-panel px-4 py-4 text-white">
          {isVisible('achievements') && (
            <div className="lexington-sidebar-section" onClick={() => dispatch(setEditingSection('achievements'))}>
              <h4 className="lexington-sidebar-title">Key Achievements</h4>
              <ul className="lexington-language-list">
                {(hasData(resumeData.achievementList) ? resumeData.achievementList : [{ title: 'Improved client retention by 20%' }]).map((a, i) => (<li key={i}>{a.title}</li>))}
              </ul>
            </div>
          )}

          {isVisible('skills') && (
            <div className="lexington-sidebar-section" onClick={() => dispatch(setEditingSection('skills'))}>
              <h4 className="lexington-sidebar-title">Skills</h4>
              <ul className="lexington-language-list">
                {(hasData(resumeData.skillList) ? resumeData.skillList : [
                  { skillName: 'Leadership' },
                  { skillName: 'React.js' },
                  { skillName: 'Agile Methodologies' }
                ]).map((skill, i) => (
                  <li key={i}>{skill.skillName}</li>
                ))}
              </ul>
            </div>
          )}



          {isVisible('certifications') && (
            <div className="lexington-sidebar-section" onClick={() => dispatch(setEditingSection('certifications'))}>
              <h4 className="lexington-sidebar-title">Certifications</h4>
              <ul className="lexington-language-list">
                {(hasData(resumeData.certificationList) ? resumeData.certificationList : [{ title: 'PMP Certified' }]).map((c, i) => (<li key={i}>{c.title}</li>))}
              </ul>
            </div>
          )}

          {isVisible('languages') && (
            <div
              className="lexington-sidebar-section"
              onClick={() => dispatch(setEditingSection('languages'))}
            >
              <h4 className="lexington-sidebar-title">Languages</h4>
              <ul className="lexington-language-list">
                {(hasData(resumeData.languageList)
                  ? resumeData.languageList
                  : [
                    { name: 'English', proficiency: 'Fluent' },
                    { name: 'Spanish', proficiency: 'Intermediate' }
                  ]
                ).map((lang, i) => (
                  <li key={i}>
                    {lang.name} – {lang.proficiency?.charAt(0).toUpperCase() + lang.proficiency?.slice(1).toLowerCase()}
                  </li>
                ))}
              </ul>
            </div>
          )}


          {isVisible('personalLinks') && (
            <div className="lexington-sidebar-section" onClick={() => dispatch(setEditingSection('personalLinks'))}>
              <h4 className="lexington-sidebar-title">Personal Links</h4>
              <ul className="lexington-language-list">
                {(hasData(resumeData.personalLinkList) ? resumeData.personalLinkList : [{ platform: 'Portfolio', url: '#' }]).map((l, i) => (<li key={i}>{l.platform}</li>))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LexingtonResumeTemplate;