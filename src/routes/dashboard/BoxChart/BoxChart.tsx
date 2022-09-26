import { useAtomValue } from 'jotai';
import type { RectShape } from '../../../models/shape';
import { BoxButton } from '../../../components';
import { useSelectController, selectedItemsAtom } from '../atoms/selection';

const BoxChart = ({ className = '', data }: { className?: string; data: RectShape[] | undefined }): JSX.Element => {
  const selectedItems = useAtomValue(selectedItemsAtom);
  const { toggle: toggleSelection } = useSelectController();

  return (
    <ul className={`flex max-w-5xl flex-wrap gap-x-2 gap-y-3 ${className}`}>
      {data?.map((item) => (
        <li key={item.id}>
          <BoxButton data={item} isChecked={selectedItems.has(item.id)} onClick={() => toggleSelection(item.id)} />
        </li>
      ))}
    </ul>
  );
};

export { BoxChart };
