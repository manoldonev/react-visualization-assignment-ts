import { useAtom } from 'jotai';
import { Button } from '../../../components';
import { undoHistoryAtom, resetAtom } from '../atoms';

const ResetButton = ({ className = '' }: { className?: string }): JSX.Element => {
  const [undoHistory] = useAtom(undoHistoryAtom);
  const [, setReset] = useAtom(resetAtom);

  return (
    <Button
      className={className}
      disabled={undoHistory.undos.length === 0 && undoHistory.redos.length === 0}
      onClick={setReset}
    >
      Reset
    </Button>
  );
};

export { ResetButton };
