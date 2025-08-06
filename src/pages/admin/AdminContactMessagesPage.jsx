import React, { useEffect, useState } from 'react';
import { getAllContactMessages, markMessageAsRead } from '../../services/contactService';
import { Modal, Table } from 'react-bootstrap';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import { toast } from 'react-toastify';
import '../../assets/css/AdminContactMessagesPage.css';

const AdminContactMessagePage = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchMessages = async () => {
        try {
            const res = await getAllContactMessages();
            // console.log(" Raw API Response:", res.data);
            const sorted = res.data
                .map((msg) => ({
                    ...msg,
                    isRead: msg.hasOwnProperty('isRead')
                        ? msg.isRead === true || msg.isRead === 1 || msg.isRead === '1'
                        : msg.read === true || msg.read === 1 || msg.read === '1'
                }))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setMessages(sorted);
        } catch (err) {
            toast.error('Failed to fetch messages');
        }
    };



    useEffect(() => {
        fetchMessages();
    }, []);

    const handleRowClick = async (message) => {
        setSelectedMessage(message);
        setShowModal(true);

        if (!message.isRead) {
            try {
                await markMessageAsRead(message.email, message.createdAt);
                setMessages((prev) =>
                    prev.map((m) =>
                        m.email === message.email && m.createdAt === message.createdAt
                            ? { ...m, isRead: true }
                            : m
                    )
                );
            } catch (err) {
                toast.error('Failed to mark message as read');
            }
        }
    };

    return (
        <div className="container mt-4 admin-contact-page">
            <h3 className="mb-4">User Contact Messages</h3>
            <Table hover responsive className="contact-message-table">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th></th> {/* Empty header for notification icon column */}
                    </tr>
                </thead>
                <tbody>
                    {messages.map((msg) => (
                        <tr
                            key={`${msg.email}-${msg.createdAt}`}
                            onClick={() => handleRowClick(msg)}
                            className={!msg.isRead ? 'unread-message-row' : ''}
                        >
                            <td>{msg.fullName}</td>
                            <td>{msg.email}</td>
                            <td>{msg.subject.length > 60 ? msg.subject.slice(0, 60) + '...' : msg.subject}</td>
                            <td>
                                {!msg.isRead && (
                                    <NotificationsActiveRoundedIcon className="unread-icon" />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Message Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMessage && (
                        <>
                            <h5>{selectedMessage.subject}</h5>
                            <p className="text-muted">
                                From: <strong>{selectedMessage.fullName}</strong> ({selectedMessage.email})
                            </p>
                            <hr />
                            <p>{selectedMessage.message}</p>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminContactMessagePage;
