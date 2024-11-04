import React, { useState } from 'react';
import { 
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Tooltip,
  Zoom,
  Typography
} from '@mui/material';
import { ZoomIn, ZoomOut } from '@mui/icons-material';

// Add PropTypes for better type checking
import PropTypes from 'prop-types';

const ImageResize = ({ 
  src, 
  alt = "Resizable image",
  maxHeight = 600,
  thumbnailHeight = 200 
}) => {
  const [isLarge, setIsLarge] = useState(false);
  const [error, setError] = useState(false);

  const toggleSize = () => {
    setIsLarge(!isLarge);
  };

  const handleImageError = () => {
    setError(true);
  };

  if (error) {
    return (
      <Card sx={{ maxWidth: 300, p: 2 }}>
        <Typography color="error" align="center">
          Failed to load image
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: isLarge ? '100%' : 300, transition: 'all 0.3s ease' }}>
      <CardMedia
        component="img"
        image={src}
        alt={alt}
        onError={handleImageError}
        sx={{
          height: isLarge ? maxHeight : thumbnailHeight,
          width: '100%',
          transition: 'all 0.3s ease',
          objectFit: 'cover'
        }}
      />
      <CardActions sx={{ justifyContent: 'center', p: 2 }}>
        <Tooltip 
          title={isLarge ? "Show Thumbnail" : "Show Full Size"} 
          TransitionComponent={Zoom}
        >
          <IconButton 
            onClick={toggleSize}
            color="primary"
            size="large"
          >
            {isLarge ? <ZoomOut /> : <ZoomIn />}
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

ImageResize.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  maxHeight: PropTypes.number,
  thumbnailHeight: PropTypes.number
};

export default ImageResize;