import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setEditingSection,
  toggleSectionVisibility,
} from '../../../redux/slices/resumeBuilderSlice';
import './SalesProfessionalTemplate.css';
import { defaultResumeData } from "../../../constants/defaultResumeData";

const SalesProfessionalTemplate = ({ resumeData = defaultResumeData, layoutConfig, themeColor }) => {
  const dispatch = useDispatch();

  const finalResumeData =
      resumeData && Object.keys(resumeData).length > 0 ? resumeData : defaultResumeData;
  
    const contactInfo =
      finalResumeData.contactInfo ||
      finalResumeData.resumeContactInfoResponse ||
      defaultResumeData.contactInfo;

  const theme = themeColor || '#0057D9';

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


  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d) ? date : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDateRange = (start, end, ongoing = false) =>
    [formatDate(start), ongoing ? 'Present' : formatDate(end)].filter(Boolean).join(' - ');

  return (
    <div className="salespro-template" style={{ '--theme-color': theme }}>
      <div className="salespro-header text-center" onClick={() => dispatch(setEditingSection('contact'))}>
        <h1 className="salespro-name">
          {`${contactInfo?.firstName || 'Your'} ${contactInfo?.lastName || 'Name'}`}
        </h1>
        <p className="salespro-title">{resumeData.title || 'Your Professional Title'}</p>
        <div className="salespro-contact">
          <span>{contactInfo?.phoneNumber || '+91 9876543210'}</span>
          <span>{contactInfo?.email || 'you@example.com'}</span>
          <span>
            {[contactInfo?.city, contactInfo?.state, contactInfo?.country]
              .filter(Boolean)
              .join(', ') || 'Your Location'}
          </span>
        </div>
      </div>

      <div className="salespro-body row">
        {/* LEFT COLUMN */}
        <div className="col-md-4">
          <div className="salespro-section" onClick={() => dispatch(setEditingSection('summary'))}>
            <h3>Summary</h3>
            <p>{resumeData.summary || 'Your professional summary goes here...'}</p>
          </div>

          <div className="salespro-section" onClick={() => dispatch(setEditingSection('achievements'))}>
            <h3>Key Achievements</h3>
            <ul>
              {(hasData(resumeData.achievementList) ? resumeData.achievementList : [{ title: 'Improved client retention by 20%' }]).map((a, i) => (<li key={i}>{a.title}</li>))}
            </ul>
          </div>

          <div className="salespro-section" onClick={() => dispatch(setEditingSection('languages'))}>
            <h3>Languages</h3>
            <ul>
              {(hasData(resumeData.languageList)
                ? resumeData.languageList
                : [{ name: 'English', level: 'Fluent' }, { name: 'Hindi', level: 'Native' }]
              ).map((lang, i) => (
                <li key={i}>
                  {lang.name} – {lang.proficiency?.charAt(0).toUpperCase() + lang.proficiency?.slice(1).toLowerCase()}

                </li>
              ))}
            </ul>
          </div>


          <div className="salespro-section" onClick={() => dispatch(setEditingSection('certifications'))}>
            <h3>Certifications</h3>
            <ul>
              {(hasData(resumeData.certificationList)
                ? resumeData.certificationList
                : [
                  {
                    title: 'Certified Sales Expert',
                    issuer: 'Sales Authority',
                    issueDate: '2020-01-01',
                    expiryDate: '',
                    proficiencyLevel: 'Advanced',
                  },
                ]
              ).map((c, i) => (
                <li key={i}>
                  <strong>{c.title}</strong> – {c.issuer} (
                  {formatDate(c.issueDate)}
                  {c.expiryDate ? ` to ${formatDate(c.expiryDate)}` : ''})
                  {c.proficiencyLevel && ` | Level: ${c.proficiencyLevel}`}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CENTER COLUMN */}
        <div className="col-md-5">
          <div className="salespro-section" onClick={() => dispatch(setEditingSection('experience'))}>
            <h3>Experience</h3>
            {(hasData(resumeData.experienceList)
              ? resumeData.experienceList
              : [
                {
                  jobTitle: 'Sales Manager',
                  companyName: 'XYZ Corp',
                  startDate: '2019-01-01',
                  endDate: '',
                  currentlyWorking: true,
                  city: 'New Delhi',
                  country: 'India',
                  description: [
                    'Increased regional revenue by 30%',
                    'Trained 10+ junior sales associates',
                  ],
                },
              ]
            ).map((exp, i) => (
              <div key={i} className="salespro-entry mb-3">
                <strong>{exp.jobTitle || 'Job Title'}</strong>
                <p>
                  {exp.companyName || 'Company Name'} –{' '}
                  {[exp.city, exp.country].filter(Boolean).join(', ') || 'Location'}
                </p>
                <p className="text-muted">
                  {formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}
                </p>
                {exp.description && (
                  <ul className="entry-bullets">
                    {(Array.isArray(exp.description)
                      ? exp.description
                      : exp.description.split('\n')
                    )
                      .filter((point) => point.trim() !== '')
                      .slice(0, 3)
                      .map((point, j) => (
                        <li key={j}>{point}</li>
                      ))}
                  </ul>
                )}

              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-md-3">
          <div className="salespro-section" onClick={() => dispatch(setEditingSection('education'))}>
            <h3>Education</h3>
            {(hasData(resumeData.educationList)
              ? resumeData.educationList
              : [
                {
                  degree: 'MBA in Sales & Marketing',
                  institute: 'Delhi Business School',
                  university: 'Delhi University',
                  startYear: '2016',
                  endYear: '2018',
                  currentlyStudying: false,
                  location: 'Delhi',
                },
              ]
            ).map((edu, i) => (
              <p key={i} style={{ textAlign: 'justify', marginBottom: '10px' }}>
                <strong>{formatEducationLevel(edu.level)}</strong> {edu.degree && `| ${edu.degree}`} |
                {edu.stream}<br />
                {edu.institute} | {edu.university}<br />
                {edu.startYear} - {edu.currentlyStudying ? 'Present' : edu.endYear}<br />
                {edu.percentage && `${edu.percentage} ${parseFloat(edu.percentage) <= 10 ? 'CGPA' : '%'}`}
              </p>
            ))}
          </div>

          <div className="salespro-section" onClick={() => dispatch(setEditingSection('skills'))}>
            <h3>Skills</h3>
            <ul>
              {(hasData(resumeData.skillList)
                ? resumeData.skillList.map((s) => s.skillName)
                : ['B2B Sales', 'Negotiation', 'CRM Tools']
              ).map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>


        </div>
      </div>
    </div>
  );
};

export default SalesProfessionalTemplate;
