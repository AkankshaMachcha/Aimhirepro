import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Accordion } from 'react-bootstrap';
import './css/SkillFormModal.css';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const skillCategories = [
  'TECHNICAL', 'SOFT', 'TOOL', 'FRAMEWORK', 'PLATFORM', 'DATABASE', 'MANAGEMENT', 'OTHER'
];

const SkillFormModal = ({ show, handleClose, onSave, initialData = [] }) => {
  const [skills, setSkills] = useState([{ skillName: '', category: '' }]);

  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      const grouped = [];

      initialData.forEach(({ skillName, category }) => {
        const existingGroup = grouped.find((g) => g.category === category);
        if (existingGroup) {
          existingGroup.skillName += `, ${skillName}`;
        } else {
          grouped.push({ skillName, category });
        }
      });

      setSkills(grouped);
    }
  }, [show]);

  const handleChange = (index, field, value) => {
    const updated = [...skills];
    updated[index][field] = value;
    setSkills(updated);
  };

  const addSkill = () => {
    if (skills.length < 10) {
      setSkills([...skills, { skillName: '', category: '' }]);
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const reorder = (list, startIdx, endIdx) => {
    const result = [...list];
    const [moved] = result.splice(startIdx, 1);
    result.splice(endIdx, 0, moved);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = reorder(skills, result.source.index, result.destination.index);
    setSkills(reordered);
  };

  const getHeaderTitle = (skill) => {
    if (!skill.skillName.trim()) return 'Untitled Skill';
    const names = skill.skillName.split(',').map((s) => s.trim());
    return names.slice(0, 2).join(', ');
  };

  const handleSubmit = () => {
    const expandedSkills = [];

    for (let i = 0; i < skills.length; i++) {
      const { skillName, category } = skills[i];

      if (!skillName.trim() || !category) {
        toast.error(`Please fill all fields in skill #${i + 1}`);
        return;
      }

      skillName
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .forEach((s) => {
          expandedSkills.push({ skillName: s, category });
        });
    }

    if (expandedSkills.length === 0) {
      toast.error('Please enter at least one skill.');
      return;
    }

    onSave(expandedSkills);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Skills</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="skillsList">
              {(provided) => (
                <Accordion ref={provided.innerRef} {...provided.droppableProps} alwaysOpen>
                  {skills.map((skill, index) => (
                    <Draggable draggableId={`skill-${index}`} index={index} key={`skill-${index}`}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="mb-2"
                        >
                          <Accordion.Item eventKey={index.toString()}>
                            <Accordion.Header {...provided.dragHandleProps}>
                              {getHeaderTitle(skill)}
                            </Accordion.Header>
                            <Accordion.Body>
                              <Form.Group className="mb-3">
                                <Form.Label>Skill Name(s) *</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={skill.skillName}
                                  onChange={(e) => handleChange(index, 'skillName', e.target.value)}
                                  placeholder="e.g. Java, Python"
                                />
                                <small className="text-muted">
                                  To group multiple skills under one section (e.g. SQL, MySQL), separate them with commas.
                                </small>
                              </Form.Group>

                              <Form.Group>
                                <Form.Label>Category *</Form.Label>
                                <Form.Select
                                  value={skill.category}
                                  onChange={(e) => handleChange(index, 'category', e.target.value)}
                                >
                                  <option value="">Select Category</option>
                                  {skillCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </Form.Select>
                              </Form.Group>

                              {skills.length > 1 && (
                                <div className="text-end mt-3">
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => removeSkill(index)}
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

          {skills.length < 10 && (
            <Button variant="link" onClick={addSkill} className="ps-0 mt-3">
              + Add another skill
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

export default SkillFormModal;
