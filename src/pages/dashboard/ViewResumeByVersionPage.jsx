import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadResumeForEdit,
  cloneResumeFromMeta,
} from "../../redux/slices/resumeBuilderSlice";
import {
  getResumeByVersion,
  downloadResume,
  deleteResumeByVersion,
} from "../../services/resumeService";
import ResumeTemplateRenderer from "../../components/resumes/ResumeTemplateRenderer";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";
import {
  EditOutlined,
  ContentCopy,
  DownloadOutlined,
  DeleteOutline,
  PictureAsPdf,
  ImageOutlined,
  Description,
  InsertDriveFileOutlined,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import htmlDocx from "html-docx-js/dist/html-docx";
import "../../assets/css/ViewResumeByVersionPage.css";

const ViewResumeByVersionPage = () => {
  const { versionLabel } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const previewRef = useRef();
  const layoutConfig = useSelector((state) => state.resumeBuilder.layoutConfig);
  const userAuthority = useSelector((state) => state.auth.user?.authority || "");
  const isPremium = userAuthority.includes("PREMIUM");

  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await getResumeByVersion(versionLabel);
        setResumeData(data);
      } catch (err) {
        toast.error("Failed to load resume.");
        navigate("/dashboard/resumes");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [versionLabel, navigate]);

  const handleEdit = () => {
    dispatch(loadResumeForEdit(resumeData));
    navigate("/dashboard/create");
  };

  const handleClone = () => {
    dispatch(cloneResumeFromMeta(resumeData));
    toast.success("Resume cloned.");
    navigate("/dashboard/create");
  };

  const validateDownload = async () => {
    setIsDownloading(true);
    const result = await downloadResume(versionLabel);
    if (result?.data?.includes("ready")) return true;
    toast.error(result?.error || "Resume download failed.");
    setIsDownloading(false);
    return false;
  };

  const handleDownload = async (type) => {
    const isValid = await validateDownload();
    if (!isValid) return;

    const fileName = `${(resumeData.title || "resume").replace(/\s+/g, "_")}`;
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
          filename: `${fileName}_${resumeData.versionLabel || "v1"}.pdf`,
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
        const plainText = JSON.stringify(resumeData, null, 2);
        const txtBlob = new Blob([plainText], { type: "text/plain" });
        const txtLink = document.createElement("a");
        txtLink.href = URL.createObjectURL(txtBlob);
        txtLink.download = `${fileName}.txt`;
        txtLink.click();
        toast.success("TXT downloaded!");
        setIsDownloading(false);
        break;

      case "docx":
        const html = `<html><head><meta charset="utf-8"></head><body>${element.innerHTML}</body></html>`;
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

    setAnchorEl(null);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteResumeByVersion(versionLabel);
    setIsDeleting(false);
    setConfirmOpen(false);

    if (result?.data) {
      setTimeout(() => {
        toast.success(result.data);
        navigate("/dashboard/view-all");
      }, 400);
    } else {
      toast.error(result?.error || "Failed to delete resume.");
    }
  };

  if (loading) return <Loader />;
  if (!resumeData) return null;

  return (
    <div className="container py-4">
      <div className="mb-4 view-resume-header text-center">
        <h2 className="fw-bold">Resume Snapshot</h2>
        <p className="text-muted">
          A saved version of your resume with full content and design. You can edit, clone, download, or delete it.
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-start flex-wrap">
        <div className="d-flex flex-wrap gap-3">
          <span className="badge bg-primary">Version: {resumeData.versionLabel}</span>
          <span className="badge bg-dark">Visibility: {resumeData.visibility}</span>
          <span className="badge bg-secondary">Template: {resumeData.templateName}</span>
          <span className="badge bg-info text-dark">Created: {new Date(resumeData.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-3 justify-content-end">
          <Button variant="outlined" size="medium" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="outlined" size="medium" color="secondary" startIcon={<ContentCopy />} onClick={handleClone}>
            Clone
          </Button>
          <Button
            variant="contained"
            size="medium"
            color="success"
            startIcon={<DownloadOutlined />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            disabled={isDownloading}
          >
            Download
          </Button>
          <Menu  PaperProps={{
                sx: {
                  minWidth: 180,
                  px: 1,
                },
              }}
              anchorEl={anchorEl} open={openMenu} onClose={() => setAnchorEl(null)}>
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
          <Button
            variant="outlined"
            size="medium"
            color="error"
            startIcon={<DeleteOutline />}
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="resume-preview-frame p-3 mx-auto" style={{ maxWidth: "794px" }} ref={previewRef}>
        <ResumeTemplateRenderer
          resumeData={resumeData}
          templateName={resumeData.templateName}
          themeColor={resumeData.themeColor}
          layoutConfig={layoutConfig}
        />
      </div>

      <div id="print-clone-wrapper" style={{ display: "none" }}></div>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete this resume? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewResumeByVersionPage;
