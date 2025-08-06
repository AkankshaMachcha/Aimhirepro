import React from "react";

// ✅ Import all templates you support
import ProfessionalModernTemplate from "./templates/ProfessionalModernTemplate";
import SalesProfessionalTemplate from "./templates/SalesProfessionalTemplate";
import ClassicEleganceTemplate from "./templates/ClassicEleganceTemplate";
import ModernProfileTemplate from "./templates/ModernProfileTemplate";
import LexingtonResumeTemplate from "./templates/LexingtonResumeTemplate";
import DefaultTemplate from "./templates/DefaultTemplate";

const ResumeTemplateRenderer = ({ resumeData, templateName, themeColor, layoutConfig }) => {
  switch (templateName) {
    case "ProfessionalModernTemplate":
      return <ProfessionalModernTemplate resumeData={resumeData} themeColor={themeColor} layoutConfig={layoutConfig} />;

    case "SalesProfessionalTemplate":
      return <SalesProfessionalTemplate resumeData={resumeData} themeColor={themeColor} layoutConfig={layoutConfig} />;

    case "ClassicEleganceTemplate":
      return <ClassicEleganceTemplate resumeData={resumeData} themeColor={themeColor} layoutConfig={layoutConfig} />;

    case "ModernProfileTemplate":
      return <ModernProfileTemplate resumeData={resumeData} themeColor={themeColor} layoutConfig={layoutConfig} />;

    case "LexingtonResumeTemplate":
      return <LexingtonResumeTemplate resumeData={resumeData} themeColor={themeColor} layoutConfig={layoutConfig} />;

    default:
      return <DefaultTemplate resumeData={resumeData} themeColor={themeColor} layoutConfig={layoutConfig} />;
  }
};

export default ResumeTemplateRenderer;
