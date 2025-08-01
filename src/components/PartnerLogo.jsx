import React from 'react';

const PartnerLogo = ({ logo, name }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <img
        src={logo}
        alt={name}
        style={{
          maxHeight: '60px',
          maxWidth: '120px',
          objectFit: 'contain',
          opacity: 0.85,
          transition: 'transform 0.3s ease',
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      />
    </div>
  );
};

export default PartnerLogo;
