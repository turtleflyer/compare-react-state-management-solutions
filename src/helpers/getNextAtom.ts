import { getNextKey } from 'get-next-key';
import type { Atom, State } from '../State/StateInterface';

export function getNextAtom<K extends keyof State, D extends State[K] = State[K]>(
  prefix: K,
  defaultValue: D
): Atom<K> {
  return [getNextKey(prefix), defaultValue];
}
