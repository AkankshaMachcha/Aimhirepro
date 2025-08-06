import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Accordion, Row, Col } from 'react-bootstrap';
import './css/ProjectFormModal.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';

const MAX_DESCRIPTION_BULLETS = 3;
const MAX_TOTAL_WORDS = 60;
const MAX_CHARS_PER_BULLET = 150;

const ProjectFormModal = ({ show, handleClose, onSave, initialData = [] }) => {
  const [projects, setProjects] = useState([
    { title: '', techStack: '', githubLink: '', liveLink: '', description: [''] },
  ]);

  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      const parsed = initialData.map((proj) => ({
        ...proj,
        description: Array.isArray(proj.description)
          ? proj.description.slice(0, 3)
          : [''],
      }));
      setProjects(parsed);
    }
  }, [initialData]);

  const handleChange = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const handleBulletChange = (projIndex, bulletIndex, value) => {
    const updated = [...projects];
    const current = [...(updated[projIndex].description || [])];
    current[bulletIndex] = value;

    const totalWords = current.join(' ').trim().split(/\s+/).filter(Boolean).length;
    if (totalWords > MAX_TOTAL_WORDS) {
      toast.error(`Maximum ${MAX_TOTAL_WORDS} words allowed across all bullet points.`);
      return;
    }

    updated[projIndex].description = current;
    setProjects(updated);
  };

  const handleAddBullet = (projIndex) => {
    const updated = [...projects];
    const current = [...(updated[projIndex].description || [])];

    const totalWords = current.join(' ').trim().split(/\s+/).filter(Boolean).length;
    if (current.length >= MAX_DESCRIPTION_BULLETS) {
      toast.error(`Maximum ${MAX_DESCRIPTION_BULLETS} bullet points allowed.`);
      return;
    }
    if (totalWords >= MAX_TOTAL_WORDS) {
      toast.error(`Cannot add more bullets — already reached ${MAX_TOTAL_WORDS} words.`);
      return;
    }

    current.push('');
    updated[projIndex].description = current;
    setProjects(updated);
  };

  const handleRemoveBullet = (projIndex, bulletIndex) => {
    const updated = [...projects];
    const current = [...(updated[projIndex].description || [])];
    current.splice(bulletIndex, 1);
    updated[projIndex].description = current;
    setProjects(updated);
  };

  const addProject = () => {
    if (projects.length < 3) {
      setProjects([
        ...projects,
        { title: '', techStack: '', githubLink: '', liveLink: '', description: [''] },
      ]);
    }
  };

  const removeProject = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = reorder(projects, result.source.index, result.destination.index);
    setProjects(reordered);
  };

  const getTitle = (proj) => {
    if (!proj.title && !proj.techStack) return 'Untitled Project';
    return proj.title || 'Untitled Project';
  };

  const handleSubmit = () => {
    for (let i = 0; i < projects.length; i++) {
      const proj = projects[i];
      const validBullets = (proj.description || []).filter((desc) => desc.trim() !== '');
      const wordCount = (proj.description || []).join(' ').trim().split(/\s+/).filter(Boolean).length;

      if (validBullets.length === 0) {
        toast.error(`Please enter at least one description bullet in project ${i + 1}`);
        return;
      }
      if (wordCount > MAX_TOTAL_WORDS) {
        toast.error(`Project ${i + 1} exceeds ${MAX_TOTAL_WORDS} word limit in description.`);
        return;
      }
    }

    onSave(projects);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Project Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="projects">
              {(provided) => (
                <Accordion alwaysOpen ref={provided.innerRef} {...provided.droppableProps}>
                  {projects.map((proj, index) => (
                    <Draggable draggableId={`proj-${index}`} index={index} key={`proj-${index}`}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="mb-2"
                        >
                          <Accordion.Item eventKey={index.toString()}>
                            <Accordion.Header {...provided.dragHandleProps}>
                              {getTitle(proj)}
                            </Accordion.Header>
                            <Accordion.Body>
                              <Row>
                                <Col md={6}>
                                  <Form.Group>
                                    <Form.Label>Project Title *</Form.Label>
                                    <Form.Control
                                      value={proj.title}
                                      onChange={(e) => handleChange(index, 'title', e.target.value)}
                                      placeholder="e.g. Portfolio Website"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group>
                                    <Form.Label>Tech Stack</Form.Label>
                                    <Form.Control
                                      value={proj.techStack}
                                      onChange={(e) => handleChange(index, 'techStack', e.target.value)}
                                      placeholder="e.g. React, Node.js"
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Row className="mt-3">
                                <Col md={6}>
                                  <Form.Group>
                                    <Form.Label>GitHub Link</Form.Label>
                                    <Form.Control
                                      type="url"
                                      value={proj.githubLink}
                                      onChange={(e) => handleChange(index, 'githubLink', e.target.value)}
                                      placeholder="https://github.com/..."
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group>
                                    <Form.Label>Live Link</Form.Label>
                                    <Form.Control
                                      type="url"
                                      value={proj.liveLink}
                                      onChange={(e) => handleChange(index, 'liveLink', e.target.value)}
                                      placeholder="https://project.com"
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Form.Group className="mt-4">
                                <Form.Label>Project Description (max 3 bullets, 60 words total)</Form.Label>
                                {(proj.description || []).map((bullet, bulletIndex) => (
                                  <div key={bulletIndex} className="mb-2 position-relative">
                                    <Form.Control
                                      as="textarea"
                                      rows={2}
                                      placeholder={`Bullet ${bulletIndex + 1}`}
                                      value={bullet}
                                      maxLength={MAX_CHARS_PER_BULLET}
                                      onChange={(e) =>
                                        handleBulletChange(index, bulletIndex, e.target.value)
                                      }
                                    />
                                    <div className="text-end small text-muted">
                                      {bullet.length}/{MAX_CHARS_PER_BULLET}
                                    </div>
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      className="position-absolute top-0 end-0"
                                      onClick={() => handleRemoveBullet(index, bulletIndex)}
                                    >
                                      ×
                                    </Button>
                                  </div>
                                ))}
                                {(proj.description || []).length < MAX_DESCRIPTION_BULLETS && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="mt-1 ps-0"
                                    onClick={() => handleAddBullet(index)}
                                  >
                                    + Add Bullet Point
                                  </Button>
                                )}
                              </Form.Group>

                              {projects.length > 1 && (
                                <div className="text-end mt-3">
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => removeProject(index)}
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

          {projects.length < 3 && (
            <Button variant="link" onClick={addProject} className="ps-0 mt-3">
              + Add another project
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

export default ProjectFormModal;
