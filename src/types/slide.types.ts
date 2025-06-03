export interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex: number;
}

export interface TextElement extends SlideElement {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  bulletPoints?: boolean;
  bulletStyle?: 'disc' | 'circle' | 'square' | 'number' | 'letter';
  lineHeight?: number;
}

export interface ImageElement extends SlideElement {
  type: 'image';
  src: string;
  alt?: string;
}

export interface ShapeElement extends SlideElement {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'triangle' | 'arrow';
  fillColor: string;
  borderColor?: string;
  borderWidth?: number;
}

export type SlideElementTypes = TextElement | ImageElement | ShapeElement;

export interface Animation {
  id: string;
  elementId: string;
  type: 'fadeIn' | 'slideIn' | 'zoomIn' | 'bounce';
  duration: number;
  delay?: number;
}

export interface Slide {
  id: string;
  masterId: string;
  elements: SlideElementTypes[];
  animations?: Animation[];
  background?: {
    color?: string;
    image?: string;
  };
}

export interface Presentation {
  id: string;
  name: string;
  slides: Slide[];
  currentSlideId?: string;
  createdAt: Date;
  updatedAt: Date;
}