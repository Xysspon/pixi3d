import { expect } from "chai"

describe("Mesh", () => {

  it("should render cylinder correctly using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
      let lightingEnvironment = new PIXI3D.LightingEnvironment(renderer)
      lightingEnvironment.imageBasedLighting = new PIXI3D.ImageBasedLighting(
        resources["assets/chromatic/diffuse.cubemap"].cubemap,
        resources["assets/chromatic/specular.cubemap"].cubemap
      )
      let mesh = PIXI3D.Mesh3D.createCylinder()
      mesh.material.lightingEnvironment = lightingEnvironment
      mesh.rotationQuaternion.setEulerAngles(15, 35, 0)
      renderer.render(mesh)
    }
    await expect(render).to.match("snapshots/cibey.png", {
      resources: [
        "assets/chromatic/specular.cubemap",
        "assets/chromatic/diffuse.cubemap"
      ]
    })
  })

  it("should render circle correctly using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
      let lightingEnvironment = new PIXI3D.LightingEnvironment(renderer)
      lightingEnvironment.imageBasedLighting = new PIXI3D.ImageBasedLighting(
        resources["assets/chromatic/diffuse.cubemap"].cubemap,
        resources["assets/chromatic/specular.cubemap"].cubemap
      )
      let mesh = PIXI3D.Mesh3D.createCircle()
      mesh.material.lightingEnvironment = lightingEnvironment
      renderer.render(mesh)
    }
    await expect(render).to.match("snapshots/npswr.png", {
      resources: [
        "assets/chromatic/specular.cubemap",
        "assets/chromatic/diffuse.cubemap"
      ]
    })
  })

})