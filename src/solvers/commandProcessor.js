import { resolvePath, getDirectoryEntries, filesystem, getPromptPath } from './filesystemModel';

export function processCommand(currentDir, inputString) {
  const trimmed = inputString.trim();
  if (!trimmed) {
    return { newDir: currentDir, outputLines: [] };
  }

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  switch (cmd) {
    case 'ls':
      return handleLs(currentDir, args);
    case 'cd':
      return handleCd(currentDir, args);
    case 'cat':
      return handleCat(currentDir, args);
    case 'pwd':
      return handlePwd(currentDir);
    case 'clear':
    case 'cls':
      return { newDir: currentDir, outputLines: [], clear: true };
    case 'help':
      return handleHelp(currentDir);
    default:
      return {
        newDir: currentDir,
        outputLines: [{ type: 'error', text: `command not found: ${cmd}` }]
      };
  }
}

function handleLs(currentDir, args) {
  const targetPath = args[0] || '.';
  const target = resolvePath(currentDir, targetPath);

  if (!target) {
    return {
      newDir: currentDir,
      outputLines: [{ type: 'error', text: `ls: cannot access '${targetPath}': No such file or directory` }]
    };
  }

  if (target.type === 'file') {
    return {
      newDir: currentDir,
      outputLines: [{ type: 'file', text: target.name, clickable: true, node: target }]
    };
  }

  const entries = getDirectoryEntries(target);
  const lines = entries.map(([name, node]) => ({
    type: node.type,
    text: name,
    clickable: true,
    node
  }));

  return { newDir: currentDir, outputLines: lines };
}

function handleCd(currentDir, args) {
  const targetPath = args[0] || '~';

  if (targetPath === '.' || targetPath === './') {
    return { newDir: currentDir, outputLines: [] };
  }

  const target = resolvePath(currentDir, targetPath);

  if (!target) {
    return {
      newDir: currentDir,
      outputLines: [{ type: 'error', text: `cd: no such file or directory: ${targetPath}` }]
    };
  }

  if (target.type === 'file') {
    return {
      newDir: currentDir,
      outputLines: [{ type: 'error', text: `cd: not a directory: ${targetPath}` }]
    };
  }

  return { newDir: target, outputLines: [] };
}

function handleCat(currentDir, args) {
  if (args.length === 0) {
    return {
      newDir: currentDir,
      outputLines: [{ type: 'error', text: 'cat: missing file operand' }]
    };
  }

  const filePath = args[0];
  const target = resolvePath(currentDir, filePath);

  if (!target) {
    return {
      newDir: currentDir,
      outputLines: [{ type: 'error', text: `cat: ${filePath}: No such file or directory` }]
    };
  }

  if (target.type === 'directory') {
    return {
      newDir: currentDir,
      outputLines: [{ type: 'error', text: `cat: ${filePath}: Is a directory` }]
    };
  }

  return {
    newDir: currentDir,
    outputLines: [{
      type: 'banner',
      variant: target.variantData,
      family: target.familyData
    }]
  };
}

function handlePwd(currentDir) {
  return {
    newDir: currentDir,
    outputLines: [{ type: 'text', text: getPromptPath(currentDir) }]
  };
}

function handleHelp(currentDir) {
  const lines = [
    { type: 'text', text: 'Available commands:' },
    { type: 'text', text: '' },
    { type: 'command', text: '  ls [path]     ' },
    { type: 'text', text: '    List directory contents' },
    { type: 'command', text: '  cd <path>     ' },
    { type: 'text', text: '    Change directory' },
    { type: 'command', text: '  cat <file>    ' },
    { type: 'text', text: '    Display file contents (OpenFOAM banner)' },
    { type: 'command', text: '  pwd           ' },
    { type: 'text', text: '    Print working directory' },
    { type: 'command', text: '  clear / cls   ' },
    { type: 'text', text: '    Clear the terminal' },
    { type: 'command', text: '  help          ' },
    { type: 'text', text: '    Show this help message' },
    { type: 'text', text: '' },
    { type: 'text', text: 'Navigation tips:' },
    { type: 'text', text: '  • Click any name in ls output to navigate' },
    { type: 'text', text: '  • Press Tab for auto-completion' },
    { type: 'text', text: '  • Use ↑ / ↓ for command history' }
  ];
  return { newDir: currentDir, outputLines: lines };
}