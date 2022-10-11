import { memo } from 'react';
import { BoxButton } from '../../../components';
import type { RectShape } from '../../../models/shape';
import { useSelectController } from '../atoms/selection';

const BoxChartItem = ({ data, isSelected }: { data: RectShape; isSelected: boolean }): JSX.Element => {
  const { toggle: toggleSelection } = useSelectController();

  return (
    <li>
      <BoxButton data={data} isChecked={isSelected} onClick={() => toggleSelection(data.id)} />
    </li>
  );
};

const MemoBoxChartItem = memo(BoxChartItem);

export { MemoBoxChartItem };
