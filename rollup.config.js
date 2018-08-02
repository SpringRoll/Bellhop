import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import prettier from 'rollup-plugin-prettier';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/bellhop.js',
        format: 'es'
      }
    ],
    plugins: [
      eslint(),
      prettier({
        parser: 'babylon'
      })
    ]
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
    plugins: [
      eslint(),
      prettier({
        parser: 'babylon'
      }),
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
    ]
  }
];
