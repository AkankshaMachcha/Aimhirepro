import React from 'react';
import { Chip } from '@mui/material';
import { format } from 'date-fns';
import '../../assets/css/MatchResumeCard.css';

const MatchResumeCard = ({ summary, onView, onEdit, onClone }) => {


  return (
    <div className="match-resume-card" onClick={onView}>
      <div className="match-resume-card-header">
        <div>
          <span className="match-resume-version">{summary.versionLabel}</span>
          <Chip
            size="small"
            label={summary.visibility}
            color={summary.visibility === 'PUBLIC' ? 'success' : 'default'}
            className="match-resume-chip"
          />
        </div>

      </div>

      <div className="match-resume-card-body">
        <h5 className="match-resume-title">{summary.title}</h5>
        <p className="match-resume-summary">{summary.summary}</p>
        <div className="match-resume-footer">
          <span>{summary.templateName}</span>
          <span>{format(new Date(summary.createdAt), 'dd MMM yyyy')}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchResumeCard;
