import type { RectShape } from '../models/shape';
import { Box } from './Box';

const BoxList = ({ items, className = '' }: { items: RectShape[]; className?: string }): JSX.Element => {
  return (
    <div className={`${className}`}>
      <div className="flex flex-wrap gap-4 max-w-5xl mx-auto">
        {items.map((item) => (
          <Box key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};

export { BoxList };
