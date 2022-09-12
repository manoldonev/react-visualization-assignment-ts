import { atom } from 'jotai';

export const selectionAtom = atom(new Set<string>());
