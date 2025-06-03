import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import type { Presentation } from '../../types/slide.types';
import { PowerPointExporter } from '../Export/PowerPointExporter';

interface MainToolbarProps {
  presentation: Presentation;
  onAddSlide: () => void;
}

export const MainToolbar: React.FC<MainToolbarProps> = ({ presentation, onAddSlide }) => {
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);

  const handleSave = () => {
    const dataStr = JSON.stringify(presentation);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${presentation.name}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {presentation.name}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              startIcon={<AddIcon />}
              onClick={onAddSlide}
            >
              新規スライド
            </Button>
            
            <IconButton
              color="inherit"
              onClick={handleSave}
              title="保存"
            >
              <SaveIcon />
            </IconButton>
            
            <Button
              color="inherit"
              startIcon={<DownloadIcon />}
              onClick={() => setExportDialogOpen(true)}
            >
              エクスポート
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      <PowerPointExporter
        presentation={presentation}
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
      />
    </>
  );
};