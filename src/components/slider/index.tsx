import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

interface SliderComponentProps {
  onVolumeChange: (volume: number) => void;
}

const SliderComponent: React.FC<SliderComponentProps> = ({ onVolumeChange }) => {
  const [volume, setVolume] = React.useState(10);

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const newVolume = newValue as number;
    setVolume(newVolume);
    onVolumeChange(newVolume / 100);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Slider
        size="small"
        value={volume}
        onChange={handleVolumeChange}
        aria-label="Volume"
        valueLabelDisplay="auto"
        min={0}
        max={100}
      />
    </Box>
  );
};

export default SliderComponent;
