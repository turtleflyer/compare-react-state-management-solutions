import { atom } from 'recoil';
import type { RecoilState } from 'recoil';
import { getNextAtom } from './getNextAtom';

export const LINE_LENGTH = 60;
export const HOW_MANY_LINES = 60;
export const PIXEL_SIZE = 10;
export const defColor = '#f0f0f0';

export const pixelControlPrefix = 'pixel-control' as const;
export type PixelState = RecoilState<0 | 1>;
export const placeholderAtomForPixelControl: PixelState = atom({
  key: pixelControlPrefix,
  default: 0 as 0 | 1,
});

export const oneOfTwoAlternativesControlPrefs = [
  'first-alternative',
  'second-alternative',
] as const;
export type OneOfTwoAlternativesState = RecoilState<string>;
export type OneOfTwoAlternativesControlAtomsSet = [
  OneOfTwoAlternativesState | null,
  OneOfTwoAlternativesState | null
];
export const defOneOfTwoAlternativesControl = oneOfTwoAlternativesControlPrefs.map((p) =>
  getNextAtom(p, defColor)
) as OneOfTwoAlternativesControlAtomsSet;

export const placeholderAtomForAlternatives: OneOfTwoAlternativesState = atom({
  key: oneOfTwoAlternativesControlPrefs[0],
  default: defColor,
});

// It is not possible to make R extends RecoilState<unknown> because "__cTag" property of
// RecoilState

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CarryAtom<R extends RecoilState<any>> {
  atom: R;
}
const sendKeysControlPrefix = 'carry' as const;
type SendKeysState = RecoilState<CarryAtom<OneOfTwoAlternativesState> | null>;
export const sendAtomsControlAtoms = oneOfTwoAlternativesControlPrefs.map((pref, i) =>
  atom({
    key: `${sendKeysControlPrefix}-${pref}`,
    default: { atom: defOneOfTwoAlternativesControl[i] },
  })
) as [SendKeysState, SendKeysState];

const storeAtoms = [] as PixelState[];
interface StoreAtomsMethods {
  push: (newKey: PixelState) => void;
  get: (n: number) => PixelState;
}
export const storeAtomsMethods: StoreAtomsMethods = {
  push(newKey) {
    storeAtoms.push(newKey);
  },
  get(n) {
    return storeAtoms[n];
  },
};
