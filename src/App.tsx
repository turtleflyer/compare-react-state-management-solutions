import type { CSSProperties, FC } from 'react';
import React, { Profiler, useEffect, useRef, useState } from 'react';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { Button } from './Button';
import { getNextAtom } from './getNextAtom';
import { PixelsStage } from './PixelsStage';
import { getRandomColor } from './randomColor';
import type { OneOfTwoAlternativesControlAtomsSet, OneOfTwoAlternativesState } from './State';
import {
  defColor,
  defOneOfTwoAlternativesControl,
  oneOfTwoAlternativesControlPrefs,
  placeholderAtomForAlternatives,
  placeholderAtomForPixelControl,
  sendAtomsControlAtoms,
  SQUARE_SIZE,
  storeAtomsMethods,
} from './State';

const pixelsContainersStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
};
const buttonsContainersStyle: CSSProperties = {
  marginTop: '10px',
};

// eslint-disable-next-line no-underscore-dangle
const _App: FC = () => {
  interface AppInnerState {
    choice: 0 | 1;
    colors: { 0: string; 1: string };
  }

  const defInnerState: AppInnerState = {
    choice: 0,
    colors: { 0: defColor, 1: defColor },
  };
  const innerStateRecord = useRef(defInnerState);

  const [atoms, setAtoms] = useState(defOneOfTwoAlternativesControl);

  const sendAtoms = [
    useSetRecoilState(sendAtomsControlAtoms[0]),
    useSetRecoilState(sendAtomsControlAtoms[1]),
  ] as const;
  const setColors = [
    useSetRecoilState(atoms[0] || placeholderAtomForAlternatives),
    useSetRecoilState(atoms[1] || placeholderAtomForAlternatives),
  ] as const;

  const [randomIndexToPaint, setIndex] = useState(placeholderAtomForPixelControl);
  const paintRandomPixel = useSetRecoilState(randomIndexToPaint);

  useEffect(() => {
    if (randomIndexToPaint) {
      paintRandomPixel((prev) => (1 - prev) as 0 | 1);
    }
  }, [paintRandomPixel, randomIndexToPaint]);

  function repaintRow() {
    const {
      current: currentInnerState,
      current: { choice: currentChoice, colors: currentColors },
    } = innerStateRecord;
    let updateInnerState: Partial<AppInnerState> = {};

    if (atoms[currentChoice] !== null) {
      const newColor = getRandomColor(currentColors[currentChoice]);
      updateInnerState = {
        ...updateInnerState,
        colors: { ...currentColors, [currentChoice]: newColor },
      };
      setColors[currentChoice](newColor);
    }

    const nextPotentialChoice = (1 - currentChoice) as 0 | 1;
    if (atoms[nextPotentialChoice] !== null) {
      updateInnerState = { ...updateInnerState, choice: nextPotentialChoice };
    }

    innerStateRecord.current = { ...currentInnerState, ...updateInnerState };
  }

  function getEvenOrOddRowSwitch(evenOrOdd: 0 | 1): () => void {
    return () => {
      const { current: currentInnerState } = innerStateRecord;
      let updateInnerState: Partial<AppInnerState> = {};

      let changeAtom: OneOfTwoAlternativesState | null;
      if (atoms[evenOrOdd] === null) {
        changeAtom = getNextAtom(oneOfTwoAlternativesControlPrefs[evenOrOdd], defColor);
      } else {
        changeAtom = null;
        updateInnerState = { ...updateInnerState, choice: (1 - evenOrOdd) as 0 | 1 };
      }
      const newAtoms: OneOfTwoAlternativesControlAtomsSet = [...atoms];
      newAtoms[evenOrOdd] = changeAtom;
      setAtoms(newAtoms);
      sendAtoms[evenOrOdd](changeAtom && { atom: changeAtom });
      innerStateRecord.current = { ...currentInnerState, ...updateInnerState };
    };
  }

  function randomPaint() {
    const randomIndex = Math.floor(Math.random() * SQUARE_SIZE ** 2);
    setIndex(storeAtomsMethods.get(randomIndex));
  }

  return (
    <div {...{ style: pixelsContainersStyle }}>
      <PixelsStage />
      <div {...{ style: buttonsContainersStyle }}>
        <Button {...{ callback: repaintRow, name: 're-paint' }} />
        <Button
          {...{
            callback: getEvenOrOddRowSwitch(0),
            name: 'enable/disable even rows',
            addStyle: { width: '300px' },
          }}
        />
        <Button
          {...{
            callback: getEvenOrOddRowSwitch(1),
            name: 'enable/disable odd rows',
            addStyle: { width: '300px' },
          }}
        />
        <Button
          {...{
            callback: randomPaint,
            name: 'paint random pixel',
            addStyle: { width: '300px' },
          }}
        />
      </div>
    </div>
  );
};

export const App: FC = () => (
  <Profiler
    {...{
      id: 'App',
      onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
        // eslint-disable-next-line no-console
        console.log(
          'id, phase, actualDuration, baseDuration, startTime, commitTime: ',
          id,
          phase,
          actualDuration,
          baseDuration,
          startTime,
          commitTime
        );
      },
    }}
  >
    <RecoilRoot>
      {/* eslint-disable-next-line react/jsx-pascal-case */}
      <_App />
    </RecoilRoot>
  </Profiler>
);
