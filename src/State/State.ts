import type { RecoilState } from 'recoil';
import { atom } from 'recoil';
import { getNextAtom } from '../helpers/getNextAtom';

export const DEF_GRID_SIZE = 10;
export const DEF_COLOR = '#AAAAAA';
export const INPUT_WAITING_DELAY = 3000;

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
  getNextAtom(p, DEF_COLOR)
) as OneOfTwoAlternativesControlAtomsSet;

export const placeholderAtomForAlternativesState: OneOfTwoAlternativesState = atom({
  key: oneOfTwoAlternativesControlPrefs[0],
  default: DEF_COLOR,
});

export const alternativesControlAtomsState = atom({
  key: 'alternativesControlAtoms',
  default: defOneOfTwoAlternativesControl,
});

export const gridSizeState = atom({
  key: 'gridSize',
  default: DEF_GRID_SIZE,
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
