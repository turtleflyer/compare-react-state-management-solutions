import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const outDir = 'compiled_bundles/recoil';

export default {
  input: 'src/App.tsx',
  output: {
    dir: outDir,
    format: 'es',
  },
  external: ['react', 'use-measure-perf'],
  plugins: [typescript(), nodeResolve(), commonjs()],
};
