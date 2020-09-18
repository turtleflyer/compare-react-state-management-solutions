import type { FC } from 'react';
import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Button } from './Button';
import { getNextAtom } from './getNextAtom';
import type { ChoiceStateRecord } from './RepaintButton';
import type { OneOfTwoAlternativesControlAtomsSet, OneOfTwoAlternativesState } from './State';
import {
  alternativesControlAtomsState,
  defColor,
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

  function getEvenOrOddRowSwitch(evenOrOdd: 0 | 1): () => void {
    return () => {
      const { current: choiceState } = choiceStateRecord;
      let changeAtom: OneOfTwoAlternativesState | null;
      if (alternativesControlAtoms[evenOrOdd] === null) {
        changeAtom = getNextAtom(oneOfTwoAlternativesControlPrefs[evenOrOdd], defColor);
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
