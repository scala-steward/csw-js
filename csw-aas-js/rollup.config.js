import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import svgr from '@svgr/rollup'
import json from 'rollup-plugin-json'

import pkg from './package.json'
import copy from 'rollup-plugin-copy'

export default {
  input: 'src/aas.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    postcss({
      modules: true,
    }),
    url(),
    svgr(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,

      plugins: ['@babel/plugin-proposal-class-properties'],
    }),
    json(),
    resolve({
      browser: true,
      extensions: ['.js', '.jsx'],
    }),
    commonjs(),
    copy({
      targets: [
        'src/typings/csw-aas-js.d.ts'
      ],
      outputFolder: 'dist'
    })
  ],
}
