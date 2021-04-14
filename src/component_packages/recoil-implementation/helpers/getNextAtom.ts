import { getNextKey } from '@compare-react-state-management-solutions/get-next-key';
import { atom } from 'recoil';
import type { Atom, State } from '../State/StateInterface';

export const getNextAtom = <K extends keyof State>(prefix: K, defaultValue: State[K]): Atom<K> =>
  atom({ key: getNextKey(prefix), default: defaultValue });
