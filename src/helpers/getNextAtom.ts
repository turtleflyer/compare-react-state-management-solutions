import { getNextKey } from '@~internal/get-next-key';
import { atom } from 'recoil';
import type { Atom, State } from '../State/StateInterface';

export function getNextAtom<K extends keyof State>(prefix: K, defaultValue: State[K]): Atom<K> {
  return atom({ key: getNextKey(prefix), default: defaultValue });
}
