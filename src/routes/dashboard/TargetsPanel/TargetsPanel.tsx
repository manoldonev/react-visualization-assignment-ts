import { useAtomValue } from 'jotai';
import { TargetStatistic } from '../../../components';
import { actualValuesAtom } from '../atoms/statistics';

const targetValue = 0.6;

const TargetsPanel = ({ className = '' }: { className?: string }): JSX.Element => {
  const { actualOrangeValue, actualSmallValue } = useAtomValue(actualValuesAtom);

  return (
    <div className={className}>
      <TargetStatistic
        data-testid="small-target"
        targetLabel="Small Target"
        target={targetValue}
        actual={actualSmallValue}
      />
      <TargetStatistic
        data-testid="orange-target"
        targetLabel="Orange Target"
        target={targetValue}
        actual={actualOrangeValue}
      />
    </div>
  );
};

export { TargetsPanel };
