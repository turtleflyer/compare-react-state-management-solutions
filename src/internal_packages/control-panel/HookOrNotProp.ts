export type HookOrNotProp<
  PropName extends string,
  T extends unknown = () => void,
  HookName extends string = `use${Capitalize<PropName>}`
> =
  | ({
      [P in PropName]: T;
    } &
      {
        [P in HookName]?: undefined;
      })
  | ({
      [P in PropName]?: undefined;
    } &
      {
        [P in HookName]: T extends any[] ? { [I in keyof T]: () => T[I] } : () => T;
      });
