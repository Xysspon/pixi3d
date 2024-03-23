import { ExtensionType, LoaderParser, extensions } from "pixi.js"
import { glTFAsset } from "../gltf/gltf-asset"

export const glTFLoader: LoaderParser = {
  test(url: string): boolean {
    return url.includes(".gltf") || url.includes(".glb")
  },
  async load<T>(url: string): Promise<T> {
    return (await glTFAsset.fromURL(url)) as T
  },
  extension: {
    type: [ExtensionType.LoadParser], name: "gltf"
  }
}

extensions.add(glTFLoader)