import cjsToES6 from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/app.js',
  dest: 'static/bundle.js',
  format: 'iife',
  exports: 'none',
  external: [
    'big.js',
    'd3',
  ],
  globals: {
    'big.js': 'Big',
    'd3': 'd3',
  },
  plugins: [
    cjsToES6(), // libraries go from commonjs to es6
    resolve(), // our source code and transpiled libraries use es6
    babel({ // generate es5 for browser compatibility
      exclude: 'node_modules/**' // only transpile our source code
    }),
  ],
};
