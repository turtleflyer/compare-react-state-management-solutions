import type { FC } from 'react';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { getNextAtom } from '../helpers/getNextAtom';
import { Button } from '../reusable-components/Button';
import type {
  OneOfTwoAlternativesControlAtomsSet,
  OneOfTwoAlternativesState,
} from '../State/State';
import {
  alternativesControlAtomsState,
  DEF_COLOR,
  gridSizeState,
  oneOfTwoAlternativesControlPrefs,
  sendAtomsControlAtoms,
} from '../State/State';
import type { ChoiceStateRecord } from './ChoiceState';

export const DisableEnableButtons: FC<ChoiceStateRecord> = ({ choiceStateRecord }) => {
  const [alternativesControlAtoms, setAlternativesControlKeys] = useRecoilState(
    alternativesControlAtomsState
  );

  const sendAtoms = [
    useSetRecoilState(sendAtomsControlAtoms[0]),
    useSetRecoilState(sendAtomsControlAtoms[1]),
  ] as const;

  const gridSize = useRecoilValue(gridSizeState);

  useEffect(() => {
    const newAtoms = alternativesControlAtoms.map((key, i) => {
      if (key) {
        return key;
      }

      const changeAtom = getNextAtom(oneOfTwoAlternativesControlPrefs[i], DEF_COLOR);
      sendAtoms[i]({ atom: changeAtom });
      return changeAtom;
    }) as OneOfTwoAlternativesControlAtomsSet;

    setAlternativesControlKeys(newAtoms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSize]);

  function getEvenOrOddRowSwitch(evenOrOdd: 0 | 1): () => void {
    return () => {
      const { current: choiceState } = choiceStateRecord;
      let changeAtom: OneOfTwoAlternativesState | null;
      if (!alternativesControlAtoms[evenOrOdd]) {
        changeAtom = getNextAtom(oneOfTwoAlternativesControlPrefs[evenOrOdd], DEF_COLOR);
        choiceState.choice = evenOrOdd;
      } else {
        changeAtom = null;
        choiceState.choice = (1 - evenOrOdd) as 0 | 1;
      }

      const newAtoms: OneOfTwoAlternativesControlAtomsSet = [...alternativesControlAtoms];
      newAtoms[evenOrOdd] = changeAtom;
      setAlternativesControlKeys(newAtoms);
      sendAtoms[evenOrOdd](changeAtom && { atom: changeAtom });
    };
  }

  return (
    <>
      {['enable/disable even rows', 'enable/disable odd rows'].map((name, i) => (
        <Button
          {...{
            callback: getEvenOrOddRowSwitch(i as 0 | 1),
            name,
          }}
          key={name}
        />
      ))}
    </>
  );
};
