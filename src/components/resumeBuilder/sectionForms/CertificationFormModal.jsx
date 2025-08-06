import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Accordion } from 'react-bootstrap';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import './css/CertificationFormModal.css';

const CertificationFormModal = ({ show, handleClose, onSave, initialData = [] }) => {
  const [certifications, setCertifications] = useState([
    {
      title: '',
      issuer: '',
      issueDate: null,
      expiryDate: null,
      proficiencyLevel: '',
    },
  ]);

  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      const parsed = initialData.map(cert => ({
        ...cert,
        issueDate: cert.issueDate ? new Date(cert.issueDate) : null,
        expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
      }));
      setCertifications(parsed);
    }
  }, [show]);

  const handleChange = (index, field, value) => {
    const updated = [...certifications];
    updated[index][field] = value;
    setCertifications(updated);
  };

  const addCertification = () => {
    if (certifications.length >= 6) {
      toast.info("Maximum of 6 certifications allowed.");
      return;
    }

    setCertifications([
      ...certifications,
      {
        title: '',
        issuer: '',
        issueDate: null,
        expiryDate: null,
        proficiencyLevel: '',
      },
    ]);
  };

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    for (let i = 0; i < certifications.length; i++) {
      const cert = certifications[i];
      if (!cert.title?.trim()) {
        toast.error(`Title is required for certification #${i + 1}`);
        return;
      }
      if (!cert.issuer?.trim()) {
        toast.error(`Issuer is required for certification #${i + 1}`);
        return;
      }
      if (!cert.issueDate) {
        toast.error(`Issue Date is required for certification #${i + 1}`);
        return;
      }
      if (
        cert.issueDate &&
        cert.expiryDate &&
        new Date(cert.expiryDate) < new Date(cert.issueDate)
      ) {
        toast.error(`Expiry Date must be after Issue Date for certification #${i + 1}`);
        return;
      }
    }

    const serialized = certifications.map(cert => ({
      ...cert,
      issueDate: cert.issueDate ? cert.issueDate.toISOString() : null,
      expiryDate: cert.expiryDate ? cert.expiryDate.toISOString() : null,
    }));

    onSave(serialized);
    toast.success("Certifications saved successfully!");
    handleClose();
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = reorder(certifications, result.source.index, result.destination.index);
    setCertifications(reordered);
  };

  const getTitle = (cert) => {
    return cert.title?.trim() || 'Untitled Certification';
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Certifications</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="certifications">
              {(provided) => (
                <Accordion alwaysOpen ref={provided.innerRef} {...provided.droppableProps}>
                  {certifications.map((cert, index) => (
                    <Draggable draggableId={`cert-${index}`} index={index} key={`cert-${index}`}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="mb-2"
                        >
                          <Accordion.Item eventKey={index.toString()}>
                            <Accordion.Header {...provided.dragHandleProps}>
                              {getTitle(cert)}
                            </Accordion.Header>
                            <Accordion.Body>
                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Title *</Form.Label>
                                    <Form.Control
                                      value={cert.title}
                                      onChange={(e) => handleChange(index, 'title', e.target.value)}
                                      placeholder="e.g. AWS Certified Developer"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Issuer *</Form.Label>
                                    <Form.Control
                                      value={cert.issuer}
                                      onChange={(e) => handleChange(index, 'issuer', e.target.value)}
                                      placeholder="e.g. Amazon Web Services"
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Issue Date *</Form.Label>
                                    <DatePicker
                                      value={cert.issueDate}
                                      onChange={(date) => handleChange(index, 'issueDate', date)}
                                      format="yyyy-MM-dd"
                                      slotProps={{ textField: { fullWidth: true } }}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Expiry Date</Form.Label>
                                    <DatePicker
                                      value={cert.expiryDate}
                                      onChange={(date) => handleChange(index, 'expiryDate', date)}
                                      format="yyyy-MM-dd"
                                      slotProps={{ textField: { fullWidth: true } }}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Form.Group className="mb-3">
                                <Form.Label>Proficiency Mentioned on Certificate</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="e.g. Intermediate, Expert, Level II, Grade A"
                                  value={cert.proficiencyLevel}
                                  onChange={(e) =>
                                    handleChange(index, 'proficiencyLevel', e.target.value)
                                  }
                                />
                              </Form.Group>

                              {certifications.length > 1 && (
                                <div className="text-end">
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => removeCertification(index)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                            </Accordion.Body>
                          </Accordion.Item>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Accordion>
              )}
            </Droppable>
          </DragDropContext>

          {certifications.length < 6 && (
            <Button
              variant="link"
              onClick={addCertification}
              className="mt-3 ps-0"
            >
              + Add another certification
            </Button>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CertificationFormModal;
