import { getDirectoryEntries, resolvePath } from './filesystemModel';

export function tabComplete(currentDir, inputString, cursorPosition) {
  const beforeCursor = inputString.slice(0, cursorPosition);
  const afterCursor = inputString.slice(cursorPosition);

  const tokens = beforeCursor.trim().split(/\s+/);
  const command = tokens[0] || '';

  if (tokens.length === 1 && !beforeCursor.endsWith(' ')) {
    const commands = ['ls', 'cd', 'cat', 'pwd', 'clear', 'cls', 'help'];
    const matches = commands.filter(c => c.startsWith(command));
    if (matches.length === 1) {
      return { newInput: matches[0] + ' ', matches: [], showList: false };
    }
    if (matches.length > 1) {
      const prefix = longestCommonPrefix(matches);
      return { newInput: prefix, matches, showList: false };
    }
    return { newInput: inputString, matches: [], showList: false };
  }

  const partial = tokens.length > 1 && !beforeCursor.endsWith(' ')
    ? tokens[tokens.length - 1]
    : '';

  const isCd = command === 'cd';
  const isLs = command === 'ls';
  const isCat = command === 'cat';

  if (!isCd && !isLs && !isCat) {
    return { newInput: inputString, matches: [], showList: false };
  }

  const entries = getDirectoryEntries(currentDir);
  let candidates = entries;

  if (isCd) {
    candidates = entries.filter(([, node]) => node.type === 'directory');
  } else if (isCat) {
    candidates = entries.filter(([, node]) => node.type === 'file');
  }

  const matches = candidates.filter(([name]) =>
    name.startsWith(partial)
  );

  if (matches.length === 0) {
    return { newInput: inputString, matches: [], showList: false };
  }

  if (matches.length === 1) {
    const [name, node] = matches[0];
    const suffix = node.type === 'directory' ? '/' : '';
    const completedToken = name + suffix;
    const newToken = completedToken + (node.type === 'directory' ? '' : ' ');

    const newTokens = [...tokens.slice(0, -1), newToken];
    const newInput = newTokens.join(' ') + (beforeCursor.endsWith(' ') ? ' ' : '') + afterCursor;

    return { newInput, matches: [], showList: false };
  }

  const names = matches.map(([name]) => name);
  const prefix = longestCommonPrefix(names);

  if (prefix.length > partial.length) {
    const newTokens = [...tokens.slice(0, -1), prefix];
    const newInput = newTokens.join(' ') + afterCursor;
    return { newInput, matches, showList: false };
  }

  return { newInput: inputString, matches, showList: true };
}

function longestCommonPrefix(strings) {
  if (strings.length === 0) return '';
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (prefix === '') return '';
    }
  }
  return prefix;
}