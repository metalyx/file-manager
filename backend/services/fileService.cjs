const File = require('../models/File.cjs');

class FileService {
    createDir(file) {
        return new Promise((resolve, reject) => {
            try {
            } catch (e) {
                reject({
                    message: 'File Error',
                });
            }
        });
    }
}

module.exports = new FileService();
