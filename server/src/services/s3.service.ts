import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import env from '../config/env';
import logger from '../utils/logger';

// ── S3 Client (ap-south-1 private bucket) ───────────────────────────────────
const s3 = new S3Client({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY,
        secretAccessKey: env.AWS_SECRET_KEY,
    },
});

const BUCKET = env.AWS_S3_BUCKET ?? 'onlyhair-assets';

// Allowed MIME types for uploads
const ALLOWED_CONTENT_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
] as const;

type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number];

export interface PresignedUploadResult {
    uploadUrl: string;
    fileKey: string;
    expiresIn: number;
}

/**
 * Generate a presigned PUT URL for secure client-side upload.
 * The bucket remains private — no public access.
 */
export const generatePresignedUploadUrl = async (
    folder: string,
    contentType: AllowedContentType,
    expiresIn: number = 60, // 60 seconds max per requirement
): Promise<PresignedUploadResult> => {
    if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
        throw new Error(`Unsupported content type: ${contentType}`);
    }

    const fileKey = `${folder}/${crypto.randomUUID()}`;
    const ext = contentType.split('/')[1];
    const fullKey = `${fileKey}.${ext}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: fullKey,
        ContentType: contentType,
        // Enforce max 5MB upload
        Metadata: { 'max-size': '5242880' },
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn });

    logger.info({ folder, contentType, expiresIn }, 'presigned upload URL generated');

    return { uploadUrl, fileKey: fullKey, expiresIn };
};

/**
 * Delete an object from S3 by key.
 */
export const deleteS3Object = async (fileKey: string): Promise<void> => {
    const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: fileKey });
    await s3.send(command);
    logger.info({ fileKey }, 'S3 object deleted');
};

export default s3;
