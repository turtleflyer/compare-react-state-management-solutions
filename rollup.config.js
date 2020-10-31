import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

process.env.BABEL_ENV = 'production';

const outDir = 'compiled_bundles/use-interstate';

export default {
  input: 'src/App.tsx',
  output: {
    dir: outDir,
    format: 'es',
  },
  external: ['react', 'use-measure-perf', /^@babel\/runtime/],
  plugins: [
    babel({ babelHelpers: 'runtime', presets: ['react-app'] }),
    typescript({ target: 'es6' }),
    nodeResolve(),
  ],
};
