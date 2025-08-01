const WhyChooseUsCard = ({ icon, title, description }) => {
  return (
    <div className='why-card'>
      <div className='why-icon'>{icon}</div>
      <h3 className='why-title'>{title}</h3>
      <p className='why-description'>{description}</p>
    </div>
  );
};

export default WhyChooseUsCard;
