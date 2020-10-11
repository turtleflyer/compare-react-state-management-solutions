import type { FC } from 'react';
import React, { useCallback, useMemo } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Button } from '../reusable-components/Button';
import {
  alternativeForChoiceAtoms,
  getNextColorForAlternativeAtom,
  rememberActiveChoiceAtom,
} from '../State/State';
import type { CarryAtom, ColorForAlternative, PixelChoice } from '../State/StateInterface';

export const DisableEnableButtons: FC = () => {
  const setActiveChoice = useSetRecoilState(rememberActiveChoiceAtom);
  const alternativesState = [
    useRecoilState(alternativeForChoiceAtoms[0]),
    useRecoilState(alternativeForChoiceAtoms[1]),
  ] as const;

  const getEvenOrOddRowSwitch: (evenOrOdd: PixelChoice) => () => void = useCallback(
    (evenOrOdd) => {
      return () => {
        const prevAtom = alternativesState[evenOrOdd][0];
        if (!prevAtom) {
          setActiveChoice(evenOrOdd);
          alternativesState[evenOrOdd][1]({
            atom: getNextColorForAlternativeAtom(evenOrOdd),
          } as CarryAtom<ColorForAlternative>);
        } else {
          setActiveChoice((1 - evenOrOdd) as PixelChoice);
          alternativesState[evenOrOdd][1](null);
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...alternativesState, setActiveChoice]
  );

  const buttons = useMemo(
    () =>
      ['enable/disable even rows', 'enable/disable odd rows'].map((name, i) => (
        <Button
          {...{
            callback: getEvenOrOddRowSwitch(i as 0 | 1),
            name,
          }}
          key={name}
        />
      )),
    [getEvenOrOddRowSwitch]
  );

  return <>{buttons}</>;
};
