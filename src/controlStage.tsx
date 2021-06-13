import { drawPixels } from '@compare-react-state-management-solutions/draw-pixels';
import { getRandomColor } from '@compare-react-state-management-solutions/random-color';
import type { FC, ReactElement } from 'react';
import React, { useEffect, useState } from 'react';
import { SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { drawPixelToPaint } from './helpers/drawPixelToPaint';
import {
  alternativeForChoiceAtoms,
  choiceForPixelPlaceholderAtom,
  colorForAlternativePlaceholderAtom,
  createColorForAlternativeAtom,
  gridSizeAtom,
  rememberActiveChoiceAtom,
} from './State/State';
import type {
  AlternativeForChoiceAtom,
  ChoiceForPixelAtom,
  ColorValue,
  HoldColorForAlternativeAtom,
  PixelChoice,
} from './State/StateInterface';
import { storeAtomsMethods } from './State/storeAtomsMethods';

const ONE_HUNDRED_PERCENT = 100;

type ManageColorState = [ColorValue, SetterOrUpdater<ColorValue>];

export const useRepaintRow = (): (() => void) => {
  const alternatives = alternativeForChoiceAtoms.map(useAlternative) as [
    HoldColorForAlternativeAtom | null,
    HoldColorForAlternativeAtom | null
  ];

  const [activeChoice, setActiveChoice] = useRecoilState(rememberActiveChoiceAtom);
  const colorsState = alternatives.map(useColorState) as [ManageColorState, ManageColorState];

  return (): void => {
    const prevColor = colorsState[activeChoice][0];
    const nextPotentialChoice = (1 - activeChoice) as PixelChoice;

    if (alternatives[nextPotentialChoice] !== null) {
      setActiveChoice(nextPotentialChoice);
    }

    if (alternatives[activeChoice] !== null) {
      colorsState[activeChoice][1](getRandomColor(prevColor));
    }
  };
};

function useAlternative(
  altForChoiceAtom: AlternativeForChoiceAtom
): HoldColorForAlternativeAtom | null {
  return useRecoilValue(altForChoiceAtom);
}

function useColorState(alt: HoldColorForAlternativeAtom | null): ManageColorState {
  return useRecoilState(alt?.atom ?? colorForAlternativePlaceholderAtom);
}

export const useDisableRows = (): (() => void) | null => {
  const [possibleAlternative, setAlternative] = useRecoilState(alternativeForChoiceAtoms[1]);
  const setActiveChoice = useSetRecoilState(rememberActiveChoiceAtom);

  return possibleAlternative === null
    ? null
    : () => {
        setAlternative(null);
        setActiveChoice(0);
      };
};

export const useEnableRows = (): (() => void) | null => {
  const [possibleAlternative, setAlternative] = useRecoilState(alternativeForChoiceAtoms[1]);

  return possibleAlternative === null
    ? () => {
        setAlternative({
          atom: createColorForAlternativeAtom(1),
        });
      }
    : null;
};

export const usePaintRandomSinglePixel = (): (() => void) => {
  const gridSize = useRecoilValue(gridSizeAtom);
  const [atomToPaint, setAtomToPaint] = useState({ atom: choiceForPixelPlaceholderAtom });
  const paintRandomPixel = useSetRecoilState(atomToPaint.atom);

  useEffect(() => {
    paintRandomPixel((prev) => (1 - prev) as PixelChoice);
  }, [atomToPaint]); // eslint-disable-line react-hooks/exhaustive-deps

  return (): void => {
    setAtomToPaint({ atom: drawPixelToPaint(gridSize ** 2) });
  };
};

const PixelToPaint: FC<{ pixelChoiceAtom: ChoiceForPixelAtom }> = ({ pixelChoiceAtom }) => {
  const setChoice = useSetRecoilState(pixelChoiceAtom);

  useEffect(() => {
    setChoice((prevChoice) => (1 - prevChoice) as PixelChoice);
  }, [setChoice]);

  return <></>;
};

export const usePaintRandomPixels = (): [(percentage: number) => void, ReactElement[]] => {
  const gridSize = useRecoilValue(gridSizeAtom);
  const [pixelsToPaint, setPixelsToPaint] = useState<ReactElement[]>([]);

  useEffect(
    () => setPixelsToPaint((prevPixels) => (prevPixels.length > 0 ? [] : prevPixels)),
    [pixelsToPaint]
  );

  return [
    (percentage: number): void => {
      const allPixelsNumber = gridSize ** 2;
      const pixelsNumberToPaint = (allPixelsNumber * percentage) / ONE_HUNDRED_PERCENT;

      setPixelsToPaint(
        drawPixels(allPixelsNumber, pixelsNumberToPaint).map((p) => (
          <PixelToPaint
            {...{
              pixelChoiceAtom:
                storeAtomsMethods.get(p) ??
                (() => {
                  throw Error('It must be defined');
                })(),
            }}
            key={p}
          />
        ))
      );
    },
    pixelsToPaint,
  ];
};
