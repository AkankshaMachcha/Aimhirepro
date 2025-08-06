// ✅ src/components/resumeBuilder/forms/PersonalLinkFormModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Accordion } from 'react-bootstrap';
import './css/PersonalLinkFormModal.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';


const PersonalLinkFormModal = ({ show, handleClose, onSave, initialData = [] }) => {
  const [links, setLinks] = useState([{ platform: '', url: '' }]);

  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      setLinks(JSON.parse(JSON.stringify(initialData)));
    }
  }, [show]);

  const handleChange = (index, field, value) => {
    const updated = [...links];
    updated[index][field] = value;
    setLinks(updated);
  };

  const addLink = () => {
    if (links.length < 10) {
      setLinks([...links, { platform: '', url: '' }]);
    }
  };

  const removeLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const filteredLinks = links.filter(
      (link) => link.platform.trim() !== '' && link.url.trim() !== ''
    );

    if (filteredLinks.length === 0) {
      toast.error('Please fill at least one valid personal link before saving.');
      return;
    }

    onSave(filteredLinks);
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
    const reordered = reorder(links, result.source.index, result.destination.index);
    setLinks(reordered);
  };

  const getTitle = (link) => {
    return link.platform?.trim() || 'Untitled Link';
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Personal Links</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="links">
              {(provided) => (
                <Accordion alwaysOpen ref={provided.innerRef} {...provided.droppableProps}>
                  {links.map((link, index) => (
                    <Draggable draggableId={`link-${index}`} index={index} key={`link-${index}`}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} className="mb-2">
                          <Accordion.Item eventKey={index.toString()}>
                            <Accordion.Header {...provided.dragHandleProps}>
                              {getTitle(link)}
                            </Accordion.Header>
                            <Accordion.Body>
                              <Row className="mb-3">
                                <Col md={6}>
                                  <Form.Group>
                                    <Form.Label>Platform *</Form.Label>
                                    <Form.Control
                                      type="text"
                                      value={link.platform}
                                      onChange={(e) =>
                                        handleChange(index, 'platform', e.target.value)
                                      }
                                      placeholder="e.g. LinkedIn"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group>
                                    <Form.Label>URL *</Form.Label>
                                    <Form.Control
                                      type="text"
                                      value={link.url}
                                      onChange={(e) =>
                                        handleChange(index, 'url', e.target.value)
                                      }
                                      placeholder="e.g. https://linkedin.com/in/username"
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              {links.length > 1 && (
                                <div className="text-end">
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => removeLink(index)}
                                  >
                                    Remove Link
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

          {links.length < 10 && (
            <Button variant="link" onClick={addLink} className="ps-0 mt-3">
              + Add another link
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

export default PersonalLinkFormModal;
