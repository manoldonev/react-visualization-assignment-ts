import { useAtom } from 'jotai';
import { Button } from '../../../components';
import { undoHistoryAtom, redoAtom } from '../atoms';

const RedoButton = ({ className = '' }: { className?: string }): JSX.Element => {
  const [undoHistory] = useAtom(undoHistoryAtom);
  const [, setRedo] = useAtom(redoAtom);

  return (
    <Button className={className} disabled={undoHistory.redos.length === 0} onClick={setRedo}>
      Redo
    </Button>
  );
};

export { RedoButton };
