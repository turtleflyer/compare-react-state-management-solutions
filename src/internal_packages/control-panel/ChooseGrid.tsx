import { PerformanceInfo } from '@compare-react-state-management-solutions/performance-info';
import { usePerfObserver } from '@compare-react-state-management-solutions/use-perf-observer';
import type { ChangeEventHandler, FC } from 'react';
import React, { useState } from 'react';
import { Button } from './Button';
import { HookOrNotProp } from './HookOrNotProp';
import { InputField } from './InputField';
import { buttonContainerStyle } from './styles';

export type ChooseGridProps = HookOrNotProp<'gridSize', number> & {
  onGridChosen: (p: { gridSize: number }) => void;
};

export const ChooseGrid: FC<ChooseGridProps> = (props) => {
  const gridSize = props.gridSize ?? props.useGridSize();
  const [inputValue, setInputValue] = useState(`${gridSize}`);
  const [WrapDisplay, startMeasure] = usePerfObserver({ measureFromCreating: true });

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
  };

  const onSubmit = (): void => {
    startMeasure();
    const nextGridSize = parseInt(inputValue, 10);
    props.onGridChosen({ gridSize: nextGridSize > 0 ? nextGridSize : gridSize });
  };

  return (
    <div>
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
      <WrapDisplay>
        <PerformanceInfo {...{ data: null }} />
      </WrapDisplay>
    </div>
  );
};
