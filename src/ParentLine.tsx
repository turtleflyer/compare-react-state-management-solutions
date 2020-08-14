import React, { memo } from 'react';
import type { FC } from 'react';
import { useRecoilValue } from 'recoil';
import type { RecoilState } from 'recoil';
import { PixelsLine } from './PixelsLine';

export const ParentLine: FC<{
  length: number;
  controlAtom: RecoilState<{ stateAtom: RecoilState<string> } | null>;
  // eslint-disable-next-line react/display-name
}> = memo(
  ({ children, length, controlAtom }) => {
    const atomRecord = useRecoilValue(controlAtom);

    return (
      <div>
        {atomRecord && <PixelsLine {...{ length, stateAtom: atomRecord.stateAtom }} />}
        {children}
      </div>
    );
  },
  () => true
);
