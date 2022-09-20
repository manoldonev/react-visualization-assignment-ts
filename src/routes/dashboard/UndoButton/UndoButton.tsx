import { useAtom } from 'jotai';
import { Button } from '../../../components';
import { undoHistoryAtom, undoAtom } from '../atoms';

const UndoButton = ({ className = '' }: { className?: string }): JSX.Element => {
  const [undoHistory] = useAtom(undoHistoryAtom);
  const [, setUndo] = useAtom(undoAtom);

  return (
    <Button className={className} disabled={undoHistory.undos.length === 0} onClick={setUndo}>
      Undo
    </Button>
  );
};

export { UndoButton };
