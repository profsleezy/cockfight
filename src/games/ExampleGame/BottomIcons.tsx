// BottomIcons.tsx
import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Icon1 from './icon1.svg';
import Icon2 from './icon2.svg';
import Icon3 from './icon3.svg';
import './BottomIcons.css'; // Import the CSS for styling

const BottomIcons: React.FC = () => {
  return (
    <div className="icon-container">
      <Icon1 className="bottom-icon" />
      <Icon2 className="bottom-icon" />
      <Icon3 className="bottom-icon" />
    </div>
  );
};

export default BottomIcons;
