import esbuild from "rollup-plugin-esbuild";
import image from "@rollup/plugin-image"
import resolve from '@rollup/plugin-node-resolve'
import glsl from "./rollup-plugin-glsl.mjs"

import fs from "fs"
const pkg = JSON.parse(fs.readFileSync("./package.json"))

const packages = [
  "pixi.js",
  "@pixi/assets",
  "@pixi/constants",
  "@pixi/core",
  "@pixi/display",
  "@pixi/loaders",
  "@pixi/math",
  "@pixi/settings",
  "@pixi/sprite",
  "@pixi/ticker",
  "@pixi/utils"
]

const globals = {}
packages.forEach(function (key) {
  globals[key] = key === "@pixi/utils" ? "PIXI.utils" : "PIXI"
})
const banner = `/* Pixi3D v${pkg.version} */`

const plugins = ({ compatibility = {}, minify = false } = {}) => [
  esbuild({
    target: "es2017",
    minify
  }),
  image(),
  glsl(),
  resolve()
]

const config = (file, format, options) => {
  return {
    input: "src/index.ts",
    external: packages,
    plugins: plugins(options),
    output: [{
      file: file,
      format: format,
      sourcemap: true,
      name: "PIXI3D",
      globals,
      banner,
    }]
  }
}

const format = (path, format, options = {}) => {
  return [
    config(path + "pixi3d.js", format, { minify: false, ...options }),
    config(path + "pixi3d.min.js", format, { minify: true, ...options }),
  ]
}

export default [
  ...format("dist/browser/", "iife", {
    compatibility: {
      loaders: true,
      assets: true
    }
  }),
  ...format("dist/cjs/", "cjs", {
    compatibility: {
      loaders: false,
      assets: true
    }
  }),
  ...format("dist/esm/", "esm", {
    compatibility: {
      loaders: false,
      assets: true
    }
  })
]