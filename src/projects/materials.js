// Ultra-Clean Police Precinct Metallic & Leather Materials

export const metalCabinetBody = {
  color: '#1a1d24',
  metalness: 0.88,
  roughness: 0.28,
}

export const metalDrawerFront = {
  color: '#282d37',
  metalness: 0.85,
  roughness: 0.25,
}

export const metalDrawerFrontHover = {
  color: '#3a4252',
  metalness: 0.90,
  roughness: 0.20,
}

export const polishedChrome = {
  color: '#e6e9ed',
  metalness: 0.96,
  roughness: 0.12,
}

export const policeBrass = {
  color: '#d4af37',
  metalness: 0.92,
  roughness: 0.18,
}

export const labelPlateMat = {
  color: '#fdfbf7',
  metalness: 0.02,
  roughness: 0.90,
}

export const manilaBody = {
  color: '#e6cfab',
  metalness: 0.02,
  roughness: 0.85,
}

export const manilaBodyLight = {
  color: '#f7e7cf',
  metalness: 0.02,
  roughness: 0.78,
}

export function getFolderTabMaterial(hexColor) {
  return { color: hexColor || '#d4af37', metalness: 0.15, roughness: 0.6 }
}