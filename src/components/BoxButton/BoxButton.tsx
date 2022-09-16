import type { MouseEventHandler } from 'react';
import type { Color, RectShape } from '../../models/shape';

const mapColor = (color: Color, isChecked: boolean): string => {
  // NOTE: tailwind can only find classes that exist as complete unbroken strings in the source files.
  switch (color) {
    case 'blue':
      return isChecked ? 'fill-blue-500' : 'fill-blue-500/40';
    case 'green':
      return isChecked ? 'fill-green-500' : 'fill-green-500/40';
    case 'orange':
      return isChecked ? 'fill-orange-500' : 'fill-orange-500/40';
    default:
      throw new Error('Unknown color');
  }
};

const BoxButton = ({
  data,
  isChecked = false,
  onClick,
}: {
  data: RectShape;
  isChecked?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}): JSX.Element => {
  return (
    <button type="button" onClick={(e) => onClick?.(e)}>
      <svg
        className={`h-32 w-32 border-2 hover:cursor-pointer hover:border-slate-300 hover:bg-slate-50 ${
          isChecked ? 'border-fuchsia-400 bg-fuchsia-100/50 hover:border-fuchsia-400 hover:bg-fuchsia-100/50' : ''
        }`}
        viewBox="0 0 128 128"
      >
        {data.size === 'small' && (
          <rect x={48} y={48} className={`h-8 w-8 ${mapColor(data.color, isChecked)} stroke-black/10 stroke-[0.5]`} />
        )}
        {data.size === 'large' && (
          <rect x={32} y={32} className={`h-16 w-16 ${mapColor(data.color, isChecked)} stroke-black/10 stroke-[0.5]`} />
        )}
        {data.dot && <circle cx="50%" cy="50%" r={5} className="fill-white stroke-black/10 stroke-[0.5]" />}
      </svg>
    </button>
  );
};

export { BoxButton };
