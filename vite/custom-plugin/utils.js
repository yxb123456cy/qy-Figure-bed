import fs from 'fs'

export async function getBuildSize(dirPath) {
  const getSize = (path) => {
    const stats = fs.statSync(path)
    if (stats.isDirectory()) {
      return fs.readdirSync(path)
        .reduce((acc, file) => acc + getSize(`${path}/${file}`), 0)
    }
    return stats.size
  }
  
  const bytes = getSize(dirPath)
  return (bytes / 1024 / 1024).toFixed(1)
}