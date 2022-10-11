import { useAtomValue } from 'jotai';
import type { RectShape } from '../../../models/shape';
import { selectedItemsAtom } from '../atoms/selection';
import { MemoBoxChartItem } from './BoxChartItem';

const BoxChart = ({ className = '', data }: { className?: string; data: RectShape[] | undefined }): JSX.Element => {
  const selectedItems = useAtomValue(selectedItemsAtom);

  return (
    <ul className={`flex max-w-5xl flex-wrap gap-x-2 gap-y-3 ${className}`}>
      {data?.map((item) => (
        <MemoBoxChartItem key={item.id} data={item} isSelected={selectedItems.has(item.id)} />
      ))}
    </ul>
  );
};

export { BoxChart };
