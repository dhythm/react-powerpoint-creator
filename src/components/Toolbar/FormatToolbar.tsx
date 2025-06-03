import React from 'react';
import { Box, IconButton, ToggleButton, ToggleButtonGroup, Tooltip, Select, MenuItem, FormControl } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import type { TextElement } from '../../types/slide.types';

interface FormatToolbarProps {
  selectedElement: TextElement | null;
  onElementUpdate: (updates: Partial<TextElement>) => void;
}

export const FormatToolbar: React.FC<FormatToolbarProps> = ({ selectedElement, onElementUpdate }) => {
  if (!selectedElement || selectedElement.type !== 'text') return null;

  const handleFormatChange = (format: string[], value: boolean | string) => {
    const updates: Partial<TextElement> = {};
    format.forEach(f => {
      updates[f as keyof TextElement] = value as any;
    });
    onElementUpdate(updates);
  };

  const handleAlignmentChange = (_: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    if (newAlignment) {
      onElementUpdate({ align: newAlignment as 'left' | 'center' | 'right' });
    }
  };

  const handleBulletToggle = () => {
    onElementUpdate({ 
      bulletPoints: !selectedElement.bulletPoints,
      bulletStyle: selectedElement.bulletStyle || 'disc'
    });
  };

  const handleBulletStyleChange = (style: string) => {
    onElementUpdate({ 
      bulletPoints: true,
      bulletStyle: style as 'disc' | 'circle' | 'square' | 'number' | 'letter'
    });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 1, 
      alignItems: 'center', 
      p: 1, 
      bgcolor: 'background.paper',
      borderRadius: 1,
      boxShadow: 1,
      mb: 1
    }}>
      {/* Text formatting */}
      <ToggleButtonGroup size="small">
        <ToggleButton 
          value="bold" 
          selected={selectedElement.bold || false}
          onClick={() => handleFormatChange(['bold'], !selectedElement.bold)}
        >
          <Tooltip title="太字 (Ctrl+B)">
            <FormatBoldIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton 
          value="italic" 
          selected={selectedElement.italic || false}
          onClick={() => handleFormatChange(['italic'], !selectedElement.italic)}
        >
          <Tooltip title="斜体 (Ctrl+I)">
            <FormatItalicIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton 
          value="underline" 
          selected={selectedElement.underline || false}
          onClick={() => handleFormatChange(['underline'], !selectedElement.underline)}
        >
          <Tooltip title="下線 (Ctrl+U)">
            <FormatUnderlinedIcon />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ width: 1, height: 24, bgcolor: 'divider' }} />

      {/* Alignment */}
      <ToggleButtonGroup
        value={selectedElement.align || 'left'}
        exclusive
        onChange={handleAlignmentChange}
        size="small"
      >
        <ToggleButton value="left">
          <Tooltip title="左揃え">
            <FormatAlignLeftIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="center">
          <Tooltip title="中央揃え">
            <FormatAlignCenterIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="right">
          <Tooltip title="右揃え">
            <FormatAlignRightIcon />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ width: 1, height: 24, bgcolor: 'divider' }} />

      {/* Bullet points */}
      <Tooltip title="箇条書き">
        <IconButton
          size="small"
          color={selectedElement.bulletPoints ? 'primary' : 'default'}
          onClick={handleBulletToggle}
        >
          {selectedElement.bulletStyle === 'number' || selectedElement.bulletStyle === 'letter' 
            ? <FormatListNumberedIcon /> 
            : <FormatListBulletedIcon />
          }
        </IconButton>
      </Tooltip>

      {selectedElement.bulletPoints && (
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select
            value={selectedElement.bulletStyle || 'disc'}
            onChange={(e) => handleBulletStyleChange(e.target.value)}
            size="small"
          >
            <MenuItem value="disc">● 黒丸</MenuItem>
            <MenuItem value="circle">○ 白丸</MenuItem>
            <MenuItem value="square">■ 四角</MenuItem>
            <MenuItem value="number">1. 数字</MenuItem>
            <MenuItem value="letter">A. 英字</MenuItem>
          </Select>
        </FormControl>
      )}
    </Box>
  );
};