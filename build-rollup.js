const path = require('path');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const filesize = require("rollup-plugin-filesize")
const commonjs = require("rollup-plugin-commonjs")
const resolve = require("rollup-plugin-node-resolve")

const externals = ['strudel', 'mobx', 'lit-html'];

const builds = [
  {
    mode: 'umd',
    filename: 'index.js'
  }
];

const plugins = [
    babel({
        exclude: "node_modules/**",
        presets: ["es2015-rollup"],
    }),
    resolve({
        module: true,
        main: true
    }),
    commonjs()
];

plugins.push(filesize());

builds.forEach((config) => {
  rollup.rollup({
    input: "src/index.js",
    external: externals,
    plugins: plugins
  })
  .then((bundle) => {
    var options = {
        file: path.resolve(__dirname, config.filename),
        format: config.mode.endsWith(".min") ? config.mode.slice(0, -".min".length) : config.mode,
        name: "strudelMobx",
        exports: "named",
        globals: {
            "lit-html": "lit-html",
            strudel: "strudel",
            mobx: "mobx"
        }
    }

    return bundle.write(options);
  }).catch(function(reason) {
    console.error(reason)
    process.exit(-1)
  });
});