import React, { useState, useEffect } from 'react';
import { Box, Paper, IconButton, Tooltip, Typography } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import RectangleIcon from '@mui/icons-material/Rectangle';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormatToolbar } from '../Toolbar/FormatToolbar';
import { BulletTextRenderer } from './BulletTextRenderer';
import type { Slide, TextElement, SlideElementTypes } from '../../types/slide.types';

interface SlideEditorProps {
  slide: Slide;
  onSlideUpdate: (slide: Slide) => void;
}

export const SlideEditor: React.FC<SlideEditorProps> = ({ slide, onSlideUpdate }) => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState('');
  const [elementStartSize, setElementStartSize] = useState({ width: 0, height: 0 });
  const [editingElementId, setEditingElementId] = useState<string | null>(null);

  const handleAddText = () => {
    const newTextElement: TextElement = {
      id: String(Date.now()),
      type: 'text',
      content: '項目1\n項目2\n項目3',
      x: 100,
      y: 100,
      width: 300,
      height: 100,
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
    
    // Enable text editing on double click
    const element = slide.elements.find(el => el.id === elementId);
    if (element?.type === 'text' && e.detail === 2) {
      setEditingElementId(elementId);
    }
  };

  const handleSlideClick = () => {
    setSelectedElementId(null);
    setEditingElementId(null);
  };

  const handleMouseDown = (elementId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = slide.elements.find(el => el.id === elementId);
    if (!element) return;

    // Don't start dragging if we're editing text
    if (editingElementId === elementId) return;

    setSelectedElementId(elementId);
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking on resize handles
    const handleSize = 8;
    const isNearRight = x >= element.width - handleSize;
    const isNearBottom = y >= element.height - handleSize;
    const isNearLeft = x <= handleSize;
    const isNearTop = y <= handleSize;
    
    if (isNearRight && isNearBottom) {
      setIsResizing(true);
      setResizeHandle('se');
    } else if (isNearLeft && isNearTop) {
      setIsResizing(true);
      setResizeHandle('nw');
    } else if (isNearRight && isNearTop) {
      setIsResizing(true);
      setResizeHandle('ne');
    } else if (isNearLeft && isNearBottom) {
      setIsResizing(true);
      setResizeHandle('sw');
    } else if (isNearRight) {
      setIsResizing(true);
      setResizeHandle('e');
    } else if (isNearBottom) {
      setIsResizing(true);
      setResizeHandle('s');
    } else if (isNearLeft) {
      setIsResizing(true);
      setResizeHandle('w');
    } else if (isNearTop) {
      setIsResizing(true);
      setResizeHandle('n');
    } else {
      setIsDragging(true);
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({ x: element.x, y: element.y });
    setElementStartSize({ width: element.width, height: element.height });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selectedElementId || (!isDragging && !isResizing)) return;

    const element = slide.elements.find(el => el.id === selectedElementId);
    if (!element) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    if (isDragging) {
      handleElementUpdate(selectedElementId, {
        x: Math.max(0, Math.min(960 - element.width, elementStart.x + deltaX)),
        y: Math.max(0, Math.min(540 - element.height, elementStart.y + deltaY))
      });
    } else if (isResizing) {
      let newWidth = elementStartSize.width;
      let newHeight = elementStartSize.height;
      let newX = element.x;
      let newY = element.y;

      switch (resizeHandle) {
        case 'e':
          newWidth = Math.max(50, elementStartSize.width + deltaX);
          break;
        case 's':
          newHeight = Math.max(50, elementStartSize.height + deltaY);
          break;
        case 'w':
          newWidth = Math.max(50, elementStartSize.width - deltaX);
          newX = elementStart.x + deltaX;
          break;
        case 'n':
          newHeight = Math.max(50, elementStartSize.height - deltaY);
          newY = elementStart.y + deltaY;
          break;
        case 'se':
          newWidth = Math.max(50, elementStartSize.width + deltaX);
          newHeight = Math.max(50, elementStartSize.height + deltaY);
          break;
        case 'nw':
          newWidth = Math.max(50, elementStartSize.width - deltaX);
          newHeight = Math.max(50, elementStartSize.height - deltaY);
          newX = elementStart.x + deltaX;
          newY = elementStart.y + deltaY;
          break;
        case 'ne':
          newWidth = Math.max(50, elementStartSize.width + deltaX);
          newHeight = Math.max(50, elementStartSize.height - deltaY);
          newY = elementStart.y + deltaY;
          break;
        case 'sw':
          newWidth = Math.max(50, elementStartSize.width - deltaX);
          newHeight = Math.max(50, elementStartSize.height + deltaY);
          newX = elementStart.x + deltaX;
          break;
      }

      handleElementUpdate(selectedElementId, {
        x: Math.max(0, newX),
        y: Math.max(0, newY),
        width: newWidth,
        height: newHeight
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  };

  const handleDeleteElement = () => {
    if (!selectedElementId) return;
    
    onSlideUpdate({
      ...slide,
      elements: slide.elements.filter(el => el.id !== selectedElementId)
    });
    
    setSelectedElementId(null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedElementId && (e.key === 'Delete' || e.key === 'Backspace')) {
        // Don't delete if we're editing text
        if ((e.target as HTMLElement).contentEditable === 'true') return;
        handleDeleteElement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, slide]);

  const selectedElement = selectedElementId 
    ? slide.elements.find(el => el.id === selectedElementId) as TextElement | undefined
    : null;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5', p: 2 }}>
      {selectedElement?.type === 'text' && (
        <FormatToolbar
          selectedElement={selectedElement}
          onElementUpdate={(updates) => handleElementUpdate(selectedElementId!, updates)}
        />
      )}
      
      <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
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
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {editingElementId && (
            <Typography variant="caption" color="text.secondary">
              テキストを編集中... (クリックで編集終了)
            </Typography>
          )}
          {!editingElementId && selectedElementId && (
            <Typography variant="caption" color="text.secondary">
              ドラッグで移動、ハンドルでリサイズ、ダブルクリックで編集
            </Typography>
          )}
          <Tooltip title="選択した要素を削除 (Delete)">
            <span>
              <IconButton 
                onClick={handleDeleteElement}
                disabled={!selectedElementId}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper
          elevation={3}
          onClick={handleSlideClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
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
              onMouseDown={(e) => handleMouseDown(element.id, e)}
              onClick={(e) => handleElementClick(element.id, e)}
              sx={{
                position: 'absolute',
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                zIndex: element.zIndex,
                cursor: selectedElementId === element.id ? 'move' : 'pointer',
                border: selectedElementId === element.id ? '2px solid #1976d2' : '1px solid transparent',
                padding: element.type === 'text' ? 1 : 0,
                '&:hover': {
                  border: '1px solid #90caf9',
                },
              }}
            >
              {element.type === 'text' && (
                <BulletTextRenderer
                  element={element}
                  isEditing={editingElementId === element.id}
                  onBlur={(content) => {
                    handleElementUpdate(element.id, { content });
                    setEditingElementId(null);
                  }}
                  onMouseDown={(e) => {
                    if (editingElementId === element.id) {
                      e.stopPropagation();
                    }
                  }}
                />
              )}
              {element.type === 'image' && (
                <img
                  src={element.src}
                  alt={element.alt || ''}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    userSelect: 'none',
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
              
              {/* Resize handles */}
              {selectedElementId === element.id && (
                <>
                  {/* Corners */}
                  <Box sx={{ position: 'absolute', top: -4, left: -4, width: 8, height: 8, bgcolor: '#1976d2', cursor: 'nw-resize' }} />
                  <Box sx={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, bgcolor: '#1976d2', cursor: 'ne-resize' }} />
                  <Box sx={{ position: 'absolute', bottom: -4, left: -4, width: 8, height: 8, bgcolor: '#1976d2', cursor: 'sw-resize' }} />
                  <Box sx={{ position: 'absolute', bottom: -4, right: -4, width: 8, height: 8, bgcolor: '#1976d2', cursor: 'se-resize' }} />
                  
                  {/* Edges */}
                  <Box sx={{ position: 'absolute', top: '50%', left: -4, width: 8, height: 8, bgcolor: '#1976d2', cursor: 'w-resize', transform: 'translateY(-50%)' }} />
                  <Box sx={{ position: 'absolute', top: '50%', right: -4, width: 8, height: 8, bgcolor: '#1976d2', cursor: 'e-resize', transform: 'translateY(-50%)' }} />
                  <Box sx={{ position: 'absolute', top: -4, left: '50%', width: 8, height: 8, bgcolor: '#1976d2', cursor: 'n-resize', transform: 'translateX(-50%)' }} />
                  <Box sx={{ position: 'absolute', bottom: -4, left: '50%', width: 8, height: 8, bgcolor: '#1976d2', cursor: 's-resize', transform: 'translateX(-50%)' }} />
                </>
              )}
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};