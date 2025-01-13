# User API Endpoints

## Create User
**POST** `/api/v1/auth/create`

Create a new user account.

### Request Body
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
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
    "password": "string",
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
    "password": "string",
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
