import { useAtom } from 'jotai';
import type { RectShape } from '../../../models/shape';
import { BoxButton } from '../../../components';
import { useSelectController, selectedItemsAtom } from '../atoms';

const BoxChart = ({ className = '', data }: { className?: string; data: RectShape[] | undefined }): JSX.Element => {
  const [selectedItems] = useAtom(selectedItemsAtom);
  const { toggleSelection } = useSelectController();

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
