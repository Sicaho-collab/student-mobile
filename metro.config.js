const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')
const fs = require('fs')

const config = getDefaultConfig(__dirname)

// Resolve local symlinked packages from the monorepo (local dev only)
const designSystemRoot = path.resolve(__dirname, '../Components/alumable-design-system')

if (fs.existsSync(designSystemRoot)) {
  config.watchFolders = [designSystemRoot]
  config.resolver.nodeModulesPaths = [
    path.resolve(__dirname, 'node_modules'),
    path.resolve(designSystemRoot, 'node_modules'),
  ]
}

// Ensure symlinks are followed
config.resolver.unstable_enableSymlinks = true

module.exports = config
