export interface iFile {
    _id: string;
    originalname: string;
    mimetype: string;
    buffer: any;
    size: number;
    userId: string;
    encoding?: string;
    accessLink?: string;
}
