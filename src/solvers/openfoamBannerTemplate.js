export function renderBanner(variant, family) {
  const lines = [];

  lines.push({ type: 'logo', text: '/*---------------------------------------------------------------------------*\\\\' });
  lines.push({ type: 'logo', text: '|\\\\    /\\\\\\\\\\\\    /       | OpenFOAM: The Open Source CFD Toolbox           |' });
  lines.push({ type: 'logo', text: '| \\\\  /    \\\\  /        | Version:  v2412                                  |' });
  lines.push({ type: 'logo', text: '|  \\\\/     \\\\/         | Website:  www.openfoam.com                        |' });
  lines.push({ type: 'logo', text: '|   \\\\     /          |                                                   |' });
  lines.push({ type: 'logo', text: '|    \\\\   /           | Copyright (C) 2024 OpenFOAM Foundation              |' });
  lines.push({ type: 'logo', text: '|     \\\\_/            | Copyright (C) 2024 OpenCFD Ltd.                   |' });
  lines.push({ type: 'logo', text: '\\\\*---------------------------------------------------------------------------*/' });

  lines.push({ type: 'text', text: '' });
  lines.push({ type: 'keyword', text: 'License' });
  lines.push({ type: 'text', text: '    This file is part of OpenFOAM.' });
  lines.push({ type: 'text', text: '' });
  lines.push({ type: 'text', text: '    OpenFOAM is free software: you can redistribute it and/or modify it' });
  lines.push({ type: 'text', text: '    under the terms of the GNU General Public License as published by' });
  lines.push({ type: 'text', text: '    the Free Software Foundation, either version 3 of the License, or' });
  lines.push({ type: 'text', text: '    (at your option) any later version.' });
  lines.push({ type: 'text', text: '' });
  lines.push({ type: 'text', text: '    OpenFOAM is distributed in the hope that it will be useful, but WITHOUT' });
  lines.push({ type: 'text', text: '    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or' });
  lines.push({ type: 'text', text: '    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License' });
  lines.push({ type: 'text', text: '    for more details.' });
  lines.push({ type: 'text', text: '' });
  lines.push({ type: 'text', text: '    You should have received a copy of the GNU General Public License' });
  lines.push({ type: 'text', text: '    along with OpenFOAM.  If not, see <http://www.gnu.org/licenses/>.' });

  lines.push({ type: 'text', text: '' });
  lines.push({ type: 'keyword', text: 'Application' });
  lines.push({ type: 'text', text: `    ${variant.application}` });

  lines.push({ type: 'text', text: '' });
  lines.push({ type: 'keyword', text: 'Group' });
  lines.push({ type: 'text', text: `    ${variant.group}` });

  lines.push({ type: 'text', text: '' });
  lines.push({ type: 'keyword', text: 'Description' });
  for (const para of variant.description) {
    lines.push({ type: 'text', text: `    ${para}` });
  }

  if (variant.requiredFields && variant.requiredFields.length > 0) {
    lines.push({ type: 'text', text: '' });
    lines.push({ type: 'keyword', text: 'Required fields' });
    lines.push({ type: 'text', text: '    Symbol | Meaning                | Units' });
    lines.push({ type: 'text', text: '    -------|------------------------|-------' });
    for (const field of variant.requiredFields) {
      const symbol = field.symbol.padEnd(6);
      const meaning = field.meaning.padEnd(22);
      lines.push({ type: 'text', text: `    ${symbol} | ${meaning} | ${field.units}` });
    }
  }

  if (variant.requiredDictionaries && variant.requiredDictionaries.length > 0) {
    lines.push({ type: 'text', text: '' });
    lines.push({ type: 'keyword', text: 'Required dictionaries' });
    lines.push({ type: 'text', text: '    Name                   | Description' });
    lines.push({ type: 'text', text: '    -----------------------|----------------------------------------' });
    for (const dict of variant.requiredDictionaries) {
      const name = dict.name.padEnd(22);
      lines.push({ type: 'text', text: `    ${name} | ${dict.meaning}` });
    }
  }

  lines.push({ type: 'text', text: '' });
  lines.push({ type: 'logo', text: '\\\\*---------------------------------------------------------------------------*/' });

  return lines;
}