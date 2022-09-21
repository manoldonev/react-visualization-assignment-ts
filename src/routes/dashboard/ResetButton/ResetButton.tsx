import { useAtom } from 'jotai';
import { Button } from '../../../components';
import { canResetAtom, useSelectController } from '../atoms';

const ResetButton = ({ className = '' }: { className?: string }): JSX.Element => {
  const [canReset] = useAtom(canResetAtom);
  const { reset } = useSelectController();

  return (
    <Button className={className} disabled={!canReset} onClick={reset}>
      Reset
    </Button>
  );
};

export { ResetButton };
