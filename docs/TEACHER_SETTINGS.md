# Teacher Settings API Documentation

This document describes the GraphQL API for managing teacher settings and files.

## Entities

### TeacherSettings
Represents a teacher's complete profile with all settings and related data.

```graphql
type TeacherSettings {
  id: Int!
  created_at: DateTime!
  first_name: String
  last_name: String
  email: String
  full_name: String
  academy_id: Int
  image: String
  user_id: Int
  description: String
  headline: String
  website_url: String
  instagram_url: String
  facebook_url: String
  youtube_url: String
  sa_teacher_files: [TeacherFile]
  sa_academies: Academy
  sa_users: User
}
```

### TeacherFile
Represents a file uploaded by a teacher.

```graphql
type TeacherFile {
  id: Int!
  created_at: DateTime!
  file_name: String
  file_url: String
  teacher_id: Int
}
```

## Queries

### getTeacherSettings
Get the current teacher's settings and profile information.

```graphql
query GetTeacherSettings {
  getTeacherSettings {
    id
    first_name
    last_name
    email
    full_name
    academy_id
    image
    description
    headline
    website_url
    instagram_url
    facebook_url
    youtube_url
    sa_teacher_files {
      id
      file_name
      file_url
      created_at
    }
    sa_academies {
      id
      name
      description
      location
      phone_number
      email
    }
    sa_users {
      id
      first_name
      last_name
      full_name
      email
      avatar
    }
  }
}
```

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

## Mutations

### updateTeacherSettings
Update the current teacher's settings and profile information.

```graphql
mutation UpdateTeacherSettings($input: UpdateTeacherSettingsInput!) {
  updateTeacherSettings(updateTeacherSettingsInput: $input) {
    id
    first_name
    last_name
    email
    full_name
    academy_id
    image
    description
    headline
    website_url
    instagram_url
    facebook_url
    youtube_url
    sa_teacher_files {
      id
      file_name
      file_url
    }
    sa_academies {
      id
      name
      description
    }
    sa_users {
      id
      first_name
      last_name
      email
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "academy_id": 1,
    "image": "https://example.com/image.jpg",
    "description": "Experienced teacher with 10+ years of experience",
    "headline": "Senior Instructor",
    "website_url": "https://johndoe.com",
    "instagram_url": "https://instagram.com/johndoe",
    "facebook_url": "https://facebook.com/johndoe",
    "youtube_url": "https://youtube.com/johndoe"
  }
}
```

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

### uploadTeacherFile
Upload a new file for the current teacher.

```graphql
mutation UploadTeacherFile($input: UploadTeacherFileInput!) {
  uploadTeacherFile(uploadTeacherFileInput: $input) {
    id
    sa_teacher_files {
      id
      file_name
      file_url
      created_at
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "fileName": "resume.pdf",
    "fileUrl": "https://example.com/files/resume.pdf"
  }
}
```

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

### deleteTeacherFile
Delete a teacher file by ID.

```graphql
mutation DeleteTeacherFile($fileId: Int!) {
  deleteTeacherFile(fileId: $fileId) {
    id
    sa_teacher_files {
      id
      file_name
      file_url
    }
  }
}
```

**Variables:**
```json
{
  "fileId": 1
}
```

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

## Input Types

### UpdateTeacherSettingsInput
```graphql
input UpdateTeacherSettingsInput {
  id: Int!
  first_name: String
  last_name: String
  full_name: String
  email: String
  academy_id: Int
  image: String
  description: String
  headline: String
  website_url: String
  instagram_url: String
  facebook_url: String
  youtube_url: String
}
```

### UploadTeacherFileInput
```graphql
input UploadTeacherFileInput {
  fileName: String!
  fileUrl: String!
}
```

## Error Handling

All endpoints return appropriate error messages for common scenarios:

- **Teacher not found**: When the authenticated user is not a teacher
- **File not found**: When trying to delete a file that doesn't exist
- **Permission denied**: When trying to modify data that doesn't belong to the user
- **Validation errors**: When input data doesn't meet validation requirements

## Authentication

All teacher settings endpoints require authentication using JWT tokens. The token must be included in the Authorization header as a Bearer token.

## Usage Examples

### Complete Teacher Profile Update
```javascript
const updateTeacherProfile = async (teacherData) => {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        mutation UpdateTeacherSettings($input: UpdateTeacherSettingsInput!) {
          updateTeacherSettings(updateTeacherSettingsInput: $input) {
            id
            first_name
            last_name
            email
            description
            headline
            website_url
          }
        }
      `,
      variables: {
        input: teacherData
      }
    })
  });
  
  return response.json();
};
```

### File Management
```javascript
const uploadFile = async (fileName, fileUrl) => {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        mutation UploadTeacherFile($input: UploadTeacherFileInput!) {
          uploadTeacherFile(uploadTeacherFileInput: $input) {
            sa_teacher_files {
              id
              file_name
              file_url
            }
          }
        }
      `,
      variables: {
        input: { fileName, fileUrl }
      }
    })
  });
  
  return response.json();
};
``` 