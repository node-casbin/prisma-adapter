const { resolve } = require('path');
const { statSync } = require('fs');

/**
 * Custom Jest resolver to handle Node.js subpath imports
 * Required for Prisma v7 which uses "#main-entry-point" style imports
 */

/**
 * Extracts the base path for a Prisma client package
 * @param {string} pkgPath - The base directory path
 * @param {string} packageName - The package name to extract ('.prisma/client' or '@prisma/client')
 * @returns {string} The extracted package path
 */
function extractPrismaClientPath(pkgPath, packageName) {
  return pkgPath.substring(0, pkgPath.indexOf(packageName) + packageName.length);
}

module.exports = (path, options) => {
  // Handle subpath imports for @prisma/client
  if (path.startsWith('#')) {
    const pkgPath = options.basedir;
    
    try {
      // For .prisma/client package with subpath imports
      if (pkgPath.includes('node_modules/.prisma/client') || pkgPath.includes('node_modules/@prisma/client')) {
        const prismaClientPath = pkgPath.includes('.prisma/client') 
          ? extractPrismaClientPath(pkgPath, '.prisma/client')
          : extractPrismaClientPath(pkgPath, '@prisma/client');
        
        // Check for .prisma/client first
        const generatedClientPath = prismaClientPath.replace('@prisma/client', '.prisma/client');
        try {
          const pkgJsonPath = resolve(generatedClientPath, 'package.json');
          statSync(pkgJsonPath);
          const pkg = require(pkgJsonPath);
          
          if (pkg.imports && pkg.imports[path]) {
            const importPath = pkg.imports[path];
            let targetPath;
            
            if (typeof importPath === 'string') {
              targetPath = importPath;
            } else if (typeof importPath.require === 'string') {
              targetPath = importPath.require;
            } else if (typeof importPath.require === 'object' && importPath.require.node) {
              targetPath = importPath.require.node;
            } else if (importPath.default) {
              targetPath = importPath.default;
            }
            
            if (targetPath) {
              const resolvedPath = resolve(generatedClientPath, targetPath);
              return resolvedPath;
            }
          }
        } catch (error) {
          // .prisma/client not found or doesn't have the import, continue
        }
      }
    } catch (error) {
      // Fall through to default resolver
    }
  }
  
  // Use default resolver for everything else
  return options.defaultResolver(path, options);
};
