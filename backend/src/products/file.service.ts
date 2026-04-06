import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
    // definimi i direktorise se imazheve
    private readonly uploadsDir = './uploads/variants';
    // filename- emri i imazhit qe do te delete
    deleteFile(filename: string): void {
        // nese file name eshte null apo undefined, nuk ka nevoje te vazhdojme me tej
        if (!filename) return;
        // krijojme path-in e plote te file-it 
        const filePath = path.join(this.uploadsDir, filename);
        // kontrollojme nese file ekziston dhe nese po, e fshijme
        try {
            // fs.existsSync kontrollon nese file ekziston ne path-in e specifikuar
            if (fs.existsSync(filePath)) {
                // fs.unlinkSync fshin file-in ne path-in e specifikuar
                fs.unlinkSync(filePath);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Failed to delete ${filename}:`, error.message);
            } else {
                console.error(`Failed to delete ${filename}:`, error);
            }
        }
    }
    deleteFiles(filenames: string[]): void {
        filenames.forEach(filename => this.deleteFile(filename));
    }
}