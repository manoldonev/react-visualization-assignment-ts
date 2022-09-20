import { TargetStatistic } from '../../components';
import { BoxChart } from './BoxChart';
import { useActualValuesMemo } from './hooks';
import { useShapes } from './query/useShapes';
import { RedoButton } from './RedoButton';
import { ResetButton } from './ResetButton';
import { UndoButton } from './UndoButton';

const targetValue = 0.6;

const Dashboard = (): JSX.Element => {
  const { data: shapes, isLoading, isEmpty } = useShapes();
  const { actualOrangeValue, actualSmallValue } = useActualValuesMemo();

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

            <UndoButton className="mb-3 mr-3" />
            <RedoButton className="mb-3 mr-3" />
            <ResetButton className="mb-3" />
          </div>

          <BoxChart data={shapes} />
        </div>
      )}
    </main>
  );
};

export { Dashboard };
