
import Resizer from 'react-image-file-resizer';


export const resizeFiles = (files, maxWidth, maxHeight) => {

    return new Promise(async (resolve) => {
        var newFiles = [];
        for (let index in files) {
            let file = files[index];
            let type = file.type;
            let isImage = type != null && type.indexOf('image') !== -1;
            if (isImage) {
                let resizedFile = await resizeFile(file, maxWidth, maxHeight);
                resizedFile.title = file.title;
                resizedFile.url = URL.createObjectURL(resizedFile);
                resizedFile.path = file.path;
                newFiles.push(resizedFile);
            } else {
                file.url = URL.createObjectURL(file);
                newFiles.push(file);
            }
        }
        resolve(newFiles);
    });
}

export const resizeFile = (file, maxWidth, maxHeight) => new Promise(resolve => {
    Resizer.imageFileResizer(file, maxWidth, maxHeight, 'JPEG', 100, 0,
        uri => {
            resolve(uri);
        },
        'blob'
    );
});
