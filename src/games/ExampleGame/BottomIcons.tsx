// BottomIcons.tsx
import React from 'react';
import icon1 from './icon1.svg'; // Replace with your actual icon paths
import icon2 from './icon2.svg';
import icon3 from './icon3.svg';

const BottomIcons: React.FC = () => {
  return (
    <div style={styles.container}>
      <img src={icon1} alt="Icon 1" style={styles.icon} />
      <img src={icon2} alt="Icon 2" style={styles.icon} />
      <img src={icon3} alt="Icon 3" style={styles.icon} />
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '2%',
    right: '2%',
    display: 'flex',
    gap: '10px',
    zIndex: 1000, // Ensure the icons are on top of other content
  },
  icon: {
    width: '40px', // Adjust the size as needed
    height: '40px',
    cursor: 'pointer',
  },
};

export default BottomIcons;
