import { Button } from '../../../components';
import { useSelectController, useUndoHistoryStatus } from '../atoms/selection';

const ResetButton = ({ className = '' }: { className?: string }): JSX.Element => {
  const { canReset } = useUndoHistoryStatus();
  const { reset } = useSelectController();

  return (
    <Button className={className} disabled={!canReset} onClick={reset}>
      Reset
    </Button>
  );
};

export { ResetButton };
