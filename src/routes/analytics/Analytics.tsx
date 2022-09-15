import { useAtom } from 'jotai';
import { actionLogAtom } from '../../atoms/actionLogAtom';
import { selectionAtom } from '../../atoms/selectionAtom';
import { BoxList, TargetStatistic } from '../../components';
import { useActualValuesComputation } from './hooks';
import { useShapes } from './query/useShapes';

const targetValue = 0.6;

const Analytics = (): JSX.Element => {
  const { data: shapes, isLoading, isEmpty } = useShapes();
  const [, setSelection] = useAtom(selectionAtom);
  const [actionLog, setActionLog] = useAtom(actionLogAtom);
  const { actualOrangeValue, actualSmallValue } = useActualValuesComputation();

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
    <main className="min-h-screen">
      <h1 className="m-4">Visualization Assignment</h1>

      {isLoading && <span className="p-4">Loading...</span>}
      {isEmpty && <span className="p-4">No data available</span>}

      {shapes != null && shapes.length > 0 && (
        <div className="mx-auto flex w-fit flex-col p-4">
          <div className="flex flex-col justify-center sm:flex-row">
            <TargetStatistic
              data-testid="small-target"
              targetLabel="Small Target"
              target={targetValue}
              actual={actualSmallValue}
            />
            <TargetStatistic
              data-testid="orange-target"
              targetLabel="Orange Target"
              target={targetValue}
              actual={actualOrangeValue}
            />

            <button
              type="button"
              className="mb-3 h-12 w-24 rounded bg-blue-500 py-2 px-4 text-sm font-medium uppercase text-white enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={actionLog.length === 0}
              onClick={handleUndoClick}
            >
              Undo
            </button>
          </div>
          <BoxList data={shapes} />
        </div>
      )}
    </main>
  );
};

export { Analytics };
