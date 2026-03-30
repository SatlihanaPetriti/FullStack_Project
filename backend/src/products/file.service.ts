import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
    // definimi i direktorise se imazheve
    private readonly uploadsDir = './uploads';
    // filename- emri i imazhit qe do te delete
    deleteFile(filename: string): void {
        // nese file name eshte null apo undefined, nuk ka nevoje te vazhdojme me tej
        if (!filename) return;
        // krijojme path-in e plote te file-it duke bashkuar direktorine me emrin e file-it
        const filePath = path.join(this.uploadsDir, filename);
        // kontrollojme nese file ekziston dhe nese po, e fshijme
        try {
            // fs.existsSync kontrollon nese file ekziston ne path-in e specifikuar
            if (fs.existsSync(filePath)) {
                // fs.unlinkSync fshin file-in ne path-in e specifikuar
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error(`Failed to delete ${filename}:`, error.message);
        }
    }
// void nuk kthen asnje vlere, thjesht kryen nje veprim (ne kete rast, fshirjen e file-it) dhe perfundon
    deleteFiles(filenames: string[]): void {
        // forEach iteron mbi listen e filenames dhe therrit deleteFile per secilin filename
        filenames.forEach(filename => this.deleteFile(filename));
    }
}