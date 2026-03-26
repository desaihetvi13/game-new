import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";

const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

function sanitizePath(path: string) {
  return path
    .replace(/\\/g, "/")
    .replace(/\.\./g, "")
    .replace(/^\//, "")
    .trim();
}

export async function uploadBufferToS3(key: string, body: Buffer, contentType?: string) {
  const safeKey = sanitizePath(key);
  await s3.send(
    new PutObjectCommand({
      Bucket: env.AWS_BUCKET,
      Key: safeKey,
      Body: body,
      ContentType: contentType ?? "application/octet-stream",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `https://${env.AWS_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${safeKey}`;
}
