import type { FocusEvent, FocusEventHandler } from 'react';

const disabledOnFocus = <H extends HTMLElement>(event: FocusEvent<H>): void => {
  event.preventDefault();
  event.target.blur();
};

export const createOnFocus = <H extends HTMLElement = HTMLElement>(
  disableInput: boolean,
  defaultOnFocus: FocusEventHandler<H> | undefined = undefined
): FocusEventHandler<H> | undefined => (disableInput ? disabledOnFocus : defaultOnFocus);
