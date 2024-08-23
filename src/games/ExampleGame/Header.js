// Header.js
import React from 'react';

const Header = ({ blackWinRate, whiteWinRate }) => {
  return (
    <div style={styles.header}>
      <div style={styles.winRates}>
        <span>Black Cock Win Rate: {blackWinRate.toFixed(1)}%</span>
        <span>White Cock Win Rate: {whiteWinRate.toFixed(1)}%</span>
      </div>
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressBarFill, width: `${blackWinRate}%`, backgroundColor: 'black' }} />
        <div style={{ ...styles.progressBarFill, width: `${whiteWinRate}%`, backgroundColor: 'white' }} />
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: '10px',
    color: 'white',
    borderBottom: '1px solid #F4A200',
    marginBottom: '10px',
  },
  winRates: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '600px',
    fontSize: '18px',
    marginBottom: '5px',
  },
  progressBar: {
    width: '100%',
    maxWidth: '600px',
    height: '10px',
    backgroundColor: '#333',
    borderRadius: '5px',
    overflow: 'hidden',
    display: 'flex',
  },
  progressBarFill: {
    height: '100%',
  },
};

export default Header;
