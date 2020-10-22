import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const outDir = 'local_packages/use-interstate-component';

export default {
  input: 'src/App.tsx',
  output: {
    dir: outDir,
    format: 'es',
  },
  external: ['react', 'use-measure-perf'],
  plugins: [typescript(), nodeResolve(), commonjs()],
};
