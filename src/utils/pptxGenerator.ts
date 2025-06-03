import PptxGenJS from 'pptxgenjs';
import type { Presentation, Slide, SlideElementTypes } from '../types/slide.types';
import type { SlideMaster } from '../types/master.types';

export class PowerPointGenerator {
  private pptx: PptxGenJS;

  constructor() {
    this.pptx = new PptxGenJS();
  }

  setMetadata(presentation: Presentation) {
    this.pptx.author = 'PowerPoint Creator';
    this.pptx.company = 'React PowerPoint App';
    this.pptx.title = presentation.name;
    this.pptx.subject = 'Generated Presentation';
  }

  defineSlideMaster(master: SlideMaster) {
    master.layouts.forEach(layout => {
      const masterOptions: any = {
        title: layout.name,
        background: layout.background ? { fill: layout.background.color } : undefined,
        objects: [],
      };

      layout.placeholders.forEach(placeholder => {
        const placeholderObj: any = {
          placeholder: {
            options: {
              name: placeholder.type,
              type: placeholder.type,
              x: placeholder.x / 96,
              y: placeholder.y / 96,
              w: placeholder.width / 96,
              h: placeholder.height / 96,
            },
          },
        };

        if (placeholder.defaultStyle) {
          placeholderObj.placeholder.options = {
            ...placeholderObj.placeholder.options,
            ...placeholder.defaultStyle,
          };
        }

        masterOptions.objects.push(placeholderObj);
      });

      this.pptx.defineSlideMaster(masterOptions);
    });
  }

  addSlide(slide: Slide, masterName?: string): PptxGenJS.Slide {
    const pptxSlide = this.pptx.addSlide(masterName ? { masterName } : undefined);

    if (slide.background?.color) {
      pptxSlide.background = { fill: slide.background.color };
    }

    slide.elements.forEach(element => {
      this.addElement(pptxSlide, element);
    });

    return pptxSlide;
  }

  private addElement(pptxSlide: PptxGenJS.Slide, element: SlideElementTypes) {
    switch (element.type) {
      case 'text':
        this.addTextElement(pptxSlide, element);
        break;
      case 'image':
        this.addImageElement(pptxSlide, element);
        break;
      case 'shape':
        this.addShapeElement(pptxSlide, element);
        break;
    }
  }

  private addTextElement(pptxSlide: PptxGenJS.Slide, element: SlideElementTypes) {
    if (element.type !== 'text') return;

    const options: PptxGenJS.TextPropsOptions = {
      x: element.x / 96,
      y: element.y / 96,
      w: element.width / 96,
      h: element.height / 96,
      fontSize: element.fontSize,
      fontFace: element.fontFamily,
      color: element.fontColor.replace('#', ''),
      bold: element.bold || false,
      italic: element.italic || false,
      underline: element.underline ? { style: 'sng' } : undefined,
      align: element.align || 'left',
      valign: 'top',
    };

    pptxSlide.addText(element.content, options);
  }

  private addImageElement(pptxSlide: PptxGenJS.Slide, element: SlideElementTypes) {
    if (element.type !== 'image') return;

    pptxSlide.addImage({
      data: element.src,
      x: element.x / 96,
      y: element.y / 96,
      w: element.width / 96,
      h: element.height / 96,
    });
  }

  private addShapeElement(pptxSlide: PptxGenJS.Slide, element: SlideElementTypes) {
    if (element.type !== 'shape') return;

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

    let shapeType: PptxGenJS.SHAPE_NAME;
    switch (element.shapeType) {
      case 'rectangle':
        shapeType = this.pptx.ShapeType.rect;
        break;
      case 'circle':
        shapeType = this.pptx.ShapeType.ellipse;
        break;
      case 'triangle':
        shapeType = this.pptx.ShapeType.triangle;
        break;
      case 'arrow':
        shapeType = this.pptx.ShapeType.rightArrow;
        break;
      default:
        shapeType = this.pptx.ShapeType.rect;
    }

    pptxSlide.addShape(shapeType, shapeOptions);
  }

  async exportToFile(fileName: string): Promise<void> {
    await this.pptx.writeFile({ fileName });
  }

  async exportToBlob(): Promise<Blob> {
    const data = await this.pptx.write({ outputType: 'blob' });
    return data as Blob;
  }
}