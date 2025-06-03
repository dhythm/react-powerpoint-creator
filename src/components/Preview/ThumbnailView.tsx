import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Slide } from '../../types/slide.types';

interface ThumbnailViewProps {
  slides: Slide[];
  selectedSlideId: string;
  onSelectSlide: (slideId: string) => void;
  onDeleteSlide: (slideId: string) => void;
}

export const ThumbnailView: React.FC<ThumbnailViewProps> = ({
  slides,
  selectedSlideId,
  onSelectSlide,
  onDeleteSlide,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      {slides.map((slide, index) => (
        <Box
          key={slide.id}
          sx={{
            mb: 2,
            position: 'relative',
            cursor: 'pointer',
            '&:hover .delete-button': {
              opacity: 1,
            },
          }}
          onClick={() => onSelectSlide(slide.id)}
        >
          <Paper
            elevation={selectedSlideId === slide.id ? 4 : 1}
            sx={{
              width: '100%',
              aspectRatio: '16/9',
              bgcolor: slide.background?.color || 'white',
              border: selectedSlideId === slide.id ? '2px solid' : '1px solid',
              borderColor: selectedSlideId === slide.id ? 'primary.main' : 'divider',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transform: 'scale(0.15)',
                transformOrigin: 'top left',
              }}
            >
              {slide.elements.map((element) => (
                <Box
                  key={element.id}
                  sx={{
                    position: 'absolute',
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    zIndex: element.zIndex,
                  }}
                >
                  {element.type === 'text' && (
                    <Box
                      sx={{
                        fontSize: element.fontSize,
                        fontFamily: element.fontFamily,
                        color: element.fontColor,
                        overflow: 'hidden',
                      }}
                    >
                      {element.content}
                    </Box>
                  )}
                  {element.type === 'shape' && (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: element.fillColor,
                        borderRadius: element.shapeType === 'circle' ? '50%' : 0,
                      }}
                    />
                  )}
                  {element.type === 'image' && (
                    <img
                      src={element.src}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Paper>
          
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 0.5,
              color: selectedSlideId === slide.id ? 'primary.main' : 'text.secondary',
            }}
          >
            スライド {index + 1}
          </Typography>

          {slides.length > 1 && (
            <IconButton
              className="delete-button"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSlide(slide.id);
              }}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                bgcolor: 'background.paper',
                opacity: 0,
                transition: 'opacity 0.2s',
                '&:hover': {
                  bgcolor: 'error.light',
                  color: 'white',
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
    </Box>
  );
};