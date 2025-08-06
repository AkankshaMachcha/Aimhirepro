import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Chip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';
import './ResumeCard.css';

const ResumeCard = ({
  summary,
  onView,
  onEdit,
  onClone,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  return (
    <div
      className="resume-card-wrapper shadow-sm"
      style={{ borderLeft: `5px solid ${summary.themeColor}` }}
      onClick={onView}
    >
      <div className="resume-card-header d-flex justify-content-between">
        <div>
          <span className="resume-card-version fw-bold me-2">
            {summary.versionLabel}
          </span>
          <Chip
            size="small"
            label={summary.visibility}
            color={summary.visibility === 'PUBLIC' ? 'success' : 'default'}
            className="resume-card-chip"
          />
        </div>

        <IconButton onClick={handleMenuOpen} size="small">
          <MoreVertIcon />
        </IconButton>

        <Menu PaperProps={{
          sx: {
            minWidth: 150,
            px: 1,
          },
        }}
          anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onView && onView();
            }}
          >
            <VisibilityIcon fontSize="small" className="me-2" /> View
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onEdit && onEdit();
            }}
          >
            <EditIcon fontSize="small" className="me-2" /> Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onClone && onClone();
            }}
          >
            <ContentCopyIcon fontSize="small" className="me-2" /> Clone
          </MenuItem>

        </Menu>
      </div>

      <div className="resume-card-body">
        <h5 className="resume-card-title fw-semibold">{summary.title}</h5>
        <p className="resume-card-summary text-muted small mb-2">
          {summary.summary}
        </p>
        <div className="resume-card-footer d-flex justify-content-between text-muted small">
          <span>{summary.templateName}</span>
          <span>{format(new Date(summary.createdAt), 'dd MMM yyyy')}</span>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
