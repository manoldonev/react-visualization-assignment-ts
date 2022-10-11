import { RedoButton } from '../RedoButton';
import { ResetButton } from '../ResetButton';
import { UndoButton } from '../UndoButton';

const CommandBar = ({ className = '' }: { className?: string }): JSX.Element => {
  return (
    <div className={className}>
      <UndoButton />
      <RedoButton />
      <ResetButton />
    </div>
  );
};

export { CommandBar };
