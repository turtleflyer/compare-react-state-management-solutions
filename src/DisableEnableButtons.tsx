import type { FC } from 'react';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Button } from './Button';
import { getNextAtom } from './getNextAtom';
import type { ChoiceStateRecord } from './RepaintButton';
import type { OneOfTwoAlternativesControlAtomsSet, OneOfTwoAlternativesState } from './State';
import {
  alternativesControlAtomsState,
  DEF_COLOR,
  gridSizeState,
  oneOfTwoAlternativesControlPrefs,
  sendAtomsControlAtoms,
} from './State';

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
            addStyle: { width: '300px' },
          }}
          key={name}
        />
      ))}
    </>
  );
};
