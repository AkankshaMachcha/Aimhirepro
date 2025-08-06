import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import { toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './css/ContactFormModal.css';

const ContactFormModal = ({ show, handleClose, onSave, initialData = {} }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    dateOfBirth: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        country: initialData.country || '',
        postalCode: initialData.postalCode || '',
        dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth) : null,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // yyyy-mm-dd
  };

  const handleSubmit = async () => {
    const { firstName, lastName, email, phoneNumber } = formData;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phoneNumber.trim()) {
      toast.error('Please fill all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (phoneNumber.length < 8) {
      toast.error('Phone number is too short.');
      return;
    }

    try {
      const payload = {
        ...formData,
        dateOfBirth: formatDate(formData.dateOfBirth),
      };

      await onSave(payload);
      toast.success('Contact information saved successfully!');
      handleClose();
    } catch (error) {
      toast.error('Something went wrong while saving.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Contact Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>First Name *</Form.Label>
                <Form.Control
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="e.g. John"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Last Name *</Form.Label>
                <Form.Control
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="e.g. Doe"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="e.g. john@example.com"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone Number *</Form.Label>
                <div className="phone-input-wrapper">
                  <PhoneInput
                    country={'in'}
                    value={formData.phoneNumber}
                    onChange={(value) => handleChange('phoneNumber', value)}
                    inputStyle={{ width: '100%' }}
                    containerStyle={{ width: '100%' }}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date of Birth</Form.Label>
                <DatePicker
                  value={formData.dateOfBirth}
                  onChange={(date) => handleChange('dateOfBirth', date)}
                  format="yyyy-MM-dd"
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  value={formData.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="e.g. 123 Main Street"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Control
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
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

export default ContactFormModal;
