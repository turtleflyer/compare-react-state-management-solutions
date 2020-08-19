import React, { memo } from 'react';
import type { CSSProperties, FC } from 'react';
import { useRecoilValue } from 'recoil';
import type { RecoilStringState } from './constants';

const style: CSSProperties = { height: '100%', width: '100%' };

// eslint-disable-next-line react/display-name
export const Pixel: FC<{ stateAtom: RecoilStringState }> = memo(({ stateAtom }) => {
  const color = useRecoilValue(stateAtom);
  const alteredStyle = { ...style, backgroundColor: color };

  return <div {...{ style: alteredStyle }} />;
});
