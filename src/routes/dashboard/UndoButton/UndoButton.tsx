import { useAtom } from 'jotai';
import { Button } from '../../../components';
import { canUndoAtom, useSelectController } from '../atoms';

const UndoButton = ({ className = '' }: { className?: string }): JSX.Element => {
  const [canUndo] = useAtom(canUndoAtom);
  const { undo } = useSelectController();

  return (
    <Button className={className} disabled={!canUndo} onClick={undo}>
      Undo
    </Button>
  );
};

export { UndoButton };
