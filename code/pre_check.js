const fs = require('fs')

const path = './file.txt'

class DatasourceFileNotFoundError extends Error {}

/* 
    Block execution until these files are verified!
*/
required_files = [
    'associative_tables.js',
    'conf.js',
    'table_singulars.js',
]

required_files.forEach((file) => {
    try {
        if (fs.existsSync(`./app/${file}`)) {
          console.log(`Precheck: Successfully found ${file} in ./app`)
        }
    } catch(err) {
        throw new DatasourceFileNotFoundError(`Cannot begin. ${file} not found in ./app`)
    }
})
