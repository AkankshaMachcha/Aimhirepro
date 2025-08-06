import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Accordion } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import './css/LanguageFormModal.css';

const proficiencyOptions = ['BASIC', 'INTERMEDIATE', 'FLUENT', 'NATIVE'];

const LanguageFormModal = ({ show, handleClose, onSave, initialData = [] }) => {
  const [languages, setLanguages] = useState([
    { name: '', proficiency: '', isNative: false },
  ]);

  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      setLanguages(JSON.parse(JSON.stringify(initialData)));
    }
  }, [show]);

  const handleChange = (index, field, value) => {
    const updated = [...languages];
    const current = { ...updated[index] };

    if (field === 'isNative') {
      current.isNative = value;
      if (value) current.proficiency = 'NATIVE';
      else if (current.proficiency === 'NATIVE') current.proficiency = '';
    } else if (field === 'proficiency') {
      current.proficiency = value;
      current.isNative = value === 'NATIVE';
    } else {
      current[field] = value;
    }

    updated[index] = current;
    setLanguages(updated);
  };


  const addLanguage = () => {
    if (languages.length >= 10) {
      toast.info("Maximum of 10 languages allowed.");
      return;
    }
    setLanguages([...languages, { name: '', proficiency: '', isNative: false }]);
  };

  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    for (let i = 0; i < languages.length; i++) {
      const lang = languages[i];
      if (!lang.name?.trim()) {
        toast.error(`Language name is required for entry #${i + 1}`);
        return;
      }
      if (!lang.proficiency) {
        toast.error(`Proficiency is required for ${lang.name || 'entry #' + (i + 1)}`);
        return;
      }
    }

    onSave(languages);
    toast.success("Languages saved successfully!");
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
    const reordered = reorder(languages, result.source.index, result.destination.index);
    setLanguages(reordered);
  };

  const getTitle = (lang) => {
    if (!lang.name && !lang.proficiency) return 'Untitled Language';
    return `${lang.name || 'Untitled'}${lang.proficiency ? ` (${lang.proficiency})` : ''}`;
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Languages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="languages">
              {(provided) => (
                <Accordion alwaysOpen ref={provided.innerRef} {...provided.droppableProps}>
                  {languages.map((lang, index) => (
                    <Draggable draggableId={`lang-${index}`} index={index} key={`lang-${index}`}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="mb-2"
                        >
                          <Accordion.Item eventKey={index.toString()}>
                            <Accordion.Header {...provided.dragHandleProps}>
                              {getTitle(lang)}
                            </Accordion.Header>
                            <Accordion.Body>
                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Language Name *</Form.Label>
                                    <Form.Control
                                      value={lang.name}
                                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                                      placeholder="e.g. English"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Proficiency *</Form.Label>
                                    <Form.Select
                                      value={lang.proficiency}
                                      onChange={(e) => handleChange(index, 'proficiency', e.target.value)}
                                    >
                                      <option value="">Select level</option>
                                      {proficiencyOptions.map((option) => (
                                        <option key={option} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </Form.Select>
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Form.Check
                                className="mb-2"
                                label="Is Native Language"
                                checked={lang.isNative}
                                onChange={(e) => handleChange(index, 'isNative', e.target.checked)}
                              />
                              {languages.length > 1 && (
                                <div className="text-end">
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => removeLanguage(index)}
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

          {languages.length < 10 && (
            <Button variant="link" onClick={addLanguage} className="mt-3 ps-0">
              + Add another language
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

export default LanguageFormModal;
