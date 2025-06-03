export interface Placeholder {
  id: string;
  type: 'title' | 'content' | 'footer' | 'slideNumber' | 'date' | 'custom';
  x: number;
  y: number;
  width: number;
  height: number;
  defaultStyle?: {
    fontSize?: number;
    fontFamily?: string;
    fontColor?: string;
    align?: 'left' | 'center' | 'right';
  };
}

export interface MasterLayout {
  id: string;
  name: string;
  placeholders: Placeholder[];
  background?: {
    color?: string;
    image?: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export interface SlideMaster {
  id: string;
  name: string;
  layouts: MasterLayout[];
  theme: Theme;
  isDefault?: boolean;
}