import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './css/SummaryFormModal.css';
import { toast } from 'react-toastify';

const SummaryFormModal = ({ show, handleClose, onSave, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    visibility: 'PRIVATE'
  });

  const maxSummaryLength = 500;

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        summary: initialData.summary || '',
        visibility: initialData.visibility || 'PRIVATE',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    if (field === 'summary' && value.length > maxSummaryLength) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.summary.trim()) {
      toast.error('Summary is required.');
      return;
    }

    onSave(formData);

    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Resume Summary</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Target Job Title</Form.Label>
            <Form.Control
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Full Stack Developer, Data Analyst"
            />
          </Form.Group>


          <Form.Group className="mt-3">
            <Form.Label>Summary/Objectives *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              maxLength={maxSummaryLength}
              value={formData.summary}
              onChange={(e) => handleChange('summary', e.target.value)}
              placeholder="Write a short professional summary..."
            />
            <div className="text-end summary-char-count">
              {formData.summary.length}/{maxSummaryLength}
            </div>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Visibility *</Form.Label>
            <Form.Select
              value={formData.visibility}
              onChange={(e) => handleChange('visibility', e.target.value)}
            >
              <option value="PRIVATE">Private</option>
              <option value="PUBLIC">Public</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SummaryFormModal;
