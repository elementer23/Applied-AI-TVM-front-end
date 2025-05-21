import React, { useRef } from 'react';

function RightSection() {
  const fileInputRef = useRef();

  const handleFileUpload = (e) => {
    // Handle file upload logic here
    const file = e.target.files[0];
    if (file) {
      alert(`Selected file: ${file.name}`);
    }
  };

  return (
    <div className="section right-section">
      <div className="section-header full-width-header">
        <img className='image-header' src="/images/tvmLogo.png" alt="Logo" />
        <img className='profile-header' src="/images/TVM_profile.png" alt="Profile" />
      </div>
      <div className="chat-section">
        <div className="chat-messages">
          {/* Chat messages will go here */}
          <img className='chat-image' src="/images/AI_profile.png" alt="Logo" />
          <div className="chat-message">
            <p className="message-text">Waar kan ik je mee van dienst zijn?</p>
          </div>
        </div>
      </div>
      <div className="chat-input-row">
        <input type="text" className="chat-input" placeholder="Tekstvak voor eventuele toelichting" />
        <button className="upload-btn" onClick={() => fileInputRef.current.click()}>Bestand uploaden</button>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
      </div>
    </div>
  );
}

export default RightSection;
