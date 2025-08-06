import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loadLatestResume,
  loadResumeForEdit,
  cloneResumeFromMeta
} from "../../redux/slices/resumeBuilderSlice";
import ResumeTemplateRenderer from "../../components/resumes/ResumeTemplateRenderer";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import htmlDocx from "html-docx-js/dist/html-docx";

import {
  EditOutlined,
  ContentCopy,
  DownloadOutlined,
  PictureAsPdf,
  ImageOutlined,
  Description,
  InsertDriveFileOutlined,
} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "../../assets/css/ViewLatestResume.css";
import { downloadResume } from "../../services/resumeService";

const ViewLatestResume = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const resumeMeta = useSelector((state) => state.resumeBuilder.resumeMeta);
  const layoutConfig = useSelector((state) => state.resumeBuilder.layoutConfig);
  const userAuthority = useSelector((state) => state.auth.user?.authority || "");
  const isPremium = userAuthority.includes("PREMIUM");

  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const previewRef = useRef();

  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        await dispatch(loadLatestResume()).unwrap();
      } catch (error) {
        if (error === "No resume found for your account.") {
          toast.info("No resume found. You can create one now.");
          navigate("/dashboard/create");
        } else {
          toast.error(error || "Failed to load resume.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [dispatch, navigate]);

  const validateDownload = async () => {
    setIsDownloading(true);
    const result = await downloadResume(resumeMeta.versionLabel);
    if (result?.data?.includes("ready")) return true;
    toast.error(result?.error || "Resume download failed.");
    setIsDownloading(false);
    return false;
  };

  const handleEdit = () => {
    dispatch(loadResumeForEdit(resumeMeta));
    navigate("/dashboard/create");
  };


  const handleClone = () => {
    dispatch(cloneResumeFromMeta(resumeMeta));
    toast.success("Cloning resume..."); // optional
    navigate("/dashboard/create");
  };


  const handleDownload = async (type) => {
    const isValid = await validateDownload();
    if (!isValid) return;

    const fileName = `${(resumeMeta.title || "resume").replace(/\s+/g, "_")}`;
    const element = previewRef.current;

    if (!element) return toast.error("Resume preview not found.");

    switch (type) {
      case "pdf":
        const cloned = element.cloneNode(true);
        const printWrapper = document.getElementById("print-clone-wrapper");
        printWrapper.innerHTML = "";
        printWrapper.appendChild(cloned);

        const opt = {
          margin: 0,
          filename: `${fileName}_${resumeMeta.versionLabel || "v1"}.pdf`,
          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 3, useCORS: true },
          jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all"] },
        };

        html2pdf().from(cloned).set(opt).save().then(() => {
          toast.success("PDF downloaded!");
          setIsDownloading(false);
        });
        break;

      case "png":
        const canvas = await html2canvas(element, { scale: 3, useCORS: true });
        const pngLink = document.createElement("a");
        pngLink.href = canvas.toDataURL("image/png");
        pngLink.download = `${fileName}.png`;
        pngLink.click();
        toast.success("PNG downloaded!");
        setIsDownloading(false);
        break;

      case "txt":
        const plainText = JSON.stringify(resumeMeta, null, 2);
        const txtBlob = new Blob([plainText], { type: "text/plain" });
        const txtLink = document.createElement("a");
        txtLink.href = URL.createObjectURL(txtBlob);
        txtLink.download = `${fileName}.txt`;
        txtLink.click();
        toast.success("TXT downloaded!");
        setIsDownloading(false);
        break;

      case "docx":
        const html = `<html><head><meta charset="utf-8"></head><body>${element?.innerHTML || ""}</body></html>`;
        const docxBlob = htmlDocx.asBlob(html);
        const docxLink = document.createElement("a");
        docxLink.href = URL.createObjectURL(docxBlob);
        docxLink.download = `${fileName}.docx`;
        docxLink.click();
        toast.success("DOCX downloaded!");
        setIsDownloading(false);
        break;

      default:
        toast.error("Invalid download type.");
    }

    handleMenuClose();
  };

  if (loading) return <Loader />;
  if (!resumeMeta) return null;

  return (
    <div className="container py-4">
      <div className="mb-3 text-center view-resume-header no-print">
        <h2 className="fw-bold ">Latest Resume</h2>
        <p className="text-muted">
          This is the most recently saved version of your resume. You can edit, download, or clone it below.
        </p>
      </div>

      <div className="vresume-preview-container mx-auto no-print">
        <div className="d-flex justify-content-between align-items-center mb-4 view-resume-actions flex-wrap text-center mx-auto"
          style={{
            maxWidth: '794px',
            width: '100%',
          }}>
          <div>
            <span className="badge bg-primary me-2">Version: {resumeMeta.versionLabel}</span>
            <span className="badge bg-secondary">Visibility: {resumeMeta.visibility}</span>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            {isPremium && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  Edit Resume
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ContentCopy />}
                  onClick={handleClone}
                >
                  Clone Resume
                </Button>
              </>
            )}

            <Button
              variant="contained"
              color="success"
              startIcon={<DownloadOutlined />}
              onClick={handleMenuClick}
              disabled={isDownloading}
            >
              Download
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  minWidth: 180,
                  px: 1,
                },
              }}
            >
              <MenuItem onClick={() => handleDownload("pdf")}>
                <PictureAsPdf className="me-2" /> PDF
              </MenuItem>
              <MenuItem onClick={() => handleDownload("png")}>
                <ImageOutlined className="me-2" /> PNG
              </MenuItem>
              <MenuItem onClick={() => handleDownload("txt")}>
                <Description className="me-2" /> TXT
              </MenuItem>
              <MenuItem onClick={() => handleDownload("docx")}>
                <InsertDriveFileOutlined className="me-2" /> DOCX
              </MenuItem>
            </Menu>

          </div>
        </div>

        <div className="d-flex justify-content-center align-items-center">
          <div ref={previewRef}>
            <ResumeTemplateRenderer
              resumeData={resumeMeta}
              layoutConfig={layoutConfig}
              templateName={resumeMeta.templateName}
              themeColor={resumeMeta.themeColor}
            />
          </div>
        </div>


      </div>

      <div id="print-clone-wrapper" style={{ display: "none" }}></div>
    </div>
  );
};

export default ViewLatestResume;
