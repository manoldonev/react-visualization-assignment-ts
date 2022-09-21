import { useAtom } from 'jotai';
import { Button } from '../../../components';
import { canRedoAtom, useSelectController } from '../atoms';

const RedoButton = ({ className = '' }: { className?: string }): JSX.Element => {
  const [canRedo] = useAtom(canRedoAtom);
  const { redo } = useSelectController();

  return (
    <Button className={className} disabled={!canRedo} onClick={redo}>
      Redo
    </Button>
  );
};

export { RedoButton };
