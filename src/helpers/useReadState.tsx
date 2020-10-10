import type {
  InterstateInitializeObject,
  InterstateInitializeParam,
  InterstateStateObject,
} from '@smart-hooks/use-interstate';
import type { FC, MutableRefObject } from 'react';
import React, { useCallback, useRef } from 'react';
import { useInterstate } from '../State/State';
import type { State } from '../State/StateInterface';

interface UseReadState {
  <K extends keyof State>(stateScheme: InterstateInitializeObject<State, K>): [
    () => InterstateStateObject<State, K>,
    FC
  ];

  <K extends keyof State, T extends State[K] = State[K]>(
    key: K,
    initValue?: InterstateInitializeParam<T>
  ): [() => State[K], FC];
}

export const useReadState = (<K extends keyof State>(
  ...arg: [K] | [K, InterstateInitializeParam<State[K]>] | [InterstateInitializeObject<State, K>]
): [() => State[K] | InterstateStateObject<State, K>, FC] => {
  const stateRecord = useRef<State[K] | InterstateStateObject<State, K>>(undefined!);
  const Read: FC<{
    transportState: MutableRefObject<State[K] | InterstateStateObject<State, K>>;
  }> = ({ transportState }) => {
    const state = useInterstate(...(arg as [K])).get() as
      | State[K]
      | InterstateStateObject<State, K>;
    // eslint-disable-next-line no-param-reassign
    transportState.current = state;

    return <></>;
  };

  const getState = useCallback(() => stateRecord.current, []);

  return [getState, () => <Read {...{ transportState: stateRecord }} />];
}) as UseReadState;
