// src/components/resumeBuilder/SectionCard.jsx
import React from 'react';
import '../../assets/css/SectionCard.css';
import { Dropdown } from 'react-bootstrap';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiEdit, FiArrowUp, FiArrowDown, FiEye, FiEyeOff } from 'react-icons/fi';

const SectionCard = ({
  section = {},
  onEdit = () => {},
  onReorder = () => {},
  onToggleVisibility = () => {},
}) => {
  const { id, label = 'Untitled Section', hidden = false } = section;

  const handleMenuClick = (action) => {
    if (action === 'edit') onEdit(id);
    else if (action === 'move-up') onReorder(id, 'up');
    else if (action === 'move-down') onReorder(id, 'down');
    else if (action === 'toggle-visibility') onToggleVisibility(id);
  };

  return (
    <div className={`section-card ${hidden ? 'hidden' : ''}`} onClick={() => onEdit(id)}>
      <span className="section-tittle" style={{textDecoration :'none'}}>
        {label}
        {hidden && <span className="hidden-tag">(Hidden)</span>}
      </span>

      <Dropdown onClick={(e) => e.stopPropagation()} className="section-dropdown">
        <Dropdown.Toggle
          as="span"
          className="dropdown-toggle-clean"
          bsPrefix="custom-toggle"
        >
          <BsThreeDotsVertical className="dots-icon" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleMenuClick('edit')}>
            <FiEdit className="dropdown-icon" />
            Edit
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleMenuClick('move-up')}>
            <FiArrowUp className="dropdown-icon" />
            Move Up
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleMenuClick('move-down')}>
            <FiArrowDown className="dropdown-icon" />
            Move Down
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleMenuClick('toggle-visibility')}>
            {hidden ? (
              <>
                <FiEye className="dropdown-icon" />
                Show Section
              </>
            ) : (
              <>
                <FiEyeOff className="dropdown-icon" />
                Hide Section
              </>
            )}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default SectionCard;
