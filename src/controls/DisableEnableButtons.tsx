import type { FC } from 'react';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { Button } from '../reusable-components/Button';
import {
  alternativeForChoiceAtoms,
  getNextColorForAlternativeAtom,
  rememberActiveChoiceAtom,
} from '../State/State';
import type { CarryAtom, ColorForAlternative, PixelChoice } from '../State/StateInterface';

export const DisableEnableButtons: FC = () => {
  const setActiveChoice = useSetRecoilState(rememberActiveChoiceAtom);
  const setAlternatives = [
    useSetRecoilState(alternativeForChoiceAtoms[0]),
    useSetRecoilState(alternativeForChoiceAtoms[1]),
  ] as const;

  function getEvenOrOddRowSwitch(evenOrOdd: PixelChoice): () => void {
    return () =>
      setAlternatives[evenOrOdd]((prevAtom) => {
        if (!prevAtom) {
          setActiveChoice(evenOrOdd);
          return { atom: getNextColorForAlternativeAtom(evenOrOdd) } as CarryAtom<
            ColorForAlternative
          >;
        }
        setActiveChoice((1 - evenOrOdd) as PixelChoice);
        return null;
      });
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
