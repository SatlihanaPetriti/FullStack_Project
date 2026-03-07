export class FormatDateImage {
    public generateDate(imageName: string) {
        const date = new Date();
        const categoryImage = imageName.split(".");

        const fileExt = categoryImage.pop();

        const fileName = categoryImage.join(".");

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');  // Fix: +1 and padStart
        const day = String(date.getDate()).padStart(2, '0');         // Fix: getDate() not getDay()

        return fileName + '_' + day + month + year + '.' + fileExt;
    }
}