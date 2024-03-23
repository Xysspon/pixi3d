import { Assets, ExtensionType, LoaderParser, Texture, extensions, settings } from "pixi.js"
import { Cubemap } from "../cubemap/cubemap"
import { CubemapFaces } from "../cubemap/cubemap-faces"
import { CubemapFormat } from "../cubemap/cubemap-format"

interface CubemapFileVersion {
  format: CubemapFormat
  mipmaps: string[]
}

class CubemapFileVersion1 implements CubemapFileVersion {
  constructor(private json: any) { }

  get format() {
    return CubemapFormat.ldr
  }

  get mipmaps(): string[] {
    return this.json
  }
}

class CubemapFileVersion2 implements CubemapFileVersion {
  constructor(private json: any) { }

  get format() {
    return <CubemapFormat>this.json.format
  }

  get mipmaps(): string[] {
    return <string[]>this.json.mipmaps
  }
}

namespace CubemapFileVersionSelector {
  export function getFileVersion(json: any): CubemapFileVersion {
    if (json.version === 2) {
      return new CubemapFileVersion2(json)
    }
    return new CubemapFileVersion1(json)
  }
}

export const CubemapLoader: LoaderParser = {
  test(url: string): boolean {
    return url.includes(".cubemap")
  },
  async load<T>(url: string): Promise<T> {
    const response = await settings.ADAPTER.fetch(url)
    const json = await response.json()
    const version = CubemapFileVersionSelector.getFileVersion(json)
    const mipmaps = version.mipmaps.map(mipmap => {
      return Cubemap.faces.map(face => {
        return url.substring(0, url.lastIndexOf("/") + 1) + mipmap.replace("{{face}}", face)
      })
    })
    const textures: CubemapFaces[] = []
    for (let mipmap of mipmaps) {
      let faceMipMaps = <CubemapFaces>{
        posx: await Assets.load<Texture>(mipmap[0]),
        negx: await Assets.load<Texture>(mipmap[1]),
        posy: await Assets.load<Texture>(mipmap[2]),
        negy: await Assets.load<Texture>(mipmap[3]),
        posz: await Assets.load<Texture>(mipmap[4]),
        negz: await Assets.load<Texture>(mipmap[5]),
      }
      textures.push(faceMipMaps)
    }
    let cubemap = Cubemap.fromFaces(textures)
    cubemap.cubemapFormat = version.format
    return cubemap as T
  },
  extension: {
    type: [ExtensionType.LoadParser], name: "cubemap"
  }
}

extensions.add(CubemapLoader)