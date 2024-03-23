import { ExtensionType, LoaderParser, extensions, settings } from "pixi.js"

export const ShaderSourceLoader: LoaderParser = {
  test(url: string): boolean {
    return url.includes(".glsl") || url.includes(".vert") || url.includes(".frag")
  },
  async load<T>(url: string): Promise<T> {
    const response = await settings.ADAPTER.fetch(url)
    return (await response.text()) as T
  },
  extension: {
    type: [ExtensionType.LoadParser],
    name: "shader"
  }
}

extensions.add(ShaderSourceLoader)