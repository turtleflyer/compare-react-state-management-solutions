import React, { createContext, FC, useContext } from 'react';

type ControlContextProps = { show?: boolean; keyState?: string };

export function getControlContext(
  defKeyState: string
): [FC<ControlContextProps>, () => ControlContextProps] {
  const defValue = { show: true, keyState: defKeyState };
  const ControlContext = createContext(defValue);

  const ControlContextProviderComponent: FC<ControlContextProps> = ({
    children,
    show = defValue.show,
    keyState = defValue.keyState,
  }) => (
    <ControlContext.Provider {...{ value: { show, keyState } }}>{children}</ControlContext.Provider>
  );

  const useControlContext = () => useContext(ControlContext);

  return [ControlContextProviderComponent, useControlContext];
}
