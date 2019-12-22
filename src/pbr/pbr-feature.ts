export enum PhysicallyBasedMaterialFeature {
  normal = "HAS_NORMALS 1",
  texCoord0 = "HAS_UV_SET1 1",
  tangent = "HAS_TANGENTS 1",
  targetPosition = "HAS_TARGET_POSITION",
  targetNormal = "HAS_TARGET_NORMAL",
  targetTangent = "HAS_TARGET_TANGENT",
  weightCount = "WEIGHT_COUNT",
  baseColorMap = "HAS_BASE_COLOR_MAP 1",
  materialMetallicRoughness = "MATERIAL_METALLICROUGHNESS 1",
  materialUnlit = "MATERIAL_UNLIT 1",
  metallicRoughnessMap = "HAS_METALLIC_ROUGHNESS_MAP 1",
  occlusionMap = "HAS_OCCLUSION_MAP 1",
  normalMap = "HAS_NORMAL_MAP 1",
  emissiveMap = "HAS_EMISSIVE_MAP 1",
  ibl = "USE_IBL 1",
  hdr = "USE_HDR 1",
  debugOutput = "DEBUG_OUTPUT 1",
  debugMetallic = "DEBUG_METALLIC 1",
  debugNormal = "DEBUG_NORMAL 1",
  debugRoughness = "DEBUG_ROUGHNESS 1",
  debugOcclusion = "DEBUG_OCCLUSION 1",
  debugEmissive = "DEBUG_EMISSIVE 1",
  debugF0 = "DEBUG_F0 1",
  debugAlpha = "DEBUG_ALPHA 1",
  alphaModeOpaque = "ALPHAMODE_OPAQUE 1",
  alphaModeMask = "ALPHAMODE_MASK 1",
  texLod = "USE_TEX_LOD 1",
  morphing = "USE_MORPHING 1"
}