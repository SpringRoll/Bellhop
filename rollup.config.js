import  { nodeResolve }  from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import  eslint from '@rollup/plugin-eslint';
import  terser  from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';

const plugins = [
  eslint(),
  nodeResolve({
    mainFields: ['module', 'jsnext:main', 'main', 'browser'],
    preferBuiltins: false
  }),
  commonjs(),
  babel({ babelHelpers: 'runtime', skipPreflightCheck: true }),
  terser()
];

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/bellhop.js',
        format: 'es'
      }
    ],
    plugins: plugins
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/bellhop-umd.js',
        format: 'umd',
        name: 'window',
        extend: true,
        sourcemap: true
      }
    ],
    plugins: plugins,
    external: ['@babel/runtime']
  }
];
