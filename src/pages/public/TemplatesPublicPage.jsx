// ✅ src/pages/dashboard/TemplatesPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateTemplateName } from '../../redux/slices/resumeBuilderSlice';
import '../../assets/css/TemplatesPage.css';

const templates = [
  {
    name: "DefaultTemplate",
    label: "Classic Basic",
    description: "A clean, straightforward layout suitable for all professionals.",
    thumbnail: "/assets/thumbnails/DefaultTemplate.png",
  },
  {
    name: "ProfessionalModernTemplate",
    label: "Modern Corporate",
    description: "Perfect for corporate, tech, and consulting roles. Balanced layout with bold sections.",
    thumbnail: "/assets/thumbnails/ProfessionalModernTemplate.png",
  },
  {
    name: "ClassicEleganceTemplate",
    label: "Elegant Serif",
    description: "Stylish and refined with serif fonts, great for academics or creatives.",
    thumbnail: "/assets/thumbnails/ClassicEleganceTemplate.png",
  },
  {
    name: "ModernProfileTemplate",
    label: "Minimalist Profile",
    description: "Profile-focused design with neat two-column layout. Ideal for designers or marketers.",
    thumbnail: "/assets/thumbnails/ModernProfileTemplate.png",
  },
  {
    name: "LexingtonResumeTemplate",
    label: "Bold Timeline",
    description: "Visually structured timeline layout, ideal for storytelling resumes.",
    thumbnail: "/assets/thumbnails/LexingtonResumeTemplate.png",
  },
  {
    name: "SalesProfessionalTemplate",
    label: "Sales Spotlight",
    description: "Highlight achievements with bold emphasis—perfect for sales, marketing, and business roles.",
    thumbnail: "/assets/thumbnails/SalesProfessionalTemplate.png",
  },
];


const TemplatesPublicPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUseTemplate = (templateName) => {
    dispatch(updateTemplateName(templateName));
    navigate('/dashboard/create');
  };

  return (
    <div className="templates-container container py-5">
      <h2 className="text-center mb-4 fw-bold">Explore Resume Templates</h2>
      <p className="text-center text-muted mb-5">Choose a professionally designed template and start building your resume instantly.</p>

      <div className="row g-4">
        {templates.map((template) => (
          <div key={template.name} className="col-md-4">
            <div className={`template-card ${template.name}-card`}>
              <div className="thumbnail-wrapper">
                <img
                  src={template.thumbnail}
                  alt={template.label}
                  className="img-fluid rounded"
                />
                <div className="overlay">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleUseTemplate(template.name)}
                  >
                    Use This Template
                  </button>
                </div>
              </div>
              <h5 className="mt-3 fw-semibold">{template.label}</h5>
              <p className="text-muted small">{template.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPublicPage;
