import cjsToES6 from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/app.js',
  format: 'iife',
  plugins: [ cjsToES6(), resolve() ],
  external: ['big.js'],
  exports: 'none',
  dest: 'static/bundle.js',
};
