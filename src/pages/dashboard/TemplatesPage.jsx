// src/pages/dashboard/TemplatesPage.jsx
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateTemplateName } from "../../redux/slices/resumeBuilderSlice";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Menu,
  MenuItem,
  IconButton,
  Typography,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import "../../assets/css/TemplatesPage.css";
import html2pdf from "html2pdf.js";
import { defaultResumeData } from "../../constants/defaultResumeData";
import ResumeTemplateRenderer from "../../components/resumes/ResumeTemplateRenderer";

const templates = [
  {
    name: "DefaultTemplate",
    label: "Default Template",
    thumbnail: "/assets/thumbnails/DefaultTemplate.png",
  },
  {
    name: "ProfessionalModernTemplate",
    label: "Professional Modern",
    thumbnail: "/assets/thumbnails/ProfessionalModernTemplate.png",
  },
  {
    name: "ClassicEleganceTemplate",
    label: "Classic Elegance",
    thumbnail: "/assets/thumbnails/ClassicEleganceTemplate.png",
  },
  {
    name: "ModernProfileTemplate",
    label: "Modern Profile",
    thumbnail: "/assets/thumbnails/ModernProfileTemplate.png",
  },
  {
    name: "LexingtonResumeTemplate",
    label: "Lexington Resume",
    thumbnail: "/assets/thumbnails/LexingtonResumeTemplate.png",
  },
  {
    name: "SalesProfessionalTemplate",
    label: "Sales Professional",
    thumbnail: "/assets/thumbnails/SalesProfessionalTemplate.png",
  },
];

const TemplatesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [shouldDownload, setShouldDownload] = useState(false);
  const previewRef = useRef();

  const handleClick = (event, templateName) => {
    setAnchorEl(event.currentTarget);
    setSelectedTemplate(templateName);
    // console.log("Selected Template:", templateName);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUseTemplate = () => {
    dispatch(updateTemplateName(selectedTemplate));
    navigate("/dashboard/create");
  };

  const handleDownloadPDF = () => {
    const sourceElement = previewRef.current;
    if (!sourceElement) return alert("Resume preview not found.");

    const cloned = sourceElement.cloneNode(true);
    const printWrapper = document.getElementById("template-download-wrapper");
    printWrapper.innerHTML = "";
    printWrapper.appendChild(cloned);

    const opt = {
      margin: 0,
      filename: `${selectedTemplate || "resume"}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all"] },
    };

    html2pdf()
      .from(cloned)
      .set(opt)
      .save()
      .then();
  };

  // const handleDownloadDOCX = () => {
  //   const doc = generateDocx(defaultResumeData); // generate the document with your data

  //   Packer.toBlob(doc).then((blob) => {
  //     saveAs(blob, `${defaultResumeData.contactInfo.firstName || "resume"}.docx`);
  //   });
  // };

  useEffect(() => {
    if (shouldDownload && previewRef.current) {
      handleDownloadPDF();
      setShouldDownload(false);
    }
  }, [shouldDownload, previewRef.current]);

  return (
    <div className="template-page container py-4">
      <div className="template-header text-center mb-4">
        <h2 className="fw-bold">Choose a Resume Template</h2>
        <p className="text-muted">Preview and apply any professional resume template below.</p>
      </div>

      <div className="row justify-content-center">
        {templates.map((template, idx) => (
          <div
            className="col-lg-4 col-md-6 mb-5 d-flex flex-column align-items-center"
            key={idx}
          >
            <div className="position-relative template-box-wrapper">
              <img
                src={template.thumbnail}
                alt={template.label}
                className="img-fluid rounded template-box-image"
              />
              <IconButton
                className="position-absolute top-0 end-0 m-2 template-box-menu"
                onClick={(e) => handleClick(e, template.name)}
              >
                <MoreVertIcon />
              </IconButton>
            </div>
            <Typography variant="body1" className="template-box-label mt-2">
              {template.label}
            </Typography>
          </div>
        ))}
      </div>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleUseTemplate}>
          <ListItemIcon><CheckCircleOutlineIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Use This Template</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            setShouldDownload(true);
          }}
        >
          <ListItemIcon><PictureAsPdfIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Download as PDF</ListItemText>
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            handleClose();
            handleDownloadDOCX();
          }}
        >
          <ListItemIcon><DescriptionIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Download as Word (.docx)</ListItemText>
        </MenuItem> */}
      </Menu>

      {/* Hidden renderer to clone from */}
      <div
        id="template-download-wrapper"
        style={{ visibility: "hidden", position: "absolute", left: "-9999px", top: "0" }}
      >
        {selectedTemplate && (
          <div ref={previewRef}>
            <ResumeTemplateRenderer
              resumeData={defaultResumeData}
              layoutConfig={[
                { id: 'summary', visible: true },
                { id: 'experience', visible: true },
                { id: 'education', visible: true },
                { id: 'projects', visible: true },
                { id: 'skills', visible: true },
                { id: 'languages', visible: true },
                { id: 'certifications', visible: true },
                { id: 'achievements', visible: true }
              ]}
              templateName={selectedTemplate}
              themeColor={defaultResumeData.themeColor}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;
