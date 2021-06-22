import type { CSSProperties, FC, ReactElement } from 'react';
import React, { cloneElement, useState } from 'react';

const DISPLAY_INFO_CONTAINER_WIDTH = 170;
const INITIAL_FONT_SIZE = 12;
const FIT_MARGINS = 15;

const displayInfoContainerStyle: CSSProperties = {
  display: 'flex',
  width: DISPLAY_INFO_CONTAINER_WIDTH,
  height: 20,
  color: 'white',
  backgroundColor: 'gray',
  borderRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
};

const innerBoxStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'nowrap',
  whiteSpace: 'nowrap',
};

const elementStyle: CSSProperties = { marginRight: 5 };

export const DisplayInfo: FC<{ info?: (ReactElement | string)[]; tryToFit?: boolean }> = ({
  info,
  tryToFit = false,
}) => {
  const [fontSize, setFontSize] = useState<number>(INITIAL_FONT_SIZE);
  tryToFit || fontSize === INITIAL_FONT_SIZE || setFontSize(INITIAL_FONT_SIZE);

  const ref = (e: HTMLDivElement | null) => {
    if (e && tryToFit) {
      const { width } = e.getBoundingClientRect();
      width > DISPLAY_INFO_CONTAINER_WIDTH - FIT_MARGINS &&
        setFontSize((fontS) => (fontS * (DISPLAY_INFO_CONTAINER_WIDTH - FIT_MARGINS)) / width);
    }
  };

  return info ? (
    <div {...{ style: displayInfoContainerStyle }}>
      <div {...{ ref, style: { ...innerBoxStyle, fontSize } }}>
        {info.map((e) =>
          typeof e === 'string' ? (
            <span {...{ style: elementStyle }} key={e}>
              {e}
            </span>
          ) : (
            cloneElement(e, {
              style: { ...e.props.style, ...elementStyle },
            })
          )
        )}
      </div>
    </div>
  ) : (
    <div {...{ style: { ...displayInfoContainerStyle, backgroundColor: 'transparent' } }} />
  );
};
