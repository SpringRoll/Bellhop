import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const sharedPlugins = [
  nodeResolve({
    mainFields: ['module', 'jsnext:main', 'main', 'browser'],
    preferBuiltins: false
  }),
  commonjs(),
  terser()
];

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/bellhop.js',
        format: 'es'
      }
    ],
    plugins: [
      typescript({ tsconfig: './tsconfig.json', declaration: true, declarationDir: 'dist' }),
      ...sharedPlugins
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/bellhop-umd.js',
        format: 'umd',
        name: 'window',
        extend: true,
        sourcemap: true
      }
    ],
    plugins: [
      typescript({ tsconfig: './tsconfig.json', declaration: false, declarationMap: false }),
      ...sharedPlugins
    ],
    external: ['tslib']
  }
];
