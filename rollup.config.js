import  resolve  from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { eslint }from 'rollup-plugin-eslint';
import prettier from 'rollup-plugin-prettier';
import { terser } from 'rollup-plugin-terser'; 
import babel from 'rollup-plugin-babel';

const prettierConfig = require('./.prettierrc');

const plugins = [
  eslint(),
  prettier(prettierConfig),
  resolve({
    mainFields: ["module", "jsnext:main", "main", "browser"],
    preferBuiltins: false
  }),
  commonjs(),
  babel({ runtimeHelpers: true }),
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
        sourceMap: true
      }
    ],
    plugins: plugins
  }
];
