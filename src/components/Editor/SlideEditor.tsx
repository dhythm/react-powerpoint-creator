import React, { useState } from 'react';
import { Box, Paper, IconButton, Tooltip } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import RectangleIcon from '@mui/icons-material/Rectangle';
import type { Slide, TextElement, SlideElementTypes } from '../../types/slide.types';

interface SlideEditorProps {
  slide: Slide;
  onSlideUpdate: (slide: Slide) => void;
}

export const SlideEditor: React.FC<SlideEditorProps> = ({ slide, onSlideUpdate }) => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const handleAddText = () => {
    const newTextElement: TextElement = {
      id: String(Date.now()),
      type: 'text',
      content: 'テキストを入力',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      zIndex: slide.elements.length,
      fontSize: 24,
      fontFamily: 'Arial',
      fontColor: '#000000',
    };

    onSlideUpdate({
      ...slide,
      elements: [...slide.elements, newTextElement],
    });
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          onSlideUpdate({
            ...slide,
            elements: [...slide.elements, {
              id: String(Date.now()),
              type: 'image',
              src,
              x: 100,
              y: 100,
              width: 300,
              height: 200,
              zIndex: slide.elements.length,
            }],
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddShape = () => {
    onSlideUpdate({
      ...slide,
      elements: [...slide.elements, {
        id: String(Date.now()),
        type: 'shape',
        shapeType: 'rectangle',
        x: 100,
        y: 100,
        width: 200,
        height: 100,
        zIndex: slide.elements.length,
        fillColor: '#1976d2',
      }],
    });
  };

  const handleElementUpdate = (elementId: string, updates: Partial<SlideElementTypes>) => {
    onSlideUpdate({
      ...slide,
      elements: slide.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } as SlideElementTypes : el
      ),
    });
  };

  const handleElementClick = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElementId(elementId);
  };

  const handleSlideClick = () => {
    setSelectedElementId(null);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5', p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <Tooltip title="テキストを追加">
          <IconButton onClick={handleAddText}>
            <TextFieldsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="画像を追加">
          <IconButton onClick={handleAddImage}>
            <ImageIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="図形を追加">
          <IconButton onClick={handleAddShape}>
            <RectangleIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper
          elevation={3}
          onClick={handleSlideClick}
          sx={{
            width: '960px',
            height: '540px',
            bgcolor: slide.background?.color || 'white',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'default',
          }}
        >
          {slide.elements.map((element) => (
            <Box
              key={element.id}
              onClick={(e) => handleElementClick(element.id, e)}
              sx={{
                position: 'absolute',
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                zIndex: element.zIndex,
                cursor: 'move',
                border: selectedElementId === element.id ? '2px solid #1976d2' : 'none',
                padding: element.type === 'text' ? 1 : 0,
              }}
            >
              {element.type === 'text' && (
                <Box
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleElementUpdate(element.id, { content: e.currentTarget.textContent || '' })}
                  sx={{
                    fontSize: element.fontSize,
                    fontFamily: element.fontFamily,
                    color: element.fontColor,
                    fontWeight: element.bold ? 'bold' : 'normal',
                    fontStyle: element.italic ? 'italic' : 'normal',
                    textDecoration: element.underline ? 'underline' : 'none',
                    textAlign: element.align || 'left',
                    height: '100%',
                    outline: 'none',
                  }}
                >
                  {element.content}
                </Box>
              )}
              {element.type === 'image' && (
                <img
                  src={element.src}
                  alt={element.alt || ''}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              )}
              {element.type === 'shape' && (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: element.fillColor,
                    border: element.borderWidth ? `${element.borderWidth}px solid ${element.borderColor}` : 'none',
                    borderRadius: element.shapeType === 'circle' ? '50%' : 0,
                  }}
                />
              )}
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};