import { useAtom } from 'jotai';
import type { RectShape } from '../../../models/shape';
import { BoxButton } from '../../../components/BoxButton';
import { selectedItemsAtom } from '../atoms';
import { toggleSelectionAtom } from '../atoms/toggleSelectionAtom';

const BoxChart = ({ data }: { data: RectShape[] | undefined }): JSX.Element => {
  const [selectedItems] = useAtom(selectedItemsAtom);
  const [, setToggleSelection] = useAtom(toggleSelectionAtom);

  return (
    <ul className="flex max-w-5xl flex-wrap gap-x-2 gap-y-3">
      {data?.map((item) => (
        <li key={item.id}>
          <BoxButton data={item} isChecked={selectedItems.has(item.id)} onClick={() => setToggleSelection(item.id)} />
        </li>
      ))}
    </ul>
  );
};

export { BoxChart };
