import type { FC } from 'react';
import React, { createContext, useContext, useState } from 'react';

export interface Area {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

const BlockingAreaContext = createContext<Area | null>(null);

export type BlockingState =
  | ({
      toBlock: true;
      resetBlockingState: () => void;
    } & (
      | {
          readyToRender: false;
          setReadyState: () => void;
        }
      | {
          readyToRender: true;
        }
    ))
  | { toBlock: false };

const notBlockingState = { toBlock: false } as BlockingState;

const BlockingStateContext = createContext(notBlockingState);

export interface SetBlockingStateAndCalculateAreaMethods {
  setStateToBlock: () => void;

  addRefToCalculateArea: (ref: HTMLElement) => void;

  resetArea: () => void;
}

const SetBlockingStateAndCalculateAreaMethodsContext =
  createContext<SetBlockingStateAndCalculateAreaMethods | null>(null);

const createBlockingStateAndCalculateArea = (): {
  useBlockingArea: () => Area | null;
  useBlockingState: () => BlockingState;
  setBlockingStateAndCalculateAreaMethods: SetBlockingStateAndCalculateAreaMethods;
} => {
  let setBlockingState: (v: BlockingState) => void;
  let currArea: Area | null;
  let setArea: (area: Area | null) => void;

  const useBlockingArea = (): Area | null => {
    const [area, _setArea] = useState<Area | null>(null);
    setArea = _setArea;

    return area;
  };

  const resetBlockingState = (): void => {
    setBlockingState(notBlockingState);
  };

  const defBlockingState = {
    toBlock: true,
    readyToRender: false,
    resetBlockingState,

    setReadyState(): void {
      setBlockingState({ toBlock: true, readyToRender: true, resetBlockingState });
    },
  } as BlockingState;

  const useBlockingState = (): BlockingState => {
    const [blockingState, _setBlockingState] = useState(defBlockingState);

    setBlockingState = _setBlockingState;

    return blockingState;
  };

  const setStateToBlock = (): void => setBlockingState(defBlockingState);

  const addRefToCalculateArea = (ref: HTMLElement): void => {
    const { top, left, bottom, right } = ref.getBoundingClientRect();

    if (!currArea) {
      currArea = { top, left, bottom, right };
    } else {
      const { top: curTop, left: curLeft, bottom: curBottom, right: curRight } = currArea;
      const [nextTop, nextBottom] = processDimension([curTop, curBottom], [top, bottom]);
      const [nextLeft, nextRight] = processDimension([curLeft, curRight], [left, right]);
      currArea = { top: nextTop, left: nextLeft, bottom: nextBottom, right: nextRight };
    }

    setArea(currArea);
  };

  const resetArea = (): void => {
    setArea(null);
  };

  const setBlockingStateAndCalculateAreaMethods: SetBlockingStateAndCalculateAreaMethods = {
    setStateToBlock,
    addRefToCalculateArea,
    resetArea,
  };

  return {
    useBlockingArea,
    useBlockingState,
    setBlockingStateAndCalculateAreaMethods,
  };

  type DimensionSet = [begin: number, end: number];

  function processDimension(
    [curBegin, curEnd]: DimensionSet,
    [beginToAdd, endToAdd]: DimensionSet
  ): DimensionSet {
    return [beginToAdd < curBegin ? beginToAdd : curBegin, endToAdd > curEnd ? endToAdd : curEnd];
  }
};

export const BlockingParametersProvider: FC = ({ children }) => {
  const [{ useBlockingArea, useBlockingState, setBlockingStateAndCalculateAreaMethods }] = useState(
    createBlockingStateAndCalculateArea
  );

  const blockingArea = useBlockingArea();
  const blockingState = useBlockingState();

  return (
    <BlockingAreaContext.Provider {...{ value: blockingArea }}>
      <BlockingStateContext.Provider {...{ value: blockingState }}>
        <SetBlockingStateAndCalculateAreaMethodsContext.Provider
          {...{ value: setBlockingStateAndCalculateAreaMethods }}
        >
          {children}
        </SetBlockingStateAndCalculateAreaMethodsContext.Provider>
      </BlockingStateContext.Provider>
    </BlockingAreaContext.Provider>
  );
};

export const useBlockingState = (): BlockingState => useContext(BlockingStateContext);

export const useSetStateToBlock = (): (() => void) =>
  (useContext(SetBlockingStateAndCalculateAreaMethodsContext) ?? throwError()).setStateToBlock;

export const useBlockingArea = (): Area | null => useContext(BlockingAreaContext);

export const useAddRefToCalculateArea = (): ((e: HTMLElement | null) => void) => {
  const { addRefToCalculateArea } =
    useContext(SetBlockingStateAndCalculateAreaMethodsContext) ?? throwError();

  return (element: HTMLElement | null) => element && addRefToCalculateArea(element);
};

export const useResetArea = (): (() => void) =>
  (useContext(SetBlockingStateAndCalculateAreaMethodsContext) ?? throwError()).resetArea;

function throwError(): never {
  throw Error('blocking parameters context provider is missing');
}
