import { Button } from '../../../components';
import { useSelectController, useUndoHistoryStatus } from '../concerns';

const UndoButton = ({ className = '' }: { className?: string }): JSX.Element => {
  const { canUndo } = useUndoHistoryStatus();
  const { undo } = useSelectController();

  return (
    <Button className={className} disabled={!canUndo} onClick={undo}>
      Undo
    </Button>
  );
};

export { UndoButton };
