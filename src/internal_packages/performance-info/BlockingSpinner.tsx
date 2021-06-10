import type { CSSProperties, FC } from 'react';
import React, { useRef } from 'react';
import { useBlockingArea, useToBlock } from './BlockingParametersProvider';

const NUMBER_OF_CIRCLES = 8;
const NUMBER_FADED_CIRCLES = 4;
const LAST_CIRCLE_OPACITY = 0.15;

const spinPendingEffectKeyframes = `
@keyframes spinPendingEffect {
  from {transform: rotate(0);}
  to {transform: rotate(1turn);}
}`;

const pendingEffectContainerStyle: CSSProperties = {
  animationName: 'spinPendingEffect',
  animationDuration: '1s',
  animationTimingFunction: 'cubic-bezier(0.34, 0.46, 0.87, 0.71)',
  animationIterationCount: 'infinite',
};

const circleStyle: CSSProperties = {
  position: 'absolute',
  left: -20,
  top: -20,
  height: 10,
  width: 10,
  borderRadius: 10,
  backgroundColor: '#9e9e9e',
  transformOrigin: '20px 20px',
};

const outerContainerStyle: CSSProperties = {
  height: 0,
};

const spinnerContainerStyle: CSSProperties = {
  position: 'relative',
  backgroundColor: 'rgba(255,255,255,50%)',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
};

const PendingEffect: FC = () => {
  return (
    <>
      <style>{spinPendingEffectKeyframes}</style>
      <div {...{ style: pendingEffectContainerStyle }}>
        {Array(NUMBER_OF_CIRCLES)
          .fill(null)
          .map((_, i) => (
            <div
              {...{
                style: {
                  ...circleStyle,
                  transform: `rotate(${i / NUMBER_OF_CIRCLES}turn)`,
                  opacity:
                    i < NUMBER_FADED_CIRCLES
                      ? (1 - LAST_CIRCLE_OPACITY) * (i / NUMBER_FADED_CIRCLES) + LAST_CIRCLE_OPACITY
                      : 1,
                },
              }}
              key={i}
            />
          ))}
      </div>
    </>
  );
};

export const BlockingSpinner: FC<{ zIndex?: number }> = ({ zIndex = 0 }) => {
  const area = useBlockingArea();
  const toShow = useToBlock();
  const outerContainerRef = useRef<HTMLDivElement | null>(null);

  return toShow ? (
    <div {...{ style: outerContainerStyle, ref: outerContainerRef }}>
      {outerContainerRef.current && (
        <div
          {...{
            style: {
              ...spinnerContainerStyle,
              zIndex,
              top: area.top - outerContainerRef.current.getBoundingClientRect().top,
              left: area.left - outerContainerRef.current.getBoundingClientRect().left,
              height: area.bottom - area.top,
              width: area.right - area.left,
            },
          }}
        >
          <PendingEffect />
        </div>
      )}
    </div>
  ) : null;
};
