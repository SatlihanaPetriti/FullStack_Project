// src/Helper/FormatDateImage.ts
export class FormatDateImage {
    generateDate(fileName: string) {
        const fileExtension = fileName.split('.').pop();
        const date = new Date();
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}${month}${year}.${fileExtension}`;
    }
}