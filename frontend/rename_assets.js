import fs from 'fs';
import path from 'path';

const directory = 'public/sequence';
try {
    const files = fs.readdirSync(directory);
    files.forEach(file => {
        if (!file.endsWith('.png')) return;
        const match = file.match(/frame_(\d{3})/);
        if (match) {
            const newName = `frame_${match[1]}.png`;
            if (file !== newName) {
                fs.renameSync(path.join(directory, file), path.join(directory, newName));
            }
        }
    });
    console.log('Renaming complete.');
} catch (e) {
    console.error('Error renaming files:', e);
}
