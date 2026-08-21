import { solverData } from './solverData';

export function buildFilesystem() {
  const root = {
    type: 'directory',
    name: '~/solvers',
    children: {}
  };

  for (const family of solverData) {
    const familyDir = {
      type: 'directory',
      name: family.folderName,
      parent: root,
      children: {},
      familyData: family
    };

    for (const variant of family.variants) {
      const file = {
        type: 'file',
        name: variant.fileName,
        parent: familyDir,
        variantData: variant,
        familyData: family
      };
      familyDir.children[variant.fileName] = file;
    }

    root.children[family.folderName] = familyDir;
  }

  return root;
}

export const filesystem = buildFilesystem();

export function getDirectoryEntries(dir) {
  if (!dir || dir.type !== 'directory') return [];
  return Object.entries(dir.children);
}

export function resolvePath(currentDir, pathStr) {
  if (!pathStr || pathStr === '~') return filesystem;

  let parts = pathStr.split('/').filter(p => p && p !== '.' && p !== '~');
  let node = pathStr.startsWith('~') ? filesystem : currentDir;

  // Root IS ~/solvers, so skip 'solvers' if it's the first segment
  if (node === filesystem && parts[0] === 'solvers') {
    parts = parts.slice(1);
  }

  for (const part of parts) {
    if (part === '..') {
      node = node.parent || filesystem;
    } else if (node.type === 'directory' && node.children[part]) {
      node = node.children[part];
    } else {
      return null;
    }
  }

  return node;
}

export function getPromptPath(currentDir) {
  if (currentDir === filesystem) return '~/solvers';
  if (currentDir.parent === filesystem) return `~/solvers/${currentDir.name}`;
  return currentDir.name;
}