import { SmallTargetStatistic } from '../components/SmallTargetStatistic';
import { Box } from '../components/Box';
import { getShapes } from '../models/shape';

const App = (): JSX.Element => {
  const shapes = getShapes();

  return (
    <main className="min-h-screen">
      <h1 className="m-4">Visualization Assignment</h1>

      <div className="mx-auto flex w-fit flex-col p-4">
        <SmallTargetStatistic target={0.6} className="mx-auto" />
        <div className="flex max-w-5xl flex-wrap gap-x-2 gap-y-3">
          {shapes.map((item) => (
            <Box key={item.id} data={item} />
          ))}
        </div>
      </div>
    </main>
  );
};

export { App };
