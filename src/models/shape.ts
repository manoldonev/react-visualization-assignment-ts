export type Color = 'blue' | 'green' | 'orange';
export type Size = 'small' | 'large';

export interface RectShape {
  id: string;
  color: Color;
  size: Size;
  dot: boolean;
}

const seed: RectShape[] = [
  {
    id: '1',
    color: 'green',
    size: 'large',
    dot: false,
  },
  { id: '2', color: 'blue', size: 'large', dot: true },
  { id: '3', color: 'orange', size: 'small', dot: true },
  { id: '4', color: 'orange', size: 'small', dot: true },
  { id: '5', color: 'orange', size: 'large', dot: false },
  { id: '6', color: 'green', size: 'large', dot: false },
  { id: '7', color: 'orange', size: 'large', dot: true },

  { id: '8', color: 'blue', size: 'small', dot: true },
  { id: '9', color: 'orange', size: 'small', dot: false },
  { id: '10', color: 'blue', size: 'large', dot: false },
  { id: '11', color: 'blue', size: 'small', dot: true },
  { id: '12', color: 'orange', size: 'small', dot: false },
  { id: '13', color: 'orange', size: 'large', dot: false },
  { id: '14', color: 'orange', size: 'large', dot: true },

  { id: '15', color: 'blue', size: 'small', dot: false },
  { id: '16', color: 'blue', size: 'large', dot: false },
  { id: '17', color: 'blue', size: 'small', dot: false },
  { id: '18', color: 'orange', size: 'small', dot: true },
  { id: '19', color: 'blue', size: 'large', dot: true },
  { id: '20', color: 'green', size: 'large', dot: true },
  { id: '21', color: 'blue', size: 'large', dot: false },
];

const getShapes = (): RectShape[] => {
  return seed;
};

export { getShapes };
