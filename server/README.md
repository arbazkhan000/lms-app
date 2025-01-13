# User API Endpoints

# Base Url 
**http://localhost:7777/**

## Create User
**POST** `/api/v1/auth/create`

Create a new user account.

### Request Body
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "password": "string"
  }
}
```

## Login
**POST** `/api/v1/auth/login`

Authenticate a user and receive a JWT token.

### Request Body
```json
{
  "email": "string",
  "password": "string"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
}
```

## Get User Profile
**GET** `/api/v1/auth/profile`

Retrieve the authenticated user's profile information.

### Headers
```
Authorization: Bearer <token>
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "password": "string"
  }
}
```

## Logout
**POST** `/api/v1/auth/logout`

Invalidate the current user's session.

### Headers
```
Authorization: Bearer <token>
```

### Response
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

### Error Responses
All endpoints may return the following error response format:
```json
{
  "success": false,
  "error": {
    "message": "Error message description",
    "code": "ERROR_CODE"
  }
}
```

# Course API Endpoints

## Create Course
**POST** `/api/v1/courses/create`

Create a new course.

### Request Body
```json
{
  "title": "string",
  "description": "string",
  "price": "number",
  "image": "file"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "price": "number",
    "image": {
      "public_id": "string",
      "url": "string"
    }
  }
}
```

## Update Course
**PUT** `/api/v1/courses/update/{courseId}`

Update an existing course.

### Request Body
```json
{
  "title": "string",
  "description": "string",
  "price": "number",
  "image": "file"
}
```

### Response
```json
{
  "success": true,
  "message": "Course updated successfully"
}
```

## Delete Course
**DELETE** `/api/v1/courses/delete/{courseId}`

Delete a course.

### Response
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

## Get All Courses
**GET** `/api/v1/courses`

Retrieve all courses.

### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "price": "number",
      "image": {
        "public_id": "string",
        "url": "string"
      }
    }
  ]
}
```