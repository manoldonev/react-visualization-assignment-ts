import { atomWithImmer } from 'jotai/immer';

export const selectionAtom = atomWithImmer(new Set<string>());
