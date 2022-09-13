import { useEffect, useRef } from 'react';

const useInitialRender = (): boolean => {
  const initialRender = useRef<boolean>(true);

  useEffect(() => {
    initialRender.current = false;
  }, []);

  return initialRender.current;
};

export { useInitialRender };
