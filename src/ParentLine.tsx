import { useInterstate } from '@smart-hooks/use-interstate';
import React, { memo } from 'react';
import type { FC } from 'react';
import { PixelsLine } from './PixelsLine';

// eslint-disable-next-line react/display-name
export const ParentLine: FC<{ length: number; controlKey: string }> = memo(
  ({ children, length, controlKey }) => {
    const [useSubscribeControl] = useInterstate<string | null>(controlKey);
    const stateKey = useSubscribeControl();

    return (
      <div>
        {stateKey && <PixelsLine {...{ length, stateKey }} />}
        {children}
      </div>
    );
  },
  () => true
);
