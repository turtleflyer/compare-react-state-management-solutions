import type { CSSProperties, FC } from 'react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import type { OneOfTwoAlternativesState } from './State';

const style: CSSProperties = { height: '100%', width: '100%' };

export const Pixel: FC<{ stateAtom: OneOfTwoAlternativesState }> = ({ stateAtom }) => {
  const color = useRecoilValue(stateAtom);
  const alteredStyle = { ...style, backgroundColor: color };

  return <div {...{ style: alteredStyle }} />;
};
