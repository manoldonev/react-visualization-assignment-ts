import { useAtom } from 'jotai';
import { undoStoreAtom, undoAtom } from '../atoms';

const UndoButton = ({ className = '' }: { className?: string }): JSX.Element => {
  const [undoLog] = useAtom(undoStoreAtom);
  const [, setUndoAtom] = useAtom(undoAtom);

  return (
    <button
      type="button"
      className={`h-12 w-24 rounded bg-blue-500 py-2 px-4 text-sm font-medium uppercase text-white enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      disabled={undoLog.length === 0}
      onClick={setUndoAtom}
    >
      Undo
    </button>
  );
};

export { UndoButton };
