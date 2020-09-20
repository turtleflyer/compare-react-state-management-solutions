import type { PixelState } from './State';

const storeAtoms = [] as PixelState[];
let curIndex = 0;
interface StoreAtomsMethods {
  push: (newAtom: PixelState) => void;
  get: (n: number) => PixelState;
  getNext: () => PixelState;
  resetIndex: () => void;
}
export const storeAtomsMethods: StoreAtomsMethods = {
  push(newAtom) {
    storeAtoms.push(newAtom);
  },
  get(n) {
    return storeAtoms[n];
  },
  getNext() {
    return storeAtoms[curIndex++];
  },
  resetIndex() {
    curIndex = 0;
  },
};
