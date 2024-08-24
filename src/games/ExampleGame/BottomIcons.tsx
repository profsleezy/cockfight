import React, { useState, useEffect } from 'react';
import icon1 from './icon1.svg';
import icon2 from './icon2.svg';
import icon3 from './icon3.svg';

const BottomIcons: React.FC = () => {
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const iconLinks = [
    { src: icon1, url: 'https://x.com/degencockfights' },
    { src: icon2, url: 'https://www.example2.com' },
    { src: icon3, url: 'https://t.me/degencockfight' },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Set initial screen size
    handleResize();

    // Add event listener to handle screen resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      style={{
        ...styles.container,
        ...(isMobile ? styles.mobileContainer : {}),
      }}
    >
      {iconLinks.map((icon, index) => (
        <a
          key={index}
          href={icon.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <img
            src={icon.src}
            alt={`Icon ${index + 1}`}
            style={{
              ...styles.icon,
              ...(hoveredIcon === index ? styles.iconHover : {}),
              ...(isMobile ? styles.mobileIcon : {}),
            }}
            onMouseEnter={() => setHoveredIcon(index)}
            onMouseLeave={() => setHoveredIcon(null)}
          />
        </a>
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '2%',
    left: '2%',
    display: 'flex',
    gap: '10px',
    zIndex: 1000,
  },
  mobileContainer: {
    left: 'unset',
    right: '2%',
  },
  icon: {
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    filter: 'invert(100%)',
    transition: 'filter 0.3s ease',
  },
  mobileIcon: {
    width: '30px',
    height: '30px',
  },
  iconHover: {
    filter: 'invert(50%)',
  },
};

export default BottomIcons;
