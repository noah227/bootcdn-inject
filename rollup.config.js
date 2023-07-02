const {nodeResolve} = require("@rollup/plugin-node-resolve")
const commonjs = require("@rollup/plugin-commonjs")
const typescript = require("@rollup/plugin-typescript")
const terser = require("@rollup/plugin-terser")

const plugins = [
    nodeResolve(),
    typescript(),
    commonjs(),
    terser()
]

module.exports = [
    {
        input: "./src/pick/index.ts",
        output: {
            file: "./src/pick/index.js",
            format: "cjs",
            exports: "auto",
            sourcemap: true
        },
        plugins: [
            ...plugins
        ]
    },
]
