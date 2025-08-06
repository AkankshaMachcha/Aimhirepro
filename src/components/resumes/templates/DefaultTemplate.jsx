import React from 'react';
import './DefaultTemplate.css';
import { useDispatch } from 'react-redux';
import { setEditingSection } from '../../../redux/slices/resumeBuilderSlice';
import { defaultResumeData } from "../../../constants/defaultResumeData";

const DefaultTemplate = ({ resumeData, layoutConfig, themeColor }) => {
  const dispatch = useDispatch();

  const finalResumeData =
    resumeData && Object.keys(resumeData).length > 0 ? resumeData : defaultResumeData;

  const contact =
    finalResumeData.contactInfo ||
    finalResumeData.resumeContactInfoResponse ||
    defaultResumeData.contactInfo;

  let fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
  if (!fullName) fullName = 'Your Name';
  fullName = fullName.toUpperCase();

  const orderedSections = layoutConfig?.filter(s => s.visible).map(s => s.id) || [];

  return (
    <div
      className="default-modern-resume"
      style={{
        '--primary': themeColor || '#112467',
        '--accent': themeColor || '#0A66FF',
        '--link-color': themeColor || '#0A66FF',
      }}
    >

      <div className="default-modern-resume-inner">
        <div className="default-resume-header text-center" onClick={() => dispatch(setEditingSection('contact'))}>
          <h1 className="default-name bold-large">{fullName}</h1>
          <p className="default-contact-line">
            {contact.phoneNumber && <span>+91 {contact.phoneNumber}</span>}
            {contact.email && contact.phoneNumber && <span> | </span>}
            {contact.email && <span>{contact.email}</span>}
            {finalResumeData.personalLinkList?.length > 0 &&
              finalResumeData.personalLinkList.map((link, i) => (
                <span key={i}>
                  {' | '}
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.platform || new URL(link.url).hostname}
                  </a>
                </span>
              ))}
            {(contact.phoneNumber || contact.email || finalResumeData.personalLinkList?.length > 0) &&
              (contact.city || contact.state || contact.country) && <span> | </span>}
            {(contact.city || contact.state || contact.country) && (
              <span>{[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</span>
            )}
          </p>
        </div>

        {orderedSections.map((section, index) => (
          <div key={index} className="section" onClick={() => dispatch(setEditingSection(section))}>
            {renderSection(section, finalResumeData)}
          </div>
        ))}

      </div>

    </div>
  );
};

const renderSection = (section, data) => {
  switch (section) {
    case 'contact':
      return null;

    case 'summary':
      const summary = data.summary || defaultResumeData.summary;
      return summary && (
        <>
          <h2 className="default-section-title">Summary</h2>
          <p className="default-summary-text">{summary}</p>
        </>
      );

    case 'experience':
      const experienceList = data.experienceList?.length > 0
        ? data.experienceList
        : defaultResumeData.experienceList;

      return experienceList?.length > 0 && (
        <>
          <h2 className="default-section-title">Professional Experience</h2>
          {experienceList.map((exp, i) => {
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
            const locationParts = [exp.city, exp.state, exp.country].filter(Boolean).join(', ');
            const dateRange = [startDate, endDate].filter(Boolean).join(' - ');

            return (
              <div key={i} className="default-entry">
                <div className="default-entry-top">
                  <span className="default-entry-left">
                    {[
                      <strong key="jobCompany">{`${exp.jobTitle || ''}${exp.jobTitle && exp.companyName ? ' | ' : ''}${exp.companyName || ''}`}</strong>,
                      locationParts,
                      dateRange,
                      duration
                    ]
                      .filter(Boolean)
                      .map((item, idx) => <React.Fragment key={idx}>{idx > 0 && ' | '}{item}</React.Fragment>)}
                  </span>
                </div>

                {exp.description && (
                  <ul className="default-entry-bullets">
                    {(Array.isArray(exp.description) ? exp.description : exp.description.split('\n'))
                      .filter((d) => d.trim() !== '')
                      .slice(0, 3)
                      .map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                  </ul>
                )}
              </div>
            );
          })}
        </>
      );




    case 'education':
      const educationList = data.educationList?.length > 0
        ? data.educationList
        : defaultResumeData.educationList;

      return educationList?.length > 0 && (
        <>
          <h2 className="default-section-title">Education</h2>
          <ul className="default-entry-bullets">
            {educationList.map((edu, i) => {
              const levelLabel = {
                TENTH: 'X',
                TWELFTH: 'XII',
                DIPLOMA: 'Diploma',
                BACHELORS: "Bachelor's",
                MASTERS: "Master's",
                MBA: 'MBA',
                PHD: 'Ph.D.',
                POST_DOCTORATE: 'Post-Doc'
              }[edu.level] || edu.level;

              const isCgpa = edu.percentage && parseFloat(edu.percentage) > 0 && parseFloat(edu.percentage) <= 10;
              const scoreText = edu.percentage ? (isCgpa ? `${edu.percentage} CGPA` : `${edu.percentage}%`) : '';

              return (
                <li key={i} className="default-education-bullet">
                  {levelLabel && <strong>{levelLabel}</strong>}
                  {edu.degree && ` – ${edu.degree}`}
                  {edu.stream && ` in ${edu.stream}`}
                  {edu.institute && ` | ${edu.institute}`}
                  {edu.university && ` | ${edu.university}`}
                  {` | ${edu.startYear} - ${edu.currentlyStudying ? 'Present' : edu.endYear}`}
                  {scoreText && ` | ${scoreText}`}
                </li>
              );
            })}
          </ul>
        </>
      );

    case 'skills':
      const skillList = data.skillList?.length > 0
        ? data.skillList
        : defaultResumeData.skillList;

      return skillList?.length > 0 && (
        <>
          <h2 className="default-section-title">Skills</h2>
          <div className="default-inline-list">
            {skillList.map((s, i) => <span key={i}>{s.skillName}</span>)}
          </div>
        </>
      );

    case 'projects':
      const projectList = data.projectList?.length > 0
        ? data.projectList
        : defaultResumeData.projectList;

      return projectList?.length > 0 && (
        <>
          <h2 className="default-section-title">Projects</h2>
          {projectList.map((proj, i) => (
            <div key={i} className="default-entry">
              <div className="default-entry-top">
                <span className="default-entry-left">
                  <strong>{proj.title}</strong>
                  {proj.techStack && ` | ${proj.techStack}`}
                </span>
                <span className="default-entry-right">
                  {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noopener noreferrer">GitHub</a>}
                  {proj.liveLink && <> | <a href={proj.liveLink} target="_blank" rel="noopener noreferrer">Live</a></>}
                </span>
              </div>
              {proj.description && (
                <ul className="default-entry-bullets">
                  {(Array.isArray(proj.description) ? proj.description : proj.description.split('\n'))
                    .filter((d) => d.trim() !== '')
                    .slice(0, 3)
                    .map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </>
      );

    case 'languages':
      const langList = data.languageList?.length > 0
        ? data.languageList
        : defaultResumeData.languageList;

      return langList?.length > 0 && (
        <>
          <h2 className="default-section-title">Languages</h2>
          <p className="default-inline-list">
            {langList.map((lang) => lang.name).filter(Boolean).join(', ')}
          </p>
        </>
      );

    case 'certifications':
      const certList = data.certificationList?.length > 0
        ? data.certificationList
        : defaultResumeData.certificationList;

      return certList?.length > 0 && (
        <>
          <h2 className="default-section-title">Certifications</h2>
          <ul className="default-entry-bullets">
            {certList.map((c, i) => (
              <li key={i}>
                <strong>{c.title}</strong>
                {c.issuer && ` – ${c.issuer}`}
                {c.issueDate && ` | ${new Date(c.issueDate).toLocaleDateString()}`}
                {` - ${c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'No Expiry'}`}
                {c.proficiencyLevel && ` | Level: ${c.proficiencyLevel}`}
              </li>
            ))}
          </ul>
        </>
      );

    case 'achievements':
      const achievementList = data.achievementList?.length > 0
        ? data.achievementList
        : defaultResumeData.achievementList;

      return achievementList?.length > 0 && (
        <>
          <h2 className="default-section-title">Achievements</h2>
          <ul className="default-entry-bullets">
            {achievementList.map((a, i) => (
              <li key={i}>
                <strong>{a.title}</strong>
                {a.description && ` — ${a.description}`}
                {a.date && ` | ${new Date(a.date).toLocaleDateString()}`}
              </li>
            ))}
          </ul>
        </>
      );

    default:
      return null;
  }
};

export default DefaultTemplate;
