# Course Enrollment API Documentation

This document describes the GraphQL API for managing course enrollments.

## Overview

The course enrollment system allows users to enroll in approved courses, track their enrollments, and manage their course access. The system supports:

- Enrolling in courses
- Checking enrollment status
- Viewing user enrollments
- Unenrolling from courses
- Expiration dates for enrollments

## Entities

### UserEnrollment
Represents a user's enrollment in a course.

```graphql
type UserEnrollment {
  id: Int!
  created_at: DateTime!
  course_id: Int
  user_id: Int
  expires_at: DateTime
  sa_courses: Course
  sa_users: User
}
```

### EnrollmentResponse
Response for enrollment operations.

```graphql
type EnrollmentResponse {
  message: String!
  enrollmentId: Int!
  courseId: Int!
  userId: Int!
  expiresAt: DateTime
}
```

## Mutations

### enrollInCourse
Enroll the current user in a course.

```graphql
mutation EnrollInCourse($input: EnrollCourseInput!) {
  enrollInCourse(enrollCourseInput: $input) {
    message
    enrollmentId
    courseId
    userId
    expiresAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "courseId": 1,
    "expiresAt": "2024-12-31T23:59:59Z"
  }
}
```

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": {
    "enrollInCourse": {
      "message": "Successfully enrolled in course",
      "enrollmentId": 1,
      "courseId": 1,
      "userId": 1,
      "expiresAt": "2024-12-31T23:59:59Z"
    }
  }
}
```

### unenrollFromCourse
Unenroll the current user from a course.

```graphql
mutation UnenrollFromCourse($courseId: Int!) {
  unenrollFromCourse(courseId: $courseId) {
    message
    enrollmentId
    courseId
    userId
    expiresAt
  }
}
```

**Variables:**
```json
{
  "courseId": 1
}
```

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

## Queries

### getUserEnrollments
Get all enrollments for the current user with pagination.

```graphql
query GetUserEnrollments($page: Int, $perPage: Int) {
  getUserEnrollments(page: $page, perPage: $perPage) {
    id
    created_at
    course_id
    user_id
    expires_at
    sa_courses {
      id
      course_name
      description
      thumbnail
      status
      is_live
      sa_teachers {
        id
        first_name
        last_name
        full_name
        image
      }
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

**Variables:**
```json
{
  "page": 1,
  "perPage": 10
}
```

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

### checkEnrollmentStatus
Check if the current user is enrolled in a specific course.

```graphql
query CheckEnrollmentStatus($courseId: Int!) {
  checkEnrollmentStatus(courseId: $courseId)
}
```

**Variables:**
```json
{
  "courseId": 1
}
```

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": {
    "checkEnrollmentStatus": true
  }
}
```

## Input Types

### EnrollCourseInput
```graphql
input EnrollCourseInput {
  courseId: Int!
  expiresAt: String
}
```

## Business Rules

### Enrollment Validation
1. **Course Existence**: The course must exist in the database
2. **Course Status**: Only approved courses can be enrolled in
3. **Duplicate Enrollment**: Users cannot enroll in the same course twice
4. **User Authentication**: All enrollment operations require authentication

### Enrollment Expiration
- If `expiresAt` is provided, the enrollment will expire at that date
- If `expiresAt` is not provided, the enrollment has no expiration
- Expired enrollments are automatically considered invalid
- Users can unenroll from courses at any time

### Access Control
- Users can only enroll/unenroll themselves
- Users can only view their own enrollments
- Course status must be `APPROVED` for enrollment

## Error Handling

### Common Error Scenarios

1. **Course Not Found**
```json
{
  "errors": [
    {
      "message": "Course not found",
      "extensions": {
        "code": "BAD_REQUEST"
      }
    }
  ]
}
```

2. **Course Not Available**
```json
{
  "errors": [
    {
      "message": "Course is not available for enrollment",
      "extensions": {
        "code": "BAD_REQUEST"
      }
    }
  ]
}
```

3. **Already Enrolled**
```json
{
  "errors": [
    {
      "message": "You are already enrolled in this course",
      "extensions": {
        "code": "BAD_REQUEST"
      }
    }
  ]
}
```

4. **Not Enrolled**
```json
{
  "errors": [
    {
      "message": "You are not enrolled in this course",
      "extensions": {
        "code": "BAD_REQUEST"
      }
    }
  ]
}
```

## Usage Examples

### Complete Enrollment Flow

```javascript
// 1. Check if user is enrolled
const checkEnrollment = async (courseId) => {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        query CheckEnrollmentStatus($courseId: Int!) {
          checkEnrollmentStatus(courseId: $courseId)
        }
      `,
      variables: { courseId }
    })
  });
  
  const result = await response.json();
  return result.data.checkEnrollmentStatus;
};

// 2. Enroll in course if not already enrolled
const enrollInCourse = async (courseId, expiresAt = null) => {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        mutation EnrollInCourse($input: EnrollCourseInput!) {
          enrollInCourse(enrollCourseInput: $input) {
            message
            enrollmentId
            courseId
            userId
            expiresAt
          }
        }
      `,
      variables: {
        input: { courseId, expiresAt }
      }
    })
  });
  
  return response.json();
};

// 3. Get user enrollments
const getUserEnrollments = async (page = 1, perPage = 10) => {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        query GetUserEnrollments($page: Int, $perPage: Int) {
          getUserEnrollments(page: $page, perPage: $perPage) {
            id
            created_at
            course_id
            expires_at
            sa_courses {
              id
              course_name
              description
              thumbnail
              sa_teachers {
                id
                first_name
                last_name
                full_name
              }
            }
          }
        }
      `,
      variables: { page, perPage }
    })
  });
  
  return response.json();
};

// 4. Unenroll from course
const unenrollFromCourse = async (courseId) => {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        mutation UnenrollFromCourse($courseId: Int!) {
          unenrollFromCourse(courseId: $courseId) {
            message
            enrollmentId
            courseId
            userId
          }
        }
      `,
      variables: { courseId }
    })
  });
  
  return response.json();
};
```

### Frontend Integration Example

```javascript
// React component example
const CourseEnrollment = ({ courseId }) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkEnrollmentStatus();
  }, [courseId]);

  const checkEnrollmentStatus = async () => {
    try {
      const enrolled = await checkEnrollment(courseId);
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Failed to check enrollment status:', error);
    }
  };

  const handleEnroll = async () => {
    setLoading(true);
    try {
      await enrollInCourse(courseId);
      setIsEnrolled(true);
      // Show success message
    } catch (error) {
      // Show error message
      console.error('Failed to enroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async () => {
    setLoading(true);
    try {
      await unenrollFromCourse(courseId);
      setIsEnrolled(false);
      // Show success message
    } catch (error) {
      // Show error message
      console.error('Failed to unenroll:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isEnrolled ? (
        <button onClick={handleUnenroll} disabled={loading}>
          {loading ? 'Unenrolling...' : 'Unenroll from Course'}
        </button>
      ) : (
        <button onClick={handleEnroll} disabled={loading}>
          {loading ? 'Enrolling...' : 'Enroll in Course'}
        </button>
      )}
    </div>
  );
};
```

## Database Schema

The enrollment system uses the following database tables:

### sa_enrolled_user_courses
```sql
CREATE TABLE sa_enrolled_user_courses (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  course_id INTEGER REFERENCES sa_courses(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES sa_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ
);
```

### sa_user_courses (Legacy)
```sql
CREATE TABLE sa_user_courses (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id INTEGER REFERENCES sa_users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES sa_courses(id) ON DELETE CASCADE
);
```

## Security Considerations

1. **Authentication**: All enrollment operations require valid JWT tokens
2. **Authorization**: Users can only manage their own enrollments
3. **Input Validation**: All inputs are validated using class-validator
4. **SQL Injection**: Prisma ORM prevents SQL injection attacks
5. **Rate Limiting**: Consider implementing rate limiting for enrollment operations

## Performance Considerations

1. **Indexing**: Ensure proper indexes on `user_id` and `course_id` columns
2. **Pagination**: Use pagination for large enrollment lists
3. **Caching**: Consider caching enrollment status for frequently accessed courses
4. **Database Queries**: Optimize queries with proper includes and selects 