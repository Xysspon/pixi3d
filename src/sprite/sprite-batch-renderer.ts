import { BatchRenderer, BatchShaderGenerator, ExtensionMetadata, ExtensionType, IBatchableElement, Renderer, ViewableBuffer, extensions, utils } from "pixi.js"
import { Shader as Fragment } from "./shader/sprite.frag"
import { Shader as Vertex } from "./shader/sprite.vert"
import { SpriteBatchGeometry } from "./sprite-batch-geometry"

export class SpriteBatchRenderer extends BatchRenderer {
  constructor(renderer: Renderer) {
    super(renderer)

    this.shaderGenerator = new BatchShaderGenerator(Vertex.source, Fragment.source)
    this.geometryClass = SpriteBatchGeometry

    // The vertex size when rendering 2D sprites is 6. Here, 16 is being added 
    // to hold the model matrix.
    this.vertexSize = 6 + 16

    Object.assign(this.state, {
      culling: false, clockwiseFrontFace: false, depthTest: true
    })
  }

  packInterleavedGeometry(element: IBatchableElement, attributeBuffer: ViewableBuffer, indexBuffer: Uint16Array, aIndex: number, iIndex: number) {
    const { uint32View, float32View } = attributeBuffer
    const packedVertices = aIndex / this.vertexSize
    const uvs = element.uvs
    const indicies = element.indices
    const vertexData = element.vertexData
    const textureId = element._texture.baseTexture._batchLocation

    const alpha = Math.min(element.worldAlpha, 1.0)
    const argb = (alpha < 1.0
      && element._texture.baseTexture.alphaMode)
      ? utils.premultiplyTint(element._tintRGB, alpha)
      : element._tintRGB + (alpha * 255 << 24)

    for (let i = 0; i < vertexData.length; i += 2) {
      float32View[aIndex++] = vertexData[i]
      float32View[aIndex++] = vertexData[i + 1]
      float32View[aIndex++] = uvs[i]
      float32View[aIndex++] = uvs[i + 1]
      uint32View[aIndex++] = argb
      float32View[aIndex++] = textureId

      // @ts-ignore Element does have a modelViewProjection
      let modelViewProjection: Float32Array = element.modelViewProjection.array
      for (let j = 0; j < 16; j++) {
        float32View[aIndex++] = modelViewProjection[j]
      }
    }
    for (let i = 0; i < indicies.length; i++) {
      indexBuffer[iIndex++] = packedVertices + indicies[i]
    }
  }


  static extension: ExtensionMetadata = {
    type: [ExtensionType.RendererPlugin],
    name: "sprite3d"
  }
}

extensions.add(SpriteBatchRenderer)