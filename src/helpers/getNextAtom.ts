import { getNextKey } from 'get-next-key';
import { atom, RecoilState } from 'recoil';
import type { State } from '../State/StateInterface';

export function getNextAtom<K extends keyof State, D extends State[K] = State[K]>(
  prefix: K,
  defaultValue: D
): RecoilState<D> {
  return atom({ key: getNextKey(prefix), default: defaultValue });
}
