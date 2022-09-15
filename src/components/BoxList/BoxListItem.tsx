import { useAtom } from 'jotai';
import type { KeyboardEvent } from 'react';
import { selectionAtom } from '../../atoms/selectionAtom';
import type { Color, RectShape } from '../../models/shape';

const mapColor = (color: Color, isSelected: boolean): string => {
  // NOTE: tailwind can only find classes that exist as complete unbroken strings in the source files.
  switch (color) {
    case 'blue':
      return isSelected ? 'fill-blue-500' : 'fill-blue-500/40';
    case 'green':
      return isSelected ? 'fill-green-500' : 'fill-green-500/40';
    case 'orange':
      return isSelected ? 'fill-orange-500' : 'fill-orange-500/40';
    default:
      throw new Error('Unknown color');
  }
};

const BoxListItem = ({ data }: { data: RectShape }): JSX.Element => {
  const [selection, setSelection] = useAtom(selectionAtom);
  const isSelected = selection.has(data.id);

  const handleSelection = (): void => {
    const newSelection = new Set(selection);
    if (isSelected) {
      newSelection.delete(data.id);
      setSelection(newSelection);
    } else {
      newSelection.add(data.id);
      setSelection(newSelection);
    }
  };

  const handleKeyUp = (e: KeyboardEvent<SVGSVGElement>): void => {
    if (e.key === ' ' || e.key === 'space') {
      handleSelection();
    }
  };

  return (
    <li>
      <svg
        className={`h-32 w-32 border-2 hover:cursor-pointer hover:border-slate-300 hover:bg-slate-50 ${
          isSelected ? 'border-fuchsia-400 bg-fuchsia-100/50 hover:border-fuchsia-400 hover:bg-fuchsia-100/50' : ''
        }`}
        viewBox="0 0 128 128"
        role="button"
        tabIndex={0}
        onClick={handleSelection}
        onKeyUp={(e) => handleKeyUp(e)}
      >
        {data.size === 'small' && (
          <rect x={48} y={48} className={`h-8 w-8 ${mapColor(data.color, isSelected)} stroke-black/10 stroke-[0.5]`} />
        )}
        {data.size === 'large' && (
          <rect
            x={32}
            y={32}
            className={`h-16 w-16 ${mapColor(data.color, isSelected)} stroke-black/10 stroke-[0.5]`}
          />
        )}
        {data.dot && <circle cx="50%" cy="50%" r={5} className="fill-white stroke-black/10 stroke-[0.5]" />}
      </svg>
    </li>
  );
};

export { BoxListItem };
