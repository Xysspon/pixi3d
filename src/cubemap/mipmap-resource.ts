import { ALPHA_MODES, ArrayResource, BaseImageResource, BaseTexture, BufferResource, FORMATS, Renderer, TYPES, Texture } from "pixi.js"

export class MipmapResource extends ArrayResource {
  constructor(source: (string | Texture)[], public target: number) {
    super(source)
  }

  upload(renderer: Renderer, baseTexture: BaseTexture) {
    renderer.gl.pixelStorei(renderer.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
      baseTexture.alphaMode === ALPHA_MODES.UNPACK)

    for (let i = 0; i < this.items.length; i++) {
      const resource = this.items[i].resource
      if (resource instanceof BufferResource) {
        renderer.gl.texImage2D(this.target, i, <FORMATS>baseTexture.format,
          resource.width, resource.height, 0, <FORMATS>baseTexture.format, <TYPES>baseTexture.type, resource.data)
      }
      if (resource instanceof BaseImageResource) {
        renderer.gl.texImage2D(this.target, i, <FORMATS>baseTexture.format,
          <FORMATS>baseTexture.format, <TYPES>baseTexture.type, resource.source)
      }
    }
    return true
  }
}