import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Accordion, Card } from 'react-bootstrap';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import './css/ExperienceFormModal.css';

const MAX_TOTAL_WORDS = 60;

const emptyExperience = {
  jobTitle: '',
  companyName: '',
  jobType: 'FULL_TIME',
  startDate: null,
  endDate: null,
  currentlyWorking: false,
  totalYears: '',
  totalMonths: '',
  city: '',
  state: '',
  country: '',
  description: [], // Allow 0 to 3 bullets
};

const ExperienceFormModal = ({ show, handleClose, onSave, initialData = [] }) => {
  const [experienceList, setExperienceList] = useState([]);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      const paddedData = initialData.map((exp) => ({
        ...exp,
        startDate: exp.startDate ? new Date(exp.startDate) : null,
        endDate: exp.endDate ? new Date(exp.endDate) : null,
        description: Array.isArray(exp.description)
          ? exp.description.slice(0, 3)
          : typeof exp.description === 'string'
            ? exp.description.split(/[•\n]/).map(s => s.trim()).filter(Boolean).slice(0, 3)
            : [],
      }));
      setExperienceList(paddedData);
    } else {
      setExperienceList([{ ...emptyExperience }]);
    }
  }, [initialData]);


  const handleChange = (index, field, value) => {
    const updated = [...experienceList];
    updated[index][field] = value;
    setExperienceList(updated);
  };

  const handleBulletChange = (index, bulletIndex, value) => {
    const updated = [...experienceList];
    const currentDescription = [...(updated[index].description || [])];
    currentDescription[bulletIndex] = value;

    const totalWords = currentDescription
      .join(' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    if (totalWords > MAX_TOTAL_WORDS) {
      toast.error(`Maximum ${MAX_TOTAL_WORDS} words allowed across all bullet points.`);
      return;
    }

    updated[index].description = currentDescription;
    setExperienceList(updated);
  };

  const handleAddBullet = (index) => {
    const updated = [...experienceList];
    const current = [...(updated[index].description || [])];

    const totalWords = current.join(' ').trim().split(/\s+/).filter(Boolean).length;
    if (current.length >= 3) {
      toast.error('Maximum 3 bullet points allowed.');
      return;
    }
    if (totalWords >= MAX_TOTAL_WORDS) {
      toast.error(`Cannot add more bullets — already reached ${MAX_TOTAL_WORDS} words.`);
      return;
    }

    current.push('');
    updated[index].description = current;
    setExperienceList(updated);
  };

  const handleRemoveBullet = (expIndex, bulletIndex) => {
    const updated = [...experienceList];
    const current = [...(updated[expIndex].description || [])];
    current.splice(bulletIndex, 1);
    updated[expIndex].description = current;
    setExperienceList(updated);
  };

  const addExperience = () => {
    if (experienceList.length < 3) {
      setExperienceList([...experienceList, { ...emptyExperience }]);
    }
  };

  const removeExperience = (index) => {
    const updated = [...experienceList];
    updated.splice(index, 1);
    setExperienceList(updated);
  };

  const handleSubmit = () => {
    const serializedList = experienceList.map(exp => ({
      ...exp,
      startDate: exp.startDate ? exp.startDate.toISOString() : null,
      endDate: exp.endDate ? exp.endDate.toISOString() : null,
    }));

    for (let i = 0; i < serializedList.length; i++) {
      const exp = serializedList[i];
      const isFilled = Object.values(exp).some(val =>
        (typeof val === 'string' && val.trim() !== '') ||
        (typeof val === 'boolean' && val === true) ||
        val !== null
      );

      if (isFilled) {
        if (!exp.jobTitle.trim() || !exp.companyName.trim() || !exp.jobType.trim() || !exp.startDate) {
          toast.error(`Please fill all required fields in experience ${i + 1}`);
          return;
        }
      }

      const wordCount = (exp.description || []).join(' ').trim().split(/\s+/).filter(Boolean).length;
      if (wordCount > MAX_TOTAL_WORDS) {
        toast.error(`Experience ${i + 1} exceeds ${MAX_TOTAL_WORDS} word limit in description.`);
        return;
      }
    }

    onSave(serializedList);
    toast.success('Experience saved successfully!');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Experience Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Accordion>
          {experienceList.map((exp, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>
                {exp.jobTitle || 'Untitled Job'} — {exp.companyName || 'Company'}
              </Accordion.Header>
              <Accordion.Body>
                <Card className="mb-3 p-3 shadow-sm">
                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Job Title *</Form.Label>
                        <Form.Control
                          value={exp.jobTitle}
                          onChange={(e) => handleChange(index, 'jobTitle', e.target.value)}
                          placeholder="Software Developer"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Company Name *</Form.Label>
                        <Form.Control
                          value={exp.companyName}
                          onChange={(e) => handleChange(index, 'companyName', e.target.value)}
                          placeholder="Google"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Job Type *</Form.Label>
                        <Form.Select
                          value={exp.jobType}
                          onChange={(e) => handleChange(index, 'jobType', e.target.value)}
                        >
                          <option value="FULL_TIME">Full Time</option>
                          <option value="PART_TIME">Part Time</option>
                          <option value="INTERNSHIP">Internship</option>
                          <option value="FREELANCE">Freelance</option>
                          <option value="CONTRACT">Contract</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Label>Start Date *</Form.Label>
                      <DatePicker
                        label="Start Date"
                        value={exp.startDate}
                        onChange={(newDate) => handleChange(index, 'startDate', newDate)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Label>End Date</Form.Label>
                      <DatePicker
                        label="End Date"
                        value={exp.endDate}
                        onChange={(newDate) => handleChange(index, 'endDate', newDate)}
                        disabled={exp.currentlyWorking}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Check
                        label="Currently Working"
                        checked={exp.currentlyWorking}
                        onChange={(e) => handleChange(index, 'currentlyWorking', e.target.checked)}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Total Years</Form.Label>
                        <Form.Control
                          type="number"
                          value={exp.totalYears}
                          onChange={(e) => handleChange(index, 'totalYears', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Total Months</Form.Label>
                        <Form.Control
                          type="number"
                          value={exp.totalMonths}
                          onChange={(e) => handleChange(index, 'totalMonths', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          value={exp.city}
                          onChange={(e) => handleChange(index, 'city', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          value={exp.state}
                          onChange={(e) => handleChange(index, 'state', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                          value={exp.country}
                          onChange={(e) => handleChange(index, 'country', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mt-4">
                    <Form.Label>Job Description (Max 3 bullets, 60 words total)</Form.Label>
                    {exp.description.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="mb-2 position-relative">
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder={`Bullet ${bulletIndex + 1}`}
                          value={bullet}
                          maxLength={450}
                          onChange={(e) => handleBulletChange(index, bulletIndex, e.target.value)}
                        />
                        <div className="text-end small text-muted">
                          {bullet.length}/450
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
                    {exp.description.length < 3 && (
                      <Button
                        variant="link"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleAddBullet(index)}
                      >
                        + Add Bullet Point
                      </Button>
                    )}
                  </Form.Group>

                  {experienceList.length > 1 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="mt-3"
                      onClick={() => removeExperience(index)}
                    >
                      Remove This Experience
                    </Button>
                  )}
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        {experienceList.length < 3 && (
          <Button variant="link" onClick={addExperience} className="add-experience-btn mt-3">
            + Add Another Experience
          </Button>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save All</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExperienceFormModal;
