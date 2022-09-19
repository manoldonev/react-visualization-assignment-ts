import { enableMapSet, enablePatches } from 'immer';

export const initializeImmer = (): void => {
  enablePatches();
  enableMapSet();
};
