import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, Accordion } from 'react-bootstrap';
import './css/EducationFormModal.css';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const educationLevels = [
  { label: '10th / SSC / Matric', value: 'TENTH' },
  { label: '12th / HSC / Intermediate', value: 'TWELFTH' },
  { label: 'Diploma', value: 'DIPLOMA' },
  { label: `Bachelor's`, value: 'BACHELORS' },
  { label: `Master's`, value: 'MASTERS' },
  { label: 'MBA', value: 'MBA' },
  { label: 'PhD', value: 'PHD' },
  { label: 'Post Doctorate', value: 'POST_DOCTORATE' },
];

const yearOptions = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 2025 - i);

const emptyEducation = {
  level: '',
  degree: '',
  stream: '',
  institute: '',
  university: '',
  startYear: '',
  endYear: '',
  percentage: '',
  currentlyStudying: false,
};

const EducationFormModal = ({ show, handleClose, onSave }) => {
  const { educationList } = useSelector((state) => state.resumeBuilder.resumeData);
  const [educations, setEducations] = useState([emptyEducation]);

  useEffect(() => {
    if (educationList && educationList.length > 0) {
      setEducations(educationList.map((e) => ({ ...e })));
    }
  }, [educationList]);

  const handleChange = (index, field, value) => {
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
  };

  const addEducation = () => {
    if (educations.length < 4) {
      setEducations([...educations, { ...emptyEducation }]);
    }
  };

  const removeEducation = (index) => {
    const updated = educations.filter((_, i) => i !== index);
    setEducations(updated);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const reordered = reorder(educations, index, index - 1);
    setEducations(reordered);
  };

  const moveDown = (index) => {
    if (index === educations.length - 1) return;
    const reordered = reorder(educations, index, index + 1);
    setEducations(reordered);
  };

  const isFieldFilled = (val) => val !== undefined && val !== null && String(val).trim() !== '';

  const handleSubmit = () => {
    for (let i = 0; i < educations.length; i++) {
      const edu = educations[i];
      const isPartiallyFilled = Object.values(edu).some(
        (val) => isFieldFilled(val) || edu.currentlyStudying
      );

      if (isPartiallyFilled) {
        if (!edu.level || !isFieldFilled(edu.university) || !isFieldFilled(edu.startYear)) {
          toast.error(`Please complete required fields in education entry ${i + 1}`);
          return;
        }

        if (!edu.currentlyStudying && !isFieldFilled(edu.endYear)) {
          toast.error(`Please enter end year or mark 'Currently Studying' for entry ${i + 1}`);
          return;
        }
      }
    }

    onSave(educations);
    handleClose();
  };

  const getTitle = (edu) => {
    if (!edu.level && !edu.degree && !edu.stream) return 'Untitled Education';
    const parts = [];
    if (edu.degree) parts.push(edu.degree);
    if (edu.stream) parts.push(edu.stream);
    const period = edu.startYear ? ` | ${edu.startYear} - ${edu.currentlyStudying ? 'Present' : edu.endYear || ''}` : '';
    return `${parts.join(' — ')}${period}`;
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Education Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <DragDropContext onDragEnd={(result) => {
            if (!result.destination) return;
            const reordered = reorder(educations, result.source.index, result.destination.index);
            setEducations(reordered);
          }}>
            <Droppable droppableId="educationList">
              {(provided) => (
                <Accordion defaultActiveKey="0" alwaysOpen {...provided.droppableProps} ref={provided.innerRef}>
                  {educations.map((edu, index) => (
                    <Draggable draggableId={`edu-${index}`} index={index} key={`edu-${index}`}>
                      {(provided) => (
                        <Accordion.Item
                          className="draggable-edu-item"
                          eventKey={index.toString()}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <Accordion.Header>
                            <div className="d-flex justify-content-between w-100 align-items-center">
                              <span {...provided.dragHandleProps}>{getTitle(edu)}</span>
                              <span className="reorder-buttons d-flex gap-2">
                                <Button
                                  variant="light"
                                  size="sm"
                                  disabled={index === 0}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveUp(index);
                                  }}
                                >⬆</Button>
                                <Button
                                  variant="light"
                                  size="sm"
                                  disabled={index === educations.length - 1}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveDown(index);
                                  }}
                                >⬇</Button>
                              </span>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <Row>
                              <Col md={6}>
                                <Form.Group>
                                  <Form.Label>Level *</Form.Label>
                                  <Form.Select
                                    value={edu.level}
                                    onChange={(e) => handleChange(index, 'level', e.target.value)}
                                  >
                                    <option value="">Select Level</option>
                                    {educationLevels.map((opt) => (
                                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group>
                                  <Form.Label>Degree</Form.Label>
                                  <Form.Control
                                    value={edu.degree}
                                    onChange={(e) => handleChange(index, 'degree', e.target.value)}
                                    placeholder="e.g. B.Tech, M.Sc"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Col md={6}>
                                <Form.Group>
                                  <Form.Label>Stream</Form.Label>
                                  <Form.Control
                                    value={edu.stream}
                                    onChange={(e) => handleChange(index, 'stream', e.target.value)}
                                    placeholder="e.g. Computer Science"
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group>
                                  <Form.Label>University *</Form.Label>
                                  <Form.Control
                                    value={edu.university}
                                    onChange={(e) => handleChange(index, 'university', e.target.value)}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Col md={4}>
                                <Form.Group>
                                  <Form.Label>Institute</Form.Label>
                                  <Form.Control
                                    value={edu.institute}
                                    onChange={(e) => handleChange(index, 'institute', e.target.value)}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group>
                                  <Form.Label>Start Year *</Form.Label>
                                  <Form.Select
                                    value={edu.startYear}
                                    onChange={(e) => handleChange(index, 'startYear', e.target.value)}
                                  >
                                    <option value="">Select</option>
                                    {yearOptions.map((year) => (
                                      <option key={year} value={year}>{year}</option>
                                    ))}
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group>
                                  <Form.Label>End Year</Form.Label>
                                  <Form.Select
                                    value={edu.endYear}
                                    onChange={(e) => handleChange(index, 'endYear', e.target.value)}
                                    disabled={edu.currentlyStudying}
                                  >
                                    <option value="">Select</option>
                                    {yearOptions.map((year) => (
                                      <option key={year} value={year}>{year}</option>
                                    ))}
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Col md={6}>
                                <Form.Group>
                                  <Form.Label>Percentage / Grade</Form.Label>
                                  <Form.Control
                                    value={edu.percentage}
                                    onChange={(e) => handleChange(index, 'percentage', e.target.value)}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6} className="d-flex align-items-end">
                                <Form.Check
                                  label="Currently Studying"
                                  checked={edu.currentlyStudying}
                                  onChange={(e) => handleChange(index, 'currentlyStudying', e.target.checked)}
                                />
                              </Col>
                            </Row>

                            {educations.length > 1 && (
                              <div className="text-end mt-3">
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => removeEducation(index)}
                                >
                                  Remove
                                </Button>
                              </div>
                            )}
                          </Accordion.Body>
                        </Accordion.Item>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Accordion>
              )}
            </Droppable>
          </DragDropContext>

          {educations.length < 4 && (
            <Button variant="link" onClick={addEducation} className="ps-0 mt-3">
              + Add another education
            </Button>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EducationFormModal;
