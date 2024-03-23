import { ALPHA_MODES, BaseTexture, BufferResource, FORMATS, MIPMAP_MODES, Renderer, SCALE_MODES, TYPES, Texture, WRAP_MODES } from "pixi.js"
import { Capabilities } from "../../capabilities"

export class StandardMaterialMatrixTexture extends Texture {
  private _buffer: Float32Array

  static isSupported(renderer: Renderer) {
    return Capabilities.isFloatingPointTextureSupported(renderer)
  }

  constructor(matrixCount: number) {
    let buffer = new Float32Array(matrixCount * 16)
    let resource = new BufferResource(buffer, { width: 4, height: matrixCount })
    super(new BaseTexture(resource, {
      mipmap: MIPMAP_MODES.OFF,
      wrapMode: WRAP_MODES.CLAMP,
      scaleMode: SCALE_MODES.NEAREST,
      format: FORMATS.RGBA,
      type: TYPES.FLOAT,
      alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
      resolution: 1
    }))
    this._buffer = buffer
  }

  updateBuffer(buffer: Float32Array) {
    this._buffer.set(buffer)
    this.baseTexture.resource.update()
  }
}