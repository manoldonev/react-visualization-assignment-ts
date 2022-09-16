import { useAtom } from 'jotai';
import { mementoLogAtom, selectionAtom } from '../atoms';

const UndoButton = ({ className = '' }: { className?: string }): JSX.Element => {
  const [, setSelection] = useAtom(selectionAtom);
  const [mementoLog, setMementoLog] = useAtom(mementoLogAtom);

  const handleUndoClick = (): void => {
    setMementoLog((logDraft) => {
      const entryToRestore = logDraft.pop();
      if (entryToRestore == null) {
        return;
      }

      setSelection(new Set(entryToRestore.selection));
    });
  };

  return (
    <button
      type="button"
      className={`h-12 w-24 rounded bg-blue-500 py-2 px-4 text-sm font-medium uppercase text-white enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      disabled={mementoLog.length === 0}
      onClick={handleUndoClick}
    >
      Undo
    </button>
  );
};

export { UndoButton };
