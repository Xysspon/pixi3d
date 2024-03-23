import { State, Renderer, Program } from "pixi.js"
import { Cubemap } from "../cubemap/cubemap"
import { MeshShader } from "../mesh/mesh-shader"
import { Camera } from "../camera/camera"
import { Mesh3D } from "../mesh/mesh"
import { Material } from "../material/material"
import { Shader as Vertex } from "./shader/skybox.vert"
import { Shader as Fragment } from "./shader/skybox.frag"
import { CubemapFormat } from "../cubemap/cubemap-format"

export class SkyboxMaterial extends Material {
  private _cubemap: Cubemap

  get cubemap() {
    return this._cubemap
  }

  set cubemap(value: Cubemap) {
    if (value !== this._cubemap) {
      if (!this._cubemap.valid) {
        // Remove the shader so it can be rebuilt with the current features. 
        // It may happen that we set a texture which is not yet valid, in that 
        // case we don't want to render the skybox until it has become valid.
        this._shader = undefined
      }
      this._cubemap = value
    }
  }

  camera?: Camera

  exposure = 1

  constructor(cubemap: Cubemap) {
    super()
    this._cubemap = cubemap
    this.state = Object.assign(new State(), {
      culling: true, clockwiseFrontFace: true, depthTest: true, depthMask: false
    })
  }

  updateUniforms(mesh: Mesh3D, shader: MeshShader) {
    let camera = this.camera || Camera.main

    shader.uniforms.u_ModelMatrix = mesh.worldTransform.array
    shader.uniforms.u_View = camera.view.array
    shader.uniforms.u_Projection = camera.projection.array
    shader.uniforms.u_EnvironmentSampler = this.cubemap
    shader.uniforms.u_RGBE = this.cubemap.cubemapFormat === CubemapFormat.rgbe8
    shader.uniforms.u_Exposure = this.exposure
  }

  render(mesh: Mesh3D, renderer: Renderer) {
    // Disable writing to the depth buffer. This is because we want all other 
    // objects to be in-front of the skybox.
    renderer.gl.depthMask(false)
    super.render(mesh, renderer)
    renderer.gl.depthMask(true)
  }

  createShader() {
    if (this.cubemap.valid) {
      return new MeshShader(Program.from(Vertex.source, Fragment.source))
    }
  }
}