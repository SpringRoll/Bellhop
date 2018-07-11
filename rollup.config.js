import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import prettier from 'rollup-plugin-prettier';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

export default [
  {
    input: 'src/Bellhop.js',
    output: [
      {
        file: 'bellhop.js',
        format: 'es',
        sourceMap: true,
        extend: true
      },
      {
        file: 'ellhop.umd.js',
        format: 'umd',
        sourceMap: true,
        name: 'window',
        extend: true
      },
      {
        file: 'bellhop.cjs.js',
        format: 'cjs',
        sourceMap: true,
        extend: true
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
        browser: true
      }),
      commonjs(),
      babel(),
      uglify({
        sourceMap: true
      })
    ]
  }
];
