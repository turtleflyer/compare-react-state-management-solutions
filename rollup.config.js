import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/App.tsx',
  output: {
    dir: 'use-interstate-component',
    format: 'es',
  },
  external: ['react', 'use-measure-perf'],
  plugins: [typescript(), nodeResolve(), commonjs()],
};
