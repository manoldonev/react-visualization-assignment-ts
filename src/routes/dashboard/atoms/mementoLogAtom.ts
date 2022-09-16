import { atomWithImmer } from 'jotai/immer';

interface MementoEntry {
  selection: Set<string>;
}

export const mementoLogAtom = atomWithImmer(new Array<MementoEntry>());
