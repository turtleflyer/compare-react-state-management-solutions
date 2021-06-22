import type { PerformanceInfoProps } from '@compare-react-state-management-solutions/performance-info';
import {
  PerformanceInfo,
  useAddRefToCalculateArea,
} from '@compare-react-state-management-solutions/performance-info';
import type { WrapMetricConsumerProps } from '@compare-react-state-management-solutions/use-perf-metric';
import type { CSSProperties, FC } from 'react';
import React, { useState } from 'react';
import { Button } from './Button';
import { InputField } from './InputField';
import { buttonContainerStyle } from './styles';

export type ChooseGridProps = {
  gridSize: number;
  onGridChosen: (p: { gridSize: number }) => void;
  moduleName: string;
};

const perfInfoWithCaptionContainerStyle: CSSProperties = {
  display: 'flex',
  marginTop: 1,
  justifyContent: 'flex-end',
  maxWidth: '18em',
};

const captionStyle: CSSProperties = {
  margin: '0px 10px 0 20px',
  fontSize: '0.85em',
};

const PerformanceInfoWithCaption: FC<PerformanceInfoProps & { caption: string }> = (props) => {
  const { caption, status } = props;
  const [display, setDisplay] = useState<true | null>(null);
  !display && status !== 'never' && setDisplay(true);

  return (
    <div {...{ style: perfInfoWithCaptionContainerStyle }}>
      <div {...{ style: captionStyle }}>{display && caption}</div>
      <PerformanceInfo {...props} />
    </div>
  );
};

export const ChooseGrid: FC<
  ChooseGridProps & {
    WrapMetricConsumerToBuildGrid: FC<WrapMetricConsumerProps>;
    WrapMetricConsumerToUnmountGrid: FC<WrapMetricConsumerProps>;
  }
> = ({
  gridSize,
  onGridChosen,
  moduleName,
  WrapMetricConsumerToBuildGrid,
  WrapMetricConsumerToUnmountGrid,
}) => {
  const gridSizeString = `${gridSize}`;
  const addRef = useAddRefToCalculateArea();

  const onSubmit = (value: string, setValue: (v: string) => void): void => {
    const parseNextGridSize = parseInt(value, 10);

    if (value === `${parseNextGridSize}` && parseNextGridSize > 0) {
      onGridChosen({ gridSize: parseNextGridSize });

      return;
    }

    setValue(gridSizeString);
  };

  return (
    <div {...{ ref: addRef }}>
      <InputField
        {...{
          label: 'input grid size: ',
          onSubmit,
          defValue: gridSizeString,
          addStyle: { ...buttonContainerStyle, marginBottom: '2px' },
          insertElementAfter: (
            <Button
              {...{
                type: 'submit',
                name: 'change grid',
                addStyle: { width: 'auto', margin: '3px 5px 0 10px' },
              }}
            />
          ),
        }}
      />

      <WrapMetricConsumerToBuildGrid>
        <PerformanceInfoWithCaption {...{ tags: [moduleName, gridSize], caption: 'build grid:' }} />
      </WrapMetricConsumerToBuildGrid>

      <WrapMetricConsumerToUnmountGrid>
        <PerformanceInfoWithCaption
          {...{ tags: [moduleName, 'unmount grid'], caption: 'unmount grid: ' }}
        />
      </WrapMetricConsumerToUnmountGrid>
    </div>
  );
};
