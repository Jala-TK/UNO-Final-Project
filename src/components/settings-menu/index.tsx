import React, { useState } from 'react';
import SettingsMenu from './menu';
import InfoDisplay from './info-display';


const SettingsToogle: React.FC = () => {
  const [info, setInfo] = useState({ title: '', content: '' });
  const [infoVisible, setInfoVisible] = useState(false);

  const handleButtonClick = (type: string) => {
    if (type === 'info1') {
      setInfo({ title: 'Max Players', content: '10' });
    } else if (type === 'info2') {
      setInfo({ title: 'Volume', content: '' });
    }
    setInfoVisible(!infoVisible);
  };

  const handleCloseInfo = () => {
    setInfoVisible(false);
  };

  return (
    <div>
      <SettingsMenu onButtonClick={handleButtonClick} />
      {infoVisible && <InfoDisplay title={info.title} content={info.content} onClose={handleCloseInfo} />}
    </div>
  );
};

export default SettingsToogle;
