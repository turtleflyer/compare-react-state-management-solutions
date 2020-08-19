import { atom } from 'recoil';
import type { RecoilState } from 'recoil';
import { getNextAtom } from './getNextAtom';

export const LINE_LENGTH = 60;
export const HOW_MANY_LINES = 60;
export const PIXEL_SIZE = 10;
export const pixelControlPrefix = 'pixel-control';
export const defColor = '#f0f0f0';

export type RecoilStringState = RecoilState<string>;
export type EvenAndOddAtoms = [RecoilStringState | null, RecoilStringState | null];
export interface CarryAtom<T> {
  atom: RecoilState<T>;
}
type RecoilStateCarryStringAtom = RecoilState<CarryAtom<string> | null>;
export const keysPrefs: [string, string] = ['even-control', 'odd-control'];
export const defAtoms = keysPrefs.map((p) => getNextAtom(p, defColor)) as EvenAndOddAtoms;
export const carryAtomsControlAtoms = keysPrefs.map((pref, i) =>
  atom({ key: `carry-${pref}`, default: { atom: defAtoms[i] } })
) as [RecoilStateCarryStringAtom, RecoilStateCarryStringAtom];

const storeAtoms = [] as RecoilState<0 | 1>[];
interface StoreAtomsMethods {
  push: (newKey: RecoilState<0 | 1>) => void;
  get: (n: number) => RecoilState<0 | 1>;
}
export const storeAtomsMethods: StoreAtomsMethods = {
  push(newKey) {
    storeAtoms.push(newKey);
  },
  get(n) {
    return storeAtoms[n];
  },
};
