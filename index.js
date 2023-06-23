import path from 'node:path';
import fs from 'node:fs';

export default function generateAliasesResolver(aliasesToAdd) {
  const getAliases = () => {

    const base = process.cwd();
    const windowsSupportString = process.platform === 'win32' ? 'file://' : '';

    const absoluteAliases = Object.keys(aliasesToAdd).reduce((acc, key) =>
      aliasesToAdd[key][0] === '/'
        ? acc
        : { ...acc, [key]: path.join(windowsSupportString, base, aliasesToAdd[key]) },
      aliasesToAdd);

    return absoluteAliases;

  }

  const isAliasInSpecifier = (path, alias) => {
    return path.indexOf(alias) === 0
      && (path.length === alias.length || path[alias.length] === '/');
  };

  const aliases = getAliases();

  return (specifier, parentModuleURL, defaultResolve) => {

    const alias = Object.keys(aliases).find((key) => isAliasInSpecifier(specifier, key));
    const testSpecifiers = []

    if (alias !== undefined) {
      testSpecifiers.push(path.join(aliases[alias], specifier.substr(alias.length) + '.js'))
      testSpecifiers.push(path.join(aliases[alias], specifier.substr(alias.length) + '.ts'))
      testSpecifiers.push(path.join(aliases[alias], specifier.substr(alias.length) + '.jsx'))
      testSpecifiers.push(path.join(aliases[alias], specifier.substr(alias.length) + '.tsx'))
      testSpecifiers.push(path.join(aliases[alias], specifier.substr(alias.length) + '.json'))

      testSpecifiers.push(path.join(aliases[alias], specifier.substr(alias.length), 'index.js'))
      testSpecifiers.push(path.join(aliases[alias], specifier.substr(alias.length), 'index.ts'))
      testSpecifiers.push(path.join(aliases[alias], specifier.substr(alias.length), 'index.jsx'))
      testSpecifiers.push(path.join(aliases[alias], specifier.substr(alias.length), 'index.tsx'))
      testSpecifiers.push(path.join(aliases[alias], specifier.substr(alias.length), 'index.json'))   

      for(const item of testSpecifiers) {
        if (fs.existsSync(item.replace('file:\\', ''))) return defaultResolve(item, parentModuleURL);
      }
    }

    const newSpecifier = alias === undefined
      ? specifier
      : path.join(aliases[alias], specifier.substr(alias.length));

    return defaultResolve(newSpecifier, parentModuleURL);
  };
}

