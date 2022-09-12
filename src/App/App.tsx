import { Box } from '../components/Box';
import { getShapes } from '../models/shape';

const App = (): JSX.Element => {
  const shapes = getShapes();

  return (
    <main>
      <h1 className="m-4">Visualization assignment</h1>

      <div className="m-4">
        <div className=" mx-auto flex max-w-5xl flex-wrap gap-x-2 gap-y-3">
          {shapes.map((item) => (
            <Box key={item.id} data={item} />
          ))}
        </div>
      </div>
    </main>
  );
};

export { App };
