import type { CSSProperties, FC } from 'react';
import React, { memo } from 'react';
import { useRecoilValue } from 'recoil';
import type { OneOfTwoAlternativesState } from './State';

const style: CSSProperties = { height: '100%', width: '100%' };

// eslint-disable-next-line prefer-arrow-callback
export const Pixel: FC<{ stateAtom: OneOfTwoAlternativesState }> = memo(function Pixel({
  stateAtom,
}) {
  const color = useRecoilValue(stateAtom);
  const alteredStyle = { ...style, backgroundColor: color };

  return <div {...{ style: alteredStyle }} />;
});
