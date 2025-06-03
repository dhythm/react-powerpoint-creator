import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { MainToolbar } from './components/Toolbar/MainToolbar';
import { SlideEditor } from './components/Editor/SlideEditor';
import { ThumbnailView } from './components/Preview/ThumbnailView';
import type { Slide, Presentation } from './types/slide.types';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const initialSlide: Slide = {
  id: '1',
  masterId: 'default',
  elements: [],
};

const initialPresentation: Presentation = {
  id: '1',
  name: '新しいプレゼンテーション',
  slides: [initialSlide],
  currentSlideId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

function App() {
  const [presentation, setPresentation] = useState<Presentation>(initialPresentation);
  const [selectedSlideId, setSelectedSlideId] = useState<string>('1');

  const handleSlideUpdate = (slideId: string, updatedSlide: Slide) => {
    setPresentation(prev => ({
      ...prev,
      slides: prev.slides.map(slide => 
        slide.id === slideId ? updatedSlide : slide
      ),
      updatedAt: new Date(),
    }));
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: String(Date.now()),
      masterId: 'default',
      elements: [],
    };
    
    setPresentation(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide],
      updatedAt: new Date(),
    }));
    
    setSelectedSlideId(newSlide.id);
  };

  const handleDeleteSlide = (slideId: string) => {
    if (presentation.slides.length <= 1) return;
    
    setPresentation(prev => {
      const newSlides = prev.slides.filter(slide => slide.id !== slideId);
      const deletedIndex = prev.slides.findIndex(slide => slide.id === slideId);
      const newSelectedId = deletedIndex > 0 
        ? newSlides[deletedIndex - 1].id 
        : newSlides[0].id;
      
      setSelectedSlideId(newSelectedId);
      
      return {
        ...prev,
        slides: newSlides,
        currentSlideId: newSelectedId,
        updatedAt: new Date(),
      };
    });
  };

  const currentSlide = presentation.slides.find(slide => slide.id === selectedSlideId) || presentation.slides[0];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <MainToolbar 
          presentation={presentation}
          onAddSlide={handleAddSlide}
        />
        
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Box sx={{ width: 200, borderRight: 1, borderColor: 'divider', overflowY: 'auto' }}>
            <ThumbnailView
              slides={presentation.slides}
              selectedSlideId={selectedSlideId}
              onSelectSlide={setSelectedSlideId}
              onDeleteSlide={handleDeleteSlide}
            />
          </Box>
          
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <SlideEditor
              slide={currentSlide}
              onSlideUpdate={(updatedSlide) => handleSlideUpdate(currentSlide.id, updatedSlide)}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App
