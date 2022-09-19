import type { Patch } from 'immer';
import { atomWithImmer } from 'jotai/immer';

export const undoStoreAtom = atomWithImmer<Patch[]>([]);
