import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  Typography,
  Box,
} from '@mui/material';
import PptxGenJS from 'pptxgenjs';
import type { Presentation } from '../../types/slide.types';

interface PowerPointExporterProps {
  presentation: Presentation;
  open: boolean;
  onClose: () => void;
}

export const PowerPointExporter: React.FC<PowerPointExporterProps> = ({
  presentation,
  open,
  onClose,
}) => {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportToPowerPoint = async () => {
    setExporting(true);
    setProgress(0);

    try {
      const pptx = new PptxGenJS();
      pptx.author = 'PowerPoint Creator';
      pptx.company = 'React PowerPoint App';
      pptx.title = presentation.name;

      const totalSlides = presentation.slides.length;

      for (let i = 0; i < totalSlides; i++) {
        const slide = presentation.slides[i];
        const pptxSlide = pptx.addSlide();

        // スライド背景を設定
        if (slide.background?.color) {
          pptxSlide.background = { fill: slide.background.color };
        }

        // 各要素を追加
        for (const element of slide.elements) {
          if (element.type === 'text') {
            const options: any = {
              x: element.x / 96, // ピクセルをインチに変換
              y: element.y / 96,
              w: element.width / 96,
              h: element.height / 96,
              fontSize: element.fontSize,
              fontFace: element.fontFamily,
              color: element.fontColor.replace('#', ''),
              bold: element.bold || false,
              italic: element.italic || false,
              underline: element.underline || false,
              align: element.align || 'left',
              valign: 'top',
            };

            pptxSlide.addText(element.content, options);
          } else if (element.type === 'image') {
            pptxSlide.addImage({
              data: element.src,
              x: element.x / 96,
              y: element.y / 96,
              w: element.width / 96,
              h: element.height / 96,
            });
          } else if (element.type === 'shape') {
            const shapeOptions: any = {
              x: element.x / 96,
              y: element.y / 96,
              w: element.width / 96,
              h: element.height / 96,
              fill: { color: element.fillColor.replace('#', '') },
            };

            if (element.borderColor && element.borderWidth) {
              shapeOptions.line = {
                color: element.borderColor.replace('#', ''),
                width: element.borderWidth,
              };
            }

            if (element.shapeType === 'rectangle') {
              pptxSlide.addShape(pptx.ShapeType.rect, shapeOptions);
            } else if (element.shapeType === 'circle') {
              pptxSlide.addShape(pptx.ShapeType.ellipse, shapeOptions);
            }
          }
        }

        setProgress(((i + 1) / totalSlides) * 100);
      }

      // ファイルを保存
      await pptx.writeFile({ fileName: `${presentation.name}.pptx` });
      
      setExporting(false);
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>PowerPointにエクスポート</DialogTitle>
      <DialogContent>
        {exporting ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              エクスポート中...
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              {Math.round(progress)}%
            </Typography>
          </Box>
        ) : (
          <Typography>
            プレゼンテーション「{presentation.name}」をPowerPointファイルとしてエクスポートします。
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={exporting}>
          キャンセル
        </Button>
        <Button
          onClick={exportToPowerPoint}
          variant="contained"
          disabled={exporting}
        >
          エクスポート
        </Button>
      </DialogActions>
    </Dialog>
  );
};