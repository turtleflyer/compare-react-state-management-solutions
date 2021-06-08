import {
  PerformanceInfo,
  useAddRefToCalculateArea,
} from '@compare-react-state-management-solutions/performance-info';
import { usePerfMetric } from '@compare-react-state-management-solutions/use-perf-metric';
import type { ChangeEventHandler, FC } from 'react';
import React, { useState } from 'react';
import { Button } from './Button';
import { InputField } from './InputField';
import { buttonContainerStyle } from './styles';

export type ChooseGridProps = {
  gridSize: number;
  onGridChosen: (p: { gridSize: number }) => void;
  moduleName: string;
};

export const ChooseGrid: FC<ChooseGridProps> = (props) => {
  const { moduleName, gridSize } = props;
  const [inputValue, setInputValue] = useState(`${gridSize}`);
  const { WrapMetricConsumer, measurePerformance } = usePerfMetric({ measureFromCreated: true });
  const addRef = useAddRefToCalculateArea();

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
  };

  const onSubmit = (): void => {
    measurePerformance();
    const nextGridSize = parseInt(inputValue, 10);
    props.onGridChosen({ gridSize: nextGridSize > 0 ? nextGridSize : gridSize });
  };

  return (
    <div {...{ ref: addRef }}>
      <InputField
        {...{
          label: 'input grid size: ',
          onChange,
          onSubmit,
          value: inputValue,
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
      <WrapMetricConsumer>
        <PerformanceInfo {...{ tags: [moduleName, gridSize] }} />
      </WrapMetricConsumer>
    </div>
  );
};
