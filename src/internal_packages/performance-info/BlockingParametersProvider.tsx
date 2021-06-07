import type { FC } from 'react';
import React, { createContext, useContext, useState } from 'react';

export interface Area {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

const BlockingAreaContext = createContext<Area | null>(null);
const ToBlockContext = createContext<boolean | null>(null);

export interface SetBlockingParametersMethods {
  setToBlock: (toBlock: boolean) => void;
  addRef: (ref: HTMLElement) => void;
}

const SetBlockingParametersMethodsContext = createContext<SetBlockingParametersMethods | null>(
  null
);

const createSetBlockingParametersMethods = (): {
  useBlockingArea: () => Area;
  useToBlock: () => boolean;
  setBlockingParametersMethods: SetBlockingParametersMethods;
} => {
  let setParamToShow: (toShow: boolean) => void;
  let currArea: Area | null;
  let setArea: (area: Area) => void;

  const useBlockingArea = (): Area => {
    const [area, _setArea] = useState<Area | null>(null);
    setArea = _setArea;

    return area ?? { top: 0, left: 0, bottom: 0, right: 0 };
  };

  const useToBlock = (): boolean => {
    const [toShow, _setParamToShow] = useState(false);
    setParamToShow = _setParamToShow;

    return toShow;
  };

  const setToBlock = (toBlock: boolean): void => setParamToShow(toBlock);

  const addRef = (ref: HTMLElement): void => {
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

  const setBlockingParametersMethods = { setToBlock, addRef };

  return { useBlockingArea, useToBlock, setBlockingParametersMethods };

  type DimensionSet = [begin: number, end: number];

  function processDimension(
    [curBegin, curEnd]: DimensionSet,
    [beginToAdd, endToAdd]: DimensionSet
  ): DimensionSet {
    return [beginToAdd < curBegin ? beginToAdd : curBegin, endToAdd > curEnd ? endToAdd : curEnd];
  }
};

export const BlockingParametersProvider: FC = ({ children }) => {
  const [{ useBlockingArea, useToBlock, setBlockingParametersMethods }] = useState(
    createSetBlockingParametersMethods
  );

  const blockingArea = useBlockingArea();
  const toBlock = useToBlock();

  return (
    <BlockingAreaContext.Provider {...{ value: blockingArea }}>
      <ToBlockContext.Provider {...{ value: toBlock }}>
        <SetBlockingParametersMethodsContext.Provider {...{ value: setBlockingParametersMethods }}>
          {children}
        </SetBlockingParametersMethodsContext.Provider>
      </ToBlockContext.Provider>
    </BlockingAreaContext.Provider>
  );
};

export const useBlockingArea = (): Area => useContext(BlockingAreaContext) ?? throwError();

export const useToBlock = (): boolean => useContext(ToBlockContext) ?? throwError();

export const useSetToBlock = (): SetBlockingParametersMethods['setToBlock'] =>
  (useContext(SetBlockingParametersMethodsContext) ?? throwError()).setToBlock;

export const useAddRef = (): ((e: HTMLElement | null) => void) => {
  const { addRef } = useContext(SetBlockingParametersMethodsContext) ?? throwError();

  return (e: HTMLElement | null) => e && addRef(e);
};

function throwError(): never {
  throw Error('blocking parameters context provider is missing');
}
