import React, { cloneElement, useState } from 'react';
import type { CSSProperties, FC } from 'react';

const boxInnerWidth = 164;
const initialFontSize = 12;

const outerBoxStyle: CSSProperties = {
  display: 'flex',
  width: 170,
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

const elementStyle: CSSProperties = {
  margin: '0 5px',
};

export const DisplayInfo: FC<{ info?: (JSX.Element | string)[] }> = ({ info }) => {
  const [fontSize, setFontSize] = useState<number | null>(null);

  const ref = (e: HTMLDivElement | null) => {
    if (e && !fontSize) {
      const { width } = e.getBoundingClientRect();
      width > boxInnerWidth && setFontSize((initialFontSize * boxInnerWidth) / width);
    }
  };

  return info ? (
    <div
      {...{
        ref,
        style: { ...outerBoxStyle, ...innerBoxStyle, fontSize: fontSize ?? initialFontSize },
      }}
    >
      {info.map((e) =>
        typeof e === 'string' ? (
          <span {...{ style: elementStyle }} key={e}>
            {e}
          </span>
        ) : (
          cloneElement(e, {
            ...e.props,
            style: { ...(e.props.style ?? {}), ...elementStyle },
          })
        )
      )}
    </div>
  ) : (
    <div {...{ style: { ...outerBoxStyle, backgroundColor: 'transparent' } }} />
  );
};
