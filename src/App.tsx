import { useInterstate } from '@smart-hooks/use-interstate';
import React, { useRef, useState } from 'react';
import type { FC, ReactElement } from 'react';
import { Button } from './Button';
import { HOW_MANY_LINES, LINE_LENGTH, PIXEL_SIZE } from './env';
import { ParentLine } from './ParentLine';
import { getRandomColor } from './randomColor';

function formatKey(s: TemplateStringsArray, c: number): string {
  return `${s[0]}-c${c.toString().padStart(3, '0')}`;
}

function updateKeys(c: number): [string, string] {
  return [formatKey`even${c}`, formatKey`odd${c}`];
}

const defColor = '#f0f0f0';
const defKeys = updateKeys(0);
const controlKeys = ['even-control', 'odd-control'];

let currentLine: ReactElement | null = null;

for (let i = 0; i < HOW_MANY_LINES; i++) {
  currentLine = (
    <ParentLine {...{ length: LINE_LENGTH, controlKey: controlKeys[(HOW_MANY_LINES + i + 1) % 2] }}>
      {currentLine}
    </ParentLine>
  );
}

export const App: FC = () => {
  type Keys = [string | null, string | null, number];
  const recordChoice = useRef<0 | 1>(0);
  const recordColors = useRef<[string, string]>([defColor, defColor]);
  const [keys, setKeys] = useState<Keys>([...defKeys, 0]);

  const [evenKey, oddKey] = keys;

  const [, sendKeys] = useInterstate({ [controlKeys[0]]: evenKey, [controlKeys[1]]: oddKey });

  const [, setEvenColors] = useInterstate(evenKey || 'default', recordColors.current[0]);
  const [, setOddColors] = useInterstate(oddKey || 'default', recordColors.current[1]);

  function repaintCallback() {
    const { current: choice } = recordChoice;
    if (keys[choice] !== null) {
      const newColor = getRandomColor(recordColors.current[choice]);
      recordColors.current[choice] = newColor;
      [setEvenColors, setOddColors][choice](newColor);
    }

    const newPotentialChoice = (1 - choice) as 0 | 1;
    if (keys[newPotentialChoice] !== null) {
      recordChoice.current = newPotentialChoice;
    }
  }

  function getHitter(evenOrOdd: 0 | 1): () => void {
    return () => {
      let newKeys: Keys;
      if (keys[evenOrOdd] === null) {
        newKeys = [...keys.slice(0, 2), keys[2] + 1] as Keys;
        const [, , count] = newKeys;
        newKeys[evenOrOdd] = updateKeys(count)[evenOrOdd];
      } else {
        newKeys = [...keys];
        newKeys[evenOrOdd] = null;
        recordChoice.current = (1 - evenOrOdd) as 0 | 1;
      }
      setKeys(newKeys);
      sendKeys[controlKeys[evenOrOdd]](newKeys[evenOrOdd]);
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
