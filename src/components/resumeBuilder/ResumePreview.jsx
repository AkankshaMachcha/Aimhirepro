import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import resumeTemplates from '../resumes/templates';
import '../../assets/css/ResumePreview.css';
import ResumeTemplateRenderer from '../../components/resumes/ResumeTemplateRenderer';


const ResumePreview = forwardRef((props, ref) => {
  const { resumeData, layoutConfig } = useSelector((state) => state.resumeBuilder);
  const { templateName, themeColor, contactInfo } = resumeData;

  const SelectedTemplate = resumeTemplates[templateName] || resumeTemplates['DefaultTemplate'];

  return (
    <div className="resume-preview-wrapper">
      <div ref={ref}> {/* Attach ref only to resume content */}
        <SelectedTemplate
          resumeData={resumeData}
          layoutConfig={layoutConfig}
          themeColor={themeColor}
        />
      </div>
    </div>
  );
});

export default ResumePreview;
