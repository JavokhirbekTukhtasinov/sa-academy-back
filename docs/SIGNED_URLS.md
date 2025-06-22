# Signed URLs for Curriclum Videos and Attachments

This document explains how to use the signed URL functionality for secure access to curriclum videos and attachments.

## Overview

The signed URL system provides secure, time-limited access to video content and file attachments stored in AWS S3. This ensures that:

- Files are not publicly accessible
- Access can be controlled and time-limited
- URLs expire automatically
- Different permissions can be set for different users

## Environment Variables

Add these environment variables to your `.env` file:

```env
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## GraphQL Mutations and Queries

### 1. Generate Video Signed URL

Generate a signed URL for viewing/downloading a curriclum video:

```graphql
mutation GenerateVideoSignedUrl($input: GenerateVideoSignedUrlInput!) {
  generateVideoSignedUrl(input: $input) {
    signedUrl
    originalUrl
    expiresIn
  }
}
```

Variables:
```json
{
  "input": {
    "videoUrl": "https://your-bucket.s3.amazonaws.com/videos/lecture-1.mp4",
    "expiresIn": 3600
  }
}
```

### 2. Generate Video Upload Signed URL

Generate a signed URL for uploading a new video:

```graphql
mutation GenerateVideoUploadSignedUrl($input: GenerateVideoUploadSignedUrlInput!) {
  generateVideoUploadSignedUrl(input: $input) {
    signedUrl
    fileName
    contentType
    expiresIn
  }
}
```

Variables:
```json
{
  "input": {
    "fileName": "lecture-2.mp4",
    "contentType": "video/mp4",
    "expiresIn": 3600,
    "metadata": "{\"userId\": \"123\", \"courseId\": \"456\"}"
  }
}
```

### 3. Generate Attachment Signed URL

Generate a signed URL for viewing/downloading an attachment:

```graphql
mutation GenerateAttachmentSignedUrl($input: GenerateAttachmentSignedUrlInput!) {
  generateAttachmentSignedUrl(input: $input) {
    signedUrl
    originalUrl
    attachmentType
    expiresIn
  }
}
```

Variables:
```json
{
  "input": {
    "attachmentUrl": "https://your-bucket.s3.amazonaws.com/attachments/slides.pdf",
    "attachmentType": "FILE",
    "expiresIn": 3600
  }
}
```

### 4. Generate Attachment Upload Signed URL

Generate a signed URL for uploading a new attachment:

```graphql
mutation GenerateAttachmentUploadSignedUrl($input: GenerateAttachmentUploadSignedUrlInput!) {
  generateAttachmentUploadSignedUrl(input: $input) {
    signedUrl
    fileName
    contentType
    attachmentType
    expiresIn
  }
}
```

Variables:
```json
{
  "input": {
    "fileName": "homework.pdf",
    "contentType": "application/pdf",
    "attachmentType": "FILE",
    "expiresIn": 3600,
    "metadata": "{\"userId\": \"123\", \"curriclumId\": \"789\"}"
  }
}
```

### 5. Get Curriclum with Signed URLs

Get a curriclum with all its videos and attachments as signed URLs:

```graphql
query GetCurriclumWithSignedUrls($id: Int!) {
  curriclumWithSignedUrls(id: $id) {
    id
    title
    description
    vide_link
    signedVideoUrl
    signedAttachments {
      id
      name
      type
      link_url
      signedUrl
    }
  }
}
```

### 6. Get Curriclums by Section with Signed URLs

Get all curriclums in a section with signed URLs:

```graphql
query GetCurriclumsBySectionWithSignedUrls($sectionId: Int!) {
  curriclumsBySectionWithSignedUrls(sectionId: $sectionId) {
    id
    title
    description
    vide_link
    signedVideoUrl
    signedAttachments {
      id
      name
      type
      link_url
      signedUrl
    }
  }
}
```

### 7. Validate File Access

Check if a file is accessible:

```graphql
query ValidateFileAccess($url: String!) {
  validateFileAccess(url: $url)
}
```

### 8. Get File Metadata

Get metadata for a file:

```graphql
query GetFileMetadata($url: String!) {
  getFileMetadata(url: $url)
}
```

## Usage Examples

### Frontend Implementation

```typescript
// Generate signed URL for video playback
const generateVideoUrl = async (videoUrl: string) => {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        mutation GenerateVideoSignedUrl($input: GenerateVideoSignedUrlInput!) {
          generateVideoSignedUrl(input: $input) {
            signedUrl
            expiresIn
          }
        }
      `,
      variables: {
        input: {
          videoUrl,
          expiresIn: 3600, // 1 hour
        },
      },
    }),
  });

  const result = await response.json();
  return result.data.generateVideoSignedUrl.signedUrl;
};

// Use signed URL in video player
const videoUrl = await generateVideoUrl('https://bucket.s3.amazonaws.com/video.mp4');
const videoPlayer = document.getElementById('video-player');
videoPlayer.src = videoUrl;
```

### Upload Implementation

```typescript
// Generate upload URL and upload file
const uploadVideo = async (file: File) => {
  // 1. Get upload signed URL
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        mutation GenerateVideoUploadSignedUrl($input: GenerateVideoUploadSignedUrlInput!) {
          generateVideoUploadSignedUrl(input: $input) {
            signedUrl
            fileName
          }
        }
      `,
      variables: {
        input: {
          fileName: file.name,
          contentType: file.type,
          expiresIn: 3600,
        },
      },
    }),
  });

  const result = await response.json();
  const { signedUrl, fileName } = result.data.generateVideoUploadSignedUrl;

  // 2. Upload file directly to S3
  const uploadResponse = await fetch(signedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (uploadResponse.ok) {
    // 3. Create curriclum with the uploaded file URL
    const curriclumUrl = `https://your-bucket.s3.amazonaws.com/curriclums/videos/${fileName}`;
    // ... create curriclum with curriclumUrl
  }
};
```

## Security Considerations

1. **URL Expiration**: Always set appropriate expiration times for signed URLs
2. **Access Control**: Implement proper authentication and authorization
3. **File Validation**: Validate file types and sizes before generating upload URLs
4. **HTTPS**: Always use HTTPS in production
5. **Monitoring**: Monitor signed URL usage for security

## Error Handling

The service handles various error scenarios:

- Invalid URLs
- S3 access denied
- Network errors
- Invalid file types
- Expired URLs

All errors are logged and appropriate error messages are returned to the client.

## Testing

Run the tests to ensure the signed URL functionality works correctly:

```bash
npm test -- --testPathPattern="signed-url.service.spec.ts"
```

## Configuration

### AWS S3 Bucket Setup

1. Create an S3 bucket
2. Configure CORS for your domain
3. Set up IAM user with appropriate permissions
4. Configure bucket policy for secure access

### CORS Configuration

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

## Troubleshooting

### Common Issues

1. **Access Denied**: Check AWS credentials and bucket permissions
2. **URL Expired**: Generate a new signed URL
3. **Invalid URL**: Ensure the URL format is correct
4. **CORS Errors**: Check S3 bucket CORS configuration

### Debug Mode

Enable debug logging by setting the log level:

```typescript
// In your service
this.logger.setLogLevels(['debug']);
```

## Performance Considerations

1. **Caching**: Cache signed URLs for frequently accessed files
2. **Batch Operations**: Use batch operations for multiple files
3. **CDN**: Consider using CloudFront for better performance
4. **Compression**: Enable compression for video files 