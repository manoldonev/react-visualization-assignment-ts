export type Color = 'blue' | 'green' | 'orange';
export type Size = 'small' | 'large';

export interface RectShape {
  id: string;
  color: Color;
  size: Size;
  dot: boolean;
}
