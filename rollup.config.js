import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

process.env.BABEL_ENV = 'production';
const outDir = 'compiled_bundles/recoil';

export default {
  input: 'src/App.tsx',
  output: {
    dir: outDir,
    format: 'es',
  },
  external: ['react', 'react-dom', 'use-measure-perf', /^@babel\/runtime/],
  plugins: [
    babel({ babelHelpers: 'runtime', presets: ['react-app'] }),
    typescript({ target: 'es6' }),
    nodeResolve(),
    commonjs(),
  ],
};
