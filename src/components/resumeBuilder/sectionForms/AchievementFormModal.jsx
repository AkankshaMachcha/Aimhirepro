import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Accordion } from 'react-bootstrap';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import './css/AchievementFormModal.css';

const AchievementFormModal = ({ show, handleClose, onSave, initialData = [] }) => {
  const [achievements, setAchievements] = useState([
    { title: '', description: '', date: null }
  ]);

  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      const parsed = initialData.map((ach) => ({
        ...ach,
        date: ach.date ? new Date(ach.date) : null,
      }));
      setAchievements(parsed);
    }
  }, [show]);

  const handleChange = (index, field, value) => {
    const updated = [...achievements];
    updated[index][field] = value;
    setAchievements(updated);
  };

  const addAchievement = () => {
    if (achievements.length < 5) {
      setAchievements([...achievements, { title: '', description: '', date: null }]);
    } else {
      toast.info("You can add up to 5 achievements only.");
    }
  };

  const removeAchievement = (index) => {
    const updated = achievements.filter((_, i) => i !== index);
    setAchievements(updated);
  };

  const getTitle = (ach) => {
    return ach.title?.trim() ? ach.title : 'Untitled Achievement';
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = reorder(achievements, result.source.index, result.destination.index);
    setAchievements(reordered);
  };

  const handleSubmit = () => {
    for (let i = 0; i < achievements.length; i++) {
      const ach = achievements[i];
      if (!ach.title?.trim()) {
        toast.error(`Title is required in achievement ${i + 1}`);
        return;
      }
      if (!ach.description?.trim()) {
        toast.error(`Description is required in achievement ${i + 1}`);
        return;
      }
    }

    const serialized = achievements.map((ach) => ({
      ...ach,
      date: ach.date ? ach.date.toISOString() : null,
    }));

    onSave(serialized);
    toast.success("Achievements saved successfully!");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Achievements</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="achievementList">
              {(provided) => (
                <Accordion ref={provided.innerRef} {...provided.droppableProps}>
                  {achievements.map((ach, index) => (
                    <Draggable draggableId={`ach-${index}`} index={index} key={`ach-${index}`}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} className="mb-2">
                          <Accordion.Item eventKey={index.toString()}>
                            <Accordion.Header {...provided.dragHandleProps}>
                              {getTitle(ach)}
                            </Accordion.Header>
                            <Accordion.Body>
                              <Form.Group className="mb-3">
                                <Form.Label>Title *</Form.Label>
                                <Form.Control
                                  value={ach.title}
                                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                                  placeholder="e.g. Best Intern of the Year"
                                />
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label>Description *</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={3}
                                  value={ach.description}
                                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                                  placeholder="Briefly describe your achievement (max 300 characters)"
                                  maxLength={300}
                                />
                                <div className="text-end small text-muted">
                                  {ach.description.length}/300
                                </div>
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label>Date (optional)</Form.Label>
                                <DatePicker
                                  value={ach.date}
                                  onChange={(date) => handleChange(index, 'date', date)}
                                  format="yyyy-MM-dd"
                                  slotProps={{ textField: { fullWidth: true } }}
                                  enableAccessibleFieldDOMStructure={false}
                                />
                              </Form.Group>

                              {achievements.length > 1 && (
                                <div className="text-end mt-2">
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => removeAchievement(index)}
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

          {achievements.length < 5 && (
            <Button variant="link" onClick={addAchievement} className="ps-0 mt-3">
              + Add another achievement
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

export default AchievementFormModal;
