import React from 'react';
import { Box } from '@mui/material';
import type { TextElement } from '../../types/slide.types';

interface BulletTextRendererProps {
  element: TextElement;
  isEditing: boolean;
  onBlur: (content: string) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
}

export const BulletTextRenderer: React.FC<BulletTextRendererProps> = ({ 
  element, 
  isEditing, 
  onBlur,
  onMouseDown
}) => {
  // 改行で分割し、空の行も保持
  const lines = element.content.split('\n').map(line => line || '');
  
  const getBulletSymbol = (index: number) => {
    switch (element.bulletStyle) {
      case 'disc':
        return '●';
      case 'circle':
        return '○';
      case 'square':
        return '■';
      case 'number':
        return `${index + 1}.`;
      case 'letter':
        return `${String.fromCharCode(65 + index)}.`;
      default:
        return '●';
    }
  };

  if (!element.bulletPoints || isEditing) {
    return (
      <Box
        contentEditable={isEditing}
        suppressContentEditableWarning
        onMouseDown={onMouseDown}
        onBlur={(e) => {
          // innerTextを使用して改行を保持
          const text = e.currentTarget.innerText || '';
          onBlur(text);
        }}
        sx={{
          fontSize: element.fontSize,
          fontFamily: element.fontFamily,
          color: element.fontColor,
          fontWeight: element.bold ? 'bold' : 'normal',
          fontStyle: element.italic ? 'italic' : 'normal',
          textDecoration: element.underline ? 'underline' : 'none',
          textAlign: element.align || 'left',
          height: '100%',
          width: '100%',
          outline: isEditing ? '2px solid #1976d2' : 'none',
          cursor: isEditing ? 'text' : 'inherit',
          userSelect: isEditing ? 'text' : 'none',
          pointerEvents: isEditing ? 'auto' : 'none',
          whiteSpace: 'pre-wrap',
          lineHeight: element.lineHeight || 1.5,
        }}
      >
        {element.content}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        fontSize: element.fontSize,
        fontFamily: element.fontFamily,
        color: element.fontColor,
        fontWeight: element.bold ? 'bold' : 'normal',
        fontStyle: element.italic ? 'italic' : 'normal',
        textDecoration: element.underline ? 'underline' : 'none',
        textAlign: element.align || 'left',
        height: '100%',
        width: '100%',
        lineHeight: element.lineHeight || 1.5,
      }}
    >
      {lines.map((line, index) => {
        // 実際の箇条書き項目のインデックス（空行を除く）
        const bulletIndex = lines.slice(0, index).filter(l => l.trim()).length;
        
        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              mb: 0.5,
              minHeight: element.fontSize * (element.lineHeight || 1.5),
            }}
          >
            {line.trim() && (
              <>
                <Box
                  component="span"
                  sx={{
                    minWidth: '1.5em',
                    mr: 1,
                    flexShrink: 0,
                  }}
                >
                  {getBulletSymbol(bulletIndex)}
                </Box>
                <Box component="span" sx={{ flex: 1 }}>
                  {line}
                </Box>
              </>
            )}
            {!line.trim() && <Box component="span">&nbsp;</Box>}
          </Box>
        );
      })}
    </Box>
  );
};