/* eslint-disable @typescript-eslint/naming-convention */
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { config } from 'dotenv';
import env from 'rollup-plugin-inject-process-env';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';

import * as pkg from './package.json';

config({ path: './.env' });

const isProd = process.env.NODE_ENV === 'production';

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.es6', '.es', '.mjs'];

const envVars = (vars =>
  Object.entries({
    ...process.env,
    APP_NAME: pkg.name,
    APP_SHORT_NAME: pkg.shortName,
    APP_LONG_NAME: pkg.longName,
    APP_VERSION: pkg.version
  }).reduce((obj, [key, value]) => ({ ...obj, ...(vars.includes(key) ? { [key]: value } : {}) }), {}))([
  'NODE_ENV',
  'SPEEDTEST_VALUE_MULTIPLIER',
  'SPEEDTEST_EXPECTED_DOWN',
  'SPEEDTEST_EXPECTED_UP',
  'SPEEDTEST_EXPECTED_PING',
  'DATE_FULL',
  'DATE_SHORT',
  'TIME_FULL',
  'TIME_SHORT',
  'APP_NAME',
  'APP_SHORT_NAME',
  'APP_LONG_NAME',
  'APP_VERSION'
]);

export default {
  input: 'src/client/main.tsx',
  output: {
    sourcemap: true,
    dir: 'dist/client',
    format: 'es'
  },
  plugins: [
    resolve({
      extensions,
      browser: true
    }),
    commonjs(),
    json(),
    env(envVars, {
      include: ['node_modules/tiny-warning/dist/tiny-warning.esm.js']
    }),
    typescript({
      tsconfig: './tsconfig.client.json'
    }),
    babel({
      extensions,
      include: 'src/(client|shared)/**/*.(ts|tsx)',
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    }),
    ...(isProd ? [terser()] : []),
    visualizer(),
    ...(!isProd
      ? [
          livereload({
            watch: ['dist/client'],
            verbose: true
          })
        ]
      : [])
  ]
};
