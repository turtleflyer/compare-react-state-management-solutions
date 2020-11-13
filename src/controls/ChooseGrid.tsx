import type { CSSProperties, FC } from 'react';
import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useMeasurePerformance } from 'use-measure-perf';
import { usePerfObserver } from 'use-perf-observer';
import { DelayedInput } from '../reusable-components/DelayedInput';
import { PerformanceInfo } from '../reusable-components/PerformanceInfo';
import { RenderInfo } from '../reusable-components/RenderInfo';
import {
  alternativeForChoiceAtoms,
  DEF_GRID_SIZE,
  getNextColorForAlternativeAtom,
  gridSizeAtom,
  rememberActiveChoiceAtom,
} from '../State/State';
import type { CarryAtom, ColorForAlternative, PixelChoice } from '../State/StateInterface';
import { storeAtomsMethods } from '../State/storeAtomsMethods';

export const ChooseGrid: FC<{ addStyle?: CSSProperties }> = ({ addStyle = {} }) => {
  const [gridSize, setGridSize] = useRecoilState(gridSizeAtom);
  const setActiveChoice = useSetRecoilState(rememberActiveChoiceAtom);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const setAlternatives = [0, 1].map((i) => useSetRecoilState(alternativeForChoiceAtoms[i]));
  const duration = useMeasurePerformance({ dependencies: [gridSize] });
  const [WrapDisplay, startMeasure] = usePerfObserver({ measureFromCreating: true });

  function inputCallback(input: string) {
    startMeasure();
    storeAtomsMethods.resetIndex();
    setGridSize(parseInt(input, 10));
    setActiveChoice(0);
    setAlternatives.forEach((set, i) => {
      set((prevState) => {
        if (!prevState) {
          return { atom: getNextColorForAlternativeAtom(i as PixelChoice) } as CarryAtom<
            ColorForAlternative
          >;
        }
        return prevState;
      });
    });
  }

  return (
    <div {...{ style: addStyle }}>
      <DelayedInput
        {...{
          label: 'input grid size: ',
          inputCallback,
          value: `${DEF_GRID_SIZE}`,
          addStyle: { marginBottom: '2px' },
        }}
      />
      <RenderInfo {...{ duration }} />
      <WrapDisplay>
        <PerformanceInfo {...{ data: null }} />
      </WrapDisplay>
    </div>
  );
};
