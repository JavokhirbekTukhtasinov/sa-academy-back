import { FileUpload } from 'graphql-upload';
export declare class UploadService {
    private wasabi;
    generateSignedVideoUrl(filename: string, destination: string): Promise<{
        uploadUrl: string;
        key: string;
    }>;
    uploadFromGraphQL(file: FileUpload, type: 'image' | 'file', destination: string): Promise<{
        key: string;
        url: string;
    }>;
    streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer>;
    uploadSmallFile(file: FileUpload, type: 'image' | 'file'): Promise<{
        key: string;
        url: string;
    }>;
    private getContentType;
    deleteFile(key: string): Promise<void>;
}
