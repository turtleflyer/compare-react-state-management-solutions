import type { FC } from 'react';
import React from 'react';
import { Button } from '../reusable-components/Button';
import {
  alternativeForChoiceAtoms,
  getNextColorForAlternativeAtom,
  rememberActiveChoiceAtom,
  useInterstate,
} from '../State/State';
import type { PixelChoice } from '../State/StateInterface';

export const DisableEnableButtons: FC = () => {
  const setActiveChoice = useInterstate(...rememberActiveChoiceAtom).set();
  const setAlternatives = [
    useInterstate(...alternativeForChoiceAtoms[0]).set(),
    useInterstate(...alternativeForChoiceAtoms[1]).set(),
  ] as const;

  function getEvenOrOddRowSwitch(evenOrOdd: PixelChoice): () => void {
    return () =>
      setAlternatives[evenOrOdd]((prevAtom) => {
        if (!prevAtom) {
          setActiveChoice(evenOrOdd);
          return getNextColorForAlternativeAtom(evenOrOdd);
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
