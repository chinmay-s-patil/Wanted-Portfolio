export const metalDark = {
  color: '#2a2622',
  metalness: 0.82,
  roughness: 0.35,
}

export const metalMid = {
  color: '#4a443c',
  metalness: 0.78,
  roughness: 0.32,
}

export const metalLight = {
  color: '#6e655a',
  metalness: 0.72,
  roughness: 0.30,
}

export const brass = {
  color: '#c4a574',
  metalness: 0.88,
  roughness: 0.22,
}

export const labelPlateMat = {
  color: '#f6efe2',
  metalness: 0.05,
  roughness: 0.85,
}

export const manilaBody = {
  color: '#e8dcc8',
  metalness: 0,
  roughness: 0.88,
}

export const manilaBodyLight = {
  color: '#f5ebe0',
  metalness: 0,
  roughness: 0.82,
}

export function getFolderTabMaterial(hexColor) {
  return { color: hexColor, metalness: 0.15, roughness: 0.7 }
}