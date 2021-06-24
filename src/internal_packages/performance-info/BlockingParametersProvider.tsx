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

const notBlocked = { toBlock: false } as const;

const BlockingStateContext = createContext<BlockingState>(notBlocked);

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

    setArea =
      setArea ??
      ((a: Area | null) => {
        currArea = a;
        _setArea(a);
      });

    return area;
  };

  const resetBlockingState = (): void => {
    setBlockingState(notBlocked);
  };

  const blockedAndReadyToRender = {
    toBlock: true,
    readyToRender: true,
    resetBlockingState,
  } as const;

  const blockedNotReadyToRender = {
    toBlock: true,
    readyToRender: false,
    resetBlockingState,

    setReadyState(): void {
      setBlockingState(blockedAndReadyToRender);
    },
  } as const;

  const useBlockingState = (): BlockingState => {
    const [blockingState, _setBlockingState] = useState<BlockingState>(notBlocked);

    setBlockingState = _setBlockingState;

    return blockingState;
  };

  const setStateToBlock = (): void => setBlockingState(blockedNotReadyToRender);

  const addRefToCalculateArea = (ref: HTMLElement): void => {
    const { top, left, bottom, right } = ref.getBoundingClientRect();
    let nextArea: Area;

    if (!currArea) {
      nextArea = { top, left, bottom, right };
    } else {
      const { top: curTop, left: curLeft, bottom: curBottom, right: curRight } = currArea;
      const [nextTop, nextBottom] = processDimension([curTop, curBottom], [top, bottom]);
      const [nextLeft, nextRight] = processDimension([curLeft, curRight], [left, right]);
      nextArea = { top: nextTop, left: nextLeft, bottom: nextBottom, right: nextRight };
    }

    (!currArea ||
      Object.entries(currArea).some(([key, value]) => value !== nextArea[key as keyof Area])) &&
      setArea(nextArea);
  };

  const resetArea = (): void => setArea(null);

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

interface UseBodyInUseAddRefToCalculateAreaReturn {
  addRefToCalculateArea: AddRefToCalculateArea;
}

type AddRefToCalculateArea = (e: HTMLElement | null) => void;

const createAddRefToCalculateArea = (): {
  useBody: () => UseBodyInUseAddRefToCalculateAreaReturn;
} => {
  let addRefToCalculateAreaFromContext: (ref: HTMLElement) => void;
  let currMaxRight = 0;

  const useBody = (): UseBodyInUseAddRefToCalculateAreaReturn => {
    ({ addRefToCalculateArea: addRefToCalculateAreaFromContext } =
      useContext(SetBlockingStateAndCalculateAreaMethodsContext) ?? throwError());

    const addRefToCalculateArea: AddRefToCalculateArea = (ref) => {
      if (ref) {
        const { right } = ref.getBoundingClientRect();

        if (right > currMaxRight) {
          addRefToCalculateAreaFromContext(ref);
          currMaxRight = right;
        }
      }
    };

    return { addRefToCalculateArea };
  };

  return { useBody };
};

export const useAddRefToCalculateArea = (): ((e: HTMLElement | null) => void) => {
  const [{ useBody }] = useState(createAddRefToCalculateArea);
  const { addRefToCalculateArea } = useBody();

  return addRefToCalculateArea;
};

export const useResetArea = (): (() => void) =>
  (useContext(SetBlockingStateAndCalculateAreaMethodsContext) ?? throwError()).resetArea;

function throwError(): never {
  throw Error('blocking parameters context provider is missing');
}
