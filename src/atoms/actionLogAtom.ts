import { atomWithImmer } from 'jotai/immer';

interface ActionLogItem {
  type: 'select' | 'unselect';
  id: string;
}

export const actionLogAtom = atomWithImmer(new Array<ActionLogItem>());
