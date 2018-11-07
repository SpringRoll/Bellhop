import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import prettier from 'rollup-plugin-prettier';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

const prettierConfig = require('./.prettierrc');

const plugins = [
  eslint(),
  prettier(prettierConfig),
  resolve({
    module: true,
    jsnext: true,
    main: true,
    browser: true,
    preferBuiltins: false
  }),
  commonjs(),
  babel(),
  uglify()
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
        file: 'bellhop-umd.js',
        format: 'umd',
        name: 'window',
        extend: true,
        sourceMap: true
      }
    ],
    plugins: plugins
  }
];
