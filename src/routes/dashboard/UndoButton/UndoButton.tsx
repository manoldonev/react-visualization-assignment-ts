import { useAtom } from 'jotai';
import { actionLogAtom, selectionAtom } from '../../../atoms';

const UndoButton = ({ className = '' }: { className?: string }): JSX.Element => {
  const [, setSelection] = useAtom(selectionAtom);
  const [actionLog, setActionLog] = useAtom(actionLogAtom);

  const handleUndoClick = (): void => {
    setActionLog((logDraft) => {
      const actionToUndo = logDraft.pop();
      if (actionToUndo == null) {
        return;
      }

      setSelection((selectionDraft) => {
        if (actionToUndo.type === 'select') {
          // undoing select --> unselect
          selectionDraft.delete(actionToUndo.id);
        } else {
          // undoing unselect --> reselect
          selectionDraft.add(actionToUndo.id);
        }
      });
    });
  };

  return (
    <button
      type="button"
      className={`h-12 w-24 rounded bg-blue-500 py-2 px-4 text-sm font-medium uppercase text-white enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      disabled={actionLog.length === 0}
      onClick={handleUndoClick}
    >
      Undo
    </button>
  );
};

export { UndoButton };
