import React, { useRef, useState, useEffect } from 'react'; 
import ResumePreview from './ResumePreview';
import SectionNavigator from './SectionNavigator';
import '../../assets/css/ResumeBuilderLayout.css';
import { createResume, downloadResume, updateResume } from '../../services/resumeService';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  updateThemeColor,
  resetCloneMode,
  updateResumeData,
  updateLayoutConfig,
  setResumeMeta
} from '../../redux/slices/resumeBuilderSlice';

import resumeTemplates from '../resumes/templates';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import htmlDocx from 'html-docx-js/dist/html-docx';

import ViewModuleRoundedIcon from '@mui/icons-material/ViewModuleRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import ArticleOutlinedIcon from '@mui/icons-material/Article';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';

import TemplatePreviewModal from './TemplatePreviewModal';
import { templateConfig } from '../common/templateConfig';



const ResumeBuilderLayout = () => {
  const dispatch = useDispatch();
  const { resumeData, editMode, editingVersionLabel, cloneMode } = useSelector(
    (state) => state.resumeBuilder
  );

  const resumeMeta = useSelector((state) => state.resumeBuilder.resumeMeta)

  const layoutConfig = useSelector((state) => state.resumeBuilder.layoutConfig);
  const { templateName, themeColor } = resumeData;

  const previewRef = useRef();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  useEffect(() => {
    if (!templateName || !layoutConfig?.length) return;

    const supported = templateConfig[templateName] || [];

    dispatch((dispatch, getState) => {
      const currentResumeData = getState().resumeBuilder.resumeData;
      const fullResumeData = structuredClone(currentResumeData);

      const updatedLayout = layoutConfig.map((section) => {
        const isSupported = supported.includes(section.id);
        if (!isSupported) {
          fullResumeData[section.id] = Array.isArray(fullResumeData[section.id]) ? [] : null;
        }
        return {
          ...section,
          visible: isSupported
        };
      });

      const reorderedLayout = [
        ...updatedLayout.filter((sec) => supported.includes(sec.id)),
        ...updatedLayout.filter((sec) => !supported.includes(sec.id)),
      ];

      dispatch(updateResumeData(fullResumeData));
      dispatch(updateLayoutConfig(reorderedLayout));
    });

  }, [templateName]);

  const handleSave = async () => {
    try {
      const result = await createResume(resumeData);
      if (result?.data) {
        dispatch(setResumeMeta(result.data));
        dispatch(resetCloneMode());
        toast.success('Resume saved successfully!');
      } else {
        toast.error(result.error || 'Failed to save resume');
      }
    } catch (error) {
      toast.error('Unexpected error while saving resume');
    }
  };

  const validateDownload = async () => {
    setIsDownloading(true);

    const versionLabel = resumeMeta?.versionLabel;

    if (!versionLabel) {
      toast.error('Please save your resume before downloading.');
      setIsDownloading(false);
      return false;
    }

    const result = await downloadResume(versionLabel);
    if (result?.data?.includes('ready')) return true;

    toast.error(result?.error || 'Resume download failed.');
    setIsDownloading(false);
    return false;
  };

  const handleDownloadPDF = async () => {
    const isValid = await validateDownload();
    if (!isValid) return;

    setTimeout(() => {
      const sourceElement = previewRef.current;
      if (!sourceElement) return toast.error('Resume preview not found.');

      const cloned = sourceElement.cloneNode(true);
      const printWrapper = document.getElementById('print-clone-wrapper');
      printWrapper.innerHTML = '';
      printWrapper.appendChild(cloned);

      const opt = {
        margin: 0,
        filename: `${(resumeData.title || 'resume').replace(/\s+/g, '_')}_${resumeData.versionLabel || 'v1'}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all'] },
      };

      html2pdf().from(cloned).set(opt).save().then(() => {
        toast.success('PDF downloaded successfully!');
        setIsDownloading(false);
      });
    }, 300);
  };

  const handleDownloadPNG = async () => {
    const isValid = await validateDownload();
    if (!isValid) return;

    const preview = previewRef.current;
    if (!preview) return toast.error("Resume preview not found");

    const canvas = await html2canvas(preview, { scale: 3, useCORS: true });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${(resumeData.title || 'resume').replace(/\s+/g, '_')}.png`;
    link.click();
    toast.success("PNG downloaded successfully!");
    setIsDownloading(false);
  };

  const handleDownloadTXT = async () => {
    const isValid = await validateDownload();
    if (!isValid) return;

    const plainText = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([plainText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${(resumeData.title || 'resume').replace(/\s+/g, '_')}.txt`;
    link.click();
    toast.success("TXT downloaded successfully!");
    setIsDownloading(false);
  };

  const handleDownloadDOCX = async () => {
    const isValid = await validateDownload();
    if (!isValid) return;

    const html = `
      <html>
        <head><meta charset="utf-8"></head>
        <body>${previewRef.current?.innerHTML || ''}</body>
      </html>
    `;
    const converted = htmlDocx.asBlob(html);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(converted);
    link.download = `${(resumeData.title || 'resume').replace(/\s+/g, '_')}.docx`;
    link.click();
    toast.success("DOCX downloaded successfully!");
    setIsDownloading(false);
  };

  const handleUpdate = async () => {
    try {
      const result = await updateResume(editingVersionLabel, resumeData);
      if (result?.data) {
        dispatch(setResumeMeta(result.data));
        toast.success('Resume updated successfully!');
        setTimeout(() => {
          window.location.href = "/dashboard/view-latest";
        }, 1500);
      } else {
        toast.error(result.error || 'Failed to update resume');
      }
    } catch (error) {
      toast.error('Unexpected error while updating resume');
    }
  };


  const colorOptions = [
    { hex: '#0B3558', name: 'Navy Ink' },
    { hex: '#2A9D8F', name: 'Professional Teal' },
    { hex: '#3D5A80', name: 'Slate Blue' },
    { hex: '#4F4557', name: 'Smoky Plum' },
    { hex: '#A47551', name: 'Soft Mocha' },
    { hex: '#B08968', name: 'Cafe Bronze' },
    { hex: '#5F7161', name: 'Olive Smoke' },
    { hex: '#7F4F24', name: 'Burnt Sienna' },
  ];

  return (
    <div className="resume-builder-container container-fluid">
      {isDownloading && (
        <div className="spinner-overlay">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}

      <div className="resume-row d-flex flex-row flex-wrap" style={{ paddingTop: '0' }}>
        <div className="preview-column flex-grow-1 me-3" style={{ flexBasis: '70%' }}>
          <h2 className="fw-bold text-center mx-auto">My Resume</h2>

          <div className="topbar-wrapper d-flex justify-content-between align-items-center flex-wrap mx-auto" style={{ width: '794px' }}>
            <div className="topbar-left d-flex align-items-center gap-3 flex-wrap">
              <div
                className="topbar-icon d-flex align-items-center gap-2 px-2 py-1"
                title="Choose Template"
                onClick={() => setShowTemplateModal(true)}
                style={{
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  fontWeight: 500,
                  color: '#0B3558',
                }}
              >
                <ViewModuleRoundedIcon sx={{ fontSize: 20 }} />
                <span>Templates</span>
              </div>

              <div className="d-flex align-items-center gap-2">
                {colorOptions.map((color) => (
                  <div
                    key={color.hex}
                    className={`theme-dot ${themeColor === color.hex ? 'selected' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => dispatch(updateThemeColor(color.hex))}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="topbar-right d-flex align-items-center gap-3">
              <DropdownButton
                id="download-dropdown"
                title={<><DownloadRoundedIcon fontSize="small" /> Download</>}
                variant="light"
                size="sm"
              >
                <Dropdown.Item onClick={handleDownloadPDF}>
                  <PictureAsPdfIcon fontSize="small" className="me-2" /> PDF
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDownloadPNG}>
                  <ImageIcon fontSize="small" className="me-2" /> PNG
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDownloadTXT}>
                  <DescriptionIcon fontSize="small" className="me-2" /> TXT
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDownloadDOCX}>
                  <ArticleOutlinedIcon fontSize="small" className="me-2" /> DOCX
                </Dropdown.Item>
              </DropdownButton>

              {cloneMode ? (
                <div className="topbar-icon d-flex align-items-center gap-2 px-2 py-1" onClick={handleSave}>
                  <ContentCopyIcon sx={{ fontSize: 20 }} />
                  <span>Clone Resume</span>
                </div>
              ) : editMode ? (
                <div className="topbar-icon d-flex align-items-center gap-2 px-2 py-1" onClick={handleUpdate}>
                  <EditIcon sx={{ fontSize: 20 }} />
                  <span>Update Resume</span>
                </div>
              ) : (
                <div className="topbar-icon d-flex align-items-center gap-2 px-2 py-1" onClick={handleSave}>
                  <BookmarkAddIcon sx={{ fontSize: 20 }} />
                  <span>Save Resume</span>
                </div>
              )}
            </div>
          </div>

          <div id="print-clone-wrapper" style={{ visibility: 'hidden', position: 'absolute', left: '-9999px' }} />
          <ResumePreview ref={previewRef} />
        </div>

        <div className="navigator-column" style={{ flexBasis: '28%' }}>
          <div className="navigator-header">
            <h5 className="navigator-title">Resume Sections</h5>
            <p className="navigator-description">Use the menu below to edit, reorder, or hide resume sections.</p>
            {/* <hr className="navigator-separator" /> */}
          </div>
          <SectionNavigator />
        </div>
      </div>

      <TemplatePreviewModal show={showTemplateModal} handleClose={() => setShowTemplateModal(false)} />
    </div>
  );
};

export default ResumeBuilderLayout;
