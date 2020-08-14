import React, { useRef, useState } from 'react';
import type { FC, ReactElement } from 'react';
import { atom, RecoilRoot, useSetRecoilState } from 'recoil';
import type { RecoilState } from 'recoil';
import { Button } from './Button';
import { HOW_MANY_LINES, LINE_LENGTH, PIXEL_SIZE } from './env';
import { ParentLine } from './ParentLine';
import { getRandomColor } from './randomColor';

function formatKey(s: TemplateStringsArray, c: number): string {
  return `${s[0]}-c${c.toString().padStart(3, '0')}`;
}

const defColor = '#f0f0f0';
function updateAtoms(
  c: number,
  colors: [string, string] = [defColor, defColor]
): [RecoilState<string>, RecoilState<string>] {
  return [
    atom({ key: formatKey`even${c}`, default: colors[0] }),
    atom({ key: formatKey`odd${c}`, default: colors[1] }),
  ];
}
const defAtoms = updateAtoms(0);

const defaultAtom = atom({ key: 'default', default: '' });
const controlAtoms: [
  RecoilState<{
    stateAtom: RecoilState<string>;
  } | null>,
  RecoilState<{
    stateAtom: RecoilState<string>;
  } | null>
] = [
  /**
   * Must use "as RecoilState<{stateAtom: RecoilState<string>;} | null", otherwise TypeScript error
   * occurs: "Types of property '__cTag' are incompatible. Type '(t: { stateAtom:
   * RecoilState<string>; }) => void' is not assignable to type '(t: { stateAtom:
   * RecoilState<string>; } | null) => void'."
   */
  atom({ key: 'even-control', default: { stateAtom: defAtoms[0] } }) as RecoilState<{
    stateAtom: RecoilState<string>;
  } | null>,
  atom({ key: 'odd-control', default: { stateAtom: defAtoms[1] } }) as RecoilState<{
    stateAtom: RecoilState<string>;
  } | null>,
];
let currentLine: ReactElement | null = null;
for (let i = 0; i < HOW_MANY_LINES; i++) {
  currentLine = (
    <ParentLine
      {...{
        length: LINE_LENGTH,
        controlAtom: controlAtoms[(HOW_MANY_LINES + i + 1) % 2],
      }}
    >
      {currentLine}
    </ParentLine>
  );
}

// eslint-disable-next-line no-underscore-dangle
const _App: FC = () => {
  type Atoms = [RecoilState<string> | null, RecoilState<string> | null, number];
  const recordChoice = useRef<0 | 1>(0);
  const recordColors = useRef<[string, string]>([defColor, defColor]);
  const [atoms, setAtoms] = useState<Atoms>([...defAtoms, 0]);

  const [evenAtom, oddAtom] = atoms;
  /**
   * Does not allow to use "const sendAtoms = controlAtoms.map((a) => useSetRecoilState(a));" giving
   * the error: "React Hook "useSetRecoilState" cannot be called inside a callback. React Hooks must
   * be called in a React function component or a custom React Hook function
   * react-hooks/rules-of-hooks"
   */
  const sendAtoms = [useSetRecoilState(controlAtoms[0]), useSetRecoilState(controlAtoms[1])];

  const setEvenColors = useSetRecoilState(evenAtom || defaultAtom);
  const setOddColors = useSetRecoilState(oddAtom || defaultAtom);

  function repaintCallback() {
    const { current: choice } = recordChoice;
    if (atoms[choice] !== null) {
      const newColor = getRandomColor(recordColors.current[choice]);
      recordColors.current[choice] = newColor;
      [setEvenColors, setOddColors][choice](newColor);
    }

    const newPotentialChoice = (1 - choice) as 0 | 1;
    if (atoms[newPotentialChoice] !== null) {
      recordChoice.current = newPotentialChoice;
    }
  }

  function getHitter(evenOrOdd: 0 | 1): () => void {
    return () => {
      let newAtoms: Atoms;
      if (atoms[evenOrOdd] === null) {
        newAtoms = [...atoms.slice(0, 2), atoms[2] + 1] as Atoms;
        const [, , count] = newAtoms;
        newAtoms[evenOrOdd] = updateAtoms(count, recordColors.current)[evenOrOdd];
      } else {
        newAtoms = [...atoms];
        newAtoms[evenOrOdd] = null;
        recordChoice.current = (1 - evenOrOdd) as 0 | 1;
      }
      setAtoms(newAtoms);
      const atomToSend = newAtoms[evenOrOdd];
      sendAtoms[evenOrOdd](atomToSend && { stateAtom: atomToSend });
    };
  }

  return (
    <>
      <div {...{ style: { height: `${PIXEL_SIZE * HOW_MANY_LINES}px` } }}>{currentLine}</div>
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
    </>
  );
};

export const App: FC = () => (
  <RecoilRoot>
    {/* eslint-disable-next-line react/jsx-pascal-case */}
    <_App />
  </RecoilRoot>
);
