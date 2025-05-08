import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onSectionSelect }) => {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="hamburger" onClick={toggleSidebar}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      <div className={`sidebar ${open ? 'open' : ''}`}>
      <div className="menu-container">
    <ul>
      <li onClick={() => onSectionSelect("home")}>Home</li>
      <li onClick={() => onSectionSelect("about")}>About</li>
      <li onClick={() => onSectionSelect("services")}>Services</li>
      <li onClick={() => onSectionSelect("impact")}>Impact</li>
      <li onClick={() => onSectionSelect("investor")}>Investor</li>
      <li onClick={() => onSectionSelect("certifications")}>Certifications</li>
      <li onClick={() => onSectionSelect("why")}>Why Choose</li>
      <li onClick={() => onSectionSelect("testimonials")}>Testimonials</li>
      <li onClick={() => onSectionSelect("partners")}>Partners</li>
      <li onClick={() => onSectionSelect("footer")}>Contact</li>
    </ul>
  </div>
      </div>
    </>
  );
};

export default Sidebar;
