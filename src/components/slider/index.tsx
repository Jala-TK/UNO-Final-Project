import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';


const SliderComponent = () => {
  return (
    <Box sx={{ width: 100 }}>

      <Slider
        size="small"
        defaultValue={100}
        aria-label="Small"
        valueLabelDisplay="auto"
      />
    </Box>
  );
}

export default SliderComponent;