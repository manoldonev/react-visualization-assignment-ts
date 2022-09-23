import { Button } from '../../../components';
import { useSelectController, useUndoHistoryStatus } from '../concerns/selection';

const RedoButton = ({ className = '' }: { className?: string }): JSX.Element => {
  const { canRedo } = useUndoHistoryStatus();
  const { redo } = useSelectController();

  return (
    <Button className={className} disabled={!canRedo} onClick={redo}>
      Redo
    </Button>
  );
};

export { RedoButton };
