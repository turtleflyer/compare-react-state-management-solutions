import {
  PerformanceInfo,
  useAddRef,
} from '@compare-react-state-management-solutions/performance-info';
import { usePerfMetric } from '@compare-react-state-management-solutions/use-perf-metric';
import type { ChangeEventHandler, FC } from 'react';
import React, { useState } from 'react';
import { Button } from './Button';
import { HookOrNotProp } from './HookOrNotProp';
import { InputField } from './InputField';
import { buttonContainerStyle } from './styles';

export type ChooseGridProps = HookOrNotProp<'gridSize', number> & {
  onGridChosen: (p: { gridSize: number }) => void;
  moduleName: string;
};

export const ChooseGrid: FC<ChooseGridProps> = (props) => {
  const { moduleName } = props;
  const gridSize = props.gridSize ?? props.useGridSize();
  const [inputValue, setInputValue] = useState(`${gridSize}`);
  const { WrapMetricConsumer, measurePerformance } = usePerfMetric({ measureFromCreated: true });
  const addRef = useAddRef();

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
