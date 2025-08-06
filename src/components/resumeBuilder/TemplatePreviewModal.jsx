import { Modal, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from "react-redux";
import { updateTemplateName } from "../../redux/slices/resumeBuilderSlice";
import { toast } from "react-toastify";
import '../../assets/css/TemplatePreviewModal.css';

const templateList = [
    { key: 'DefaultTemplate', label: 'Default Template' },
    { key: 'LexingtonResumeTemplate', label: 'Lexington Resume' },

    { key: 'SalesProfessionalTemplate', label: 'Sales Professional' },
    { key: 'ProfessionalModernTemplate', label: 'Professional Modern' },
    { key: 'ModernProfileTemplate', label: 'Modern Profile' },
    { key: 'ClassicEleganceTemplate', label: 'Classic Elegance' },

];

const TemplatePreviewModal = ({ show, handleClose }) => {
    const dispatch = useDispatch();
    const editMode = useSelector(state => state.resumeBuilder.editMode);


    const handleSelect = (templateKey) => {
        if (editMode) {
            toast.info("You cannot change the template for an existing resume. Clone the resume to use a different template.");
            handleClose();
            return;
        }
        dispatch(updateTemplateName(templateKey));
        handleClose();
    };


    return (
        <Modal show={show} onHide={handleClose} size="xl" centered backdrop="static">

            <Modal.Body>
                <button className="template-close-button" onClick={handleClose}>&times;</button>
                <div className="template-intro text-center mb-4">
                    <h2 className="template-modal-title">Choose a template</h2>
                    <p className="template-modal-subtitle">
                        Our resume templates are based on what employers actually look for in a candidate.
                        They are designed to be ATS-friendly and recruiter-approved.
                    </p>
                </div>
                <Row>
                    {templateList.map(({ key, label }) => (
                        <Col xs={12} sm={6} md={4} lg={4} key={key} className="mb-4">
                            <div className="template-card" onClick={() => handleSelect(key)}>
                                <div className="thumbnail-wrapper">
                                    <img
                                        src={`/assets/thumbnails/${key}.png`}
                                        alt={label}
                                        className="template-thumbnail"
                                    />
                                    {/* <div className="overlay">
                                        <button className="use-button" onClick={() => handleSelect(key)}>
                                            Use Template
                                        </button>
                                    </div> */}
                                </div>
                                <div className="template-name">{label}</div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default TemplatePreviewModal;
