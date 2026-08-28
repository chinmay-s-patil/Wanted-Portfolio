import { D } from './dimensions'
import Folder from './Folder'

function hashStringToUnit(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return (Math.abs(hash) % 1000) / 1000
}

const COL_COUNT = 3
const COL_SPAN = D.drawerWidth * 0.55 // use 55% of drawer width for the grid
const COL_XS = Array.from({ length: COL_COUNT }, (_, i) =>
  (i - (COL_COUNT - 1) / 2) * (COL_SPAN / (COL_COUNT - 1))
)

// Folders are arranged in a 3-column grid across the drawer width (X axis).
// Each column holds folders stacked back along -Z. A small per-folder
// jitter + yaw keeps each one visually distinct from the fixed 3/4 angle.
export function folderRestTransform(index, id, totalCount) {
  const seed = hashStringToUnit(id)
  const col = index % COL_COUNT
  const row = Math.floor(index / COL_COUNT)

  const tiltRad = (seed - 0.5) * 0.08   // slight roll, ±~2.3°
  const yawRad = (seed - 0.5) * 0.25   // ±~7°, fans each folder open
  const lift = Math.sin(row * 2.1 + col * 1.3) * 0.005
  const z = -row * (D.folderThickness + D.folderSpacing)
  const x = COL_XS[col] + (seed - 0.5) * 0.03

  return { x, z, tiltRad, yawRad, y: lift }
}

export default function FolderRow({ data, onSelectProject }) {
  return (
    <group position={[0, -D.drawerHeight / 2 + D.folderHeight / 2 + 0.03, 0.15]}>
      {data.folders.map((folder, idx) => (
        <Folder
          key={folder.id}
          data={folder}
          index={idx}
          drawerColor={data.color}
          restTransform={folderRestTransform(idx, folder.id, data.folders.length)}
          onSelectProject={onSelectProject}
        />
      ))}
    </group>
  )
}