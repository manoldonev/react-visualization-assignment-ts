import type { Color, RectShape } from '../models/shape';

// NOTE: tailwind can only find classes that exist as complete unbroken strings in the source files.
const mapColor = (color: Color): string => {
  switch (color) {
    case 'blue':
      return 'fill-blue-500/40';
    case 'green':
      return 'fill-green-500/40';
    case 'orange':
      return 'fill-orange-500/40';
    default:
      throw new Error('Unknown color');
  }
};

const Box = ({ data }: { data: RectShape }): JSX.Element => {
  return (
    <svg
      className="hover:cursor-pointer hover:bg-slate-50 hover:border-slate-300 border h-32 w-32"
      viewBox="0 0 128 128"
    >
      {data.size === 'small' && (
        <rect x={48} y={48} className={`h-8 w-8 ${mapColor(data.color)} stroke-slate-400/40`} />
      )}
      {data.size === 'large' && (
        <rect x={32} y={32} className={`h-16 w-16 ${mapColor(data.color)} stroke-slate-400/40`} />
      )}
      {data.dot && <circle cx="50%" cy="50%" r={5} className="fill-white stroke-slate-400/40" />}
    </svg>
  );
};

export { Box };
