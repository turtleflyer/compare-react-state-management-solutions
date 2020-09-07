import React, { useEffect, useRef, useState, Profiler } from 'react';
import type { CSSProperties, FC, ReactElement } from 'react';
import { atom, RecoilRoot, useSetRecoilState } from 'recoil';
import type { RecoilState } from 'recoil';
import { Button } from './Button';
import {
  carryAtomsControlAtoms,
  defAtoms,
  defColor,
  HOW_MANY_LINES,
  keysPrefs,
  LINE_LENGTH,
  PIXEL_SIZE,
  storeAtomsMethods,
} from './constants';
import type { EvenAndOddAtoms, RecoilStringState } from './constants';
import { getNextAtom } from './getNextAtom';
import { PixelsLine } from './PixelsLine';
import { getRandomColor } from './randomColor';

const placeholderAtom = atom({ key: '_', default: '' });

let currentLine: ReactElement | null = null;
for (let i = 0; i < HOW_MANY_LINES; i++) {
  currentLine = (
    <PixelsLine {...{ length: LINE_LENGTH, defKeyChoice: ((HOW_MANY_LINES + i + 1) % 2) as 0 | 1 }}>
      {currentLine}
    </PixelsLine>
  );
}

const style: CSSProperties = { height: `${PIXEL_SIZE * HOW_MANY_LINES}px` };

// eslint-disable-next-line no-underscore-dangle
const _App: FC = () => {
  const recordChoice = useRef<0 | 1>(0);
  const recordColors = useRef<[string, string]>([defColor, defColor]);

  const [atoms, setAtoms] = useState(defAtoms);

  const sendAtoms = [
    useSetRecoilState(carryAtomsControlAtoms[0]),
    useSetRecoilState(carryAtomsControlAtoms[1]),
  ];

  const setColors = [
    useSetRecoilState(atoms[0] || placeholderAtom),
    useSetRecoilState(atoms[1] || placeholderAtom),
  ];

  const [randomIndexToPaint, setIndex] = useState<RecoilState<0 | 1>>();
  const paintRandomPixel = useSetRecoilState<0 | 1>(randomIndexToPaint || (placeholderAtom as any));

  useEffect(() => {
    if (randomIndexToPaint) {
      paintRandomPixel((prev) => (1 - prev) as 0 | 1);
    }
  }, [randomIndexToPaint]);

  function repaintCallback() {
    const { current: choice } = recordChoice;
    if (atoms[choice] !== null) {
      const newColor = getRandomColor(recordColors.current[choice]);
      recordColors.current[choice] = newColor;
      setColors[choice](newColor);
    }

    const nextPotentialChoice = (1 - choice) as 0 | 1;
    if (atoms[nextPotentialChoice] !== null) {
      recordChoice.current = nextPotentialChoice;
    }
  }

  function getHitter(evenOrOdd: 0 | 1): () => void {
    return () => {
      let changeAtom: RecoilStringState | null;
      if (atoms[evenOrOdd] === null) {
        changeAtom = getNextAtom(keysPrefs[evenOrOdd], recordColors.current[evenOrOdd]);
      } else {
        changeAtom = null;
        recordChoice.current = (1 - evenOrOdd) as 0 | 1;
      }
      const newAtoms: EvenAndOddAtoms = [...atoms];
      newAtoms[evenOrOdd] = changeAtom;
      setAtoms(newAtoms);
      sendAtoms[evenOrOdd](changeAtom && { atom: changeAtom });
    };
  }

  function randomPaint() {
    const randomIndex = Math.floor(Math.random() * LINE_LENGTH * HOW_MANY_LINES);
    setIndex(storeAtomsMethods.get(randomIndex));
  }

  return (
    <>
      <div {...{ style }}>{currentLine}</div>
      <Button {...{ callback: repaintCallback, name: 're-paint' }} />
      <Button
        {...{
          callback: getHitter(0),
          name: 'enable/disable even rows',
          addStyle: { width: '300px' },
        }}
      />
      <Button
        {...{
          callback: getHitter(1),
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
    </>
  );
};

export const App: FC = () => (
  <Profiler
    {...{
      id: 'App',
      onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
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
