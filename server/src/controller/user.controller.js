import bcrypt from 'bcryptjs';
import User from '../model/user.schema.js';
import { LoginValidationSchema, RegisterValidationSchema } from '../utils/auth.validator.js';
import { generateToken } from '../utils/generateToken.js';

const UserController = {
    userRegister: async (req, res) => {
        const { firstname, lastname, email, password } = req.body;

        try {
            if (!firstname || !lastname || !email || !password) {
                return res.status(400).json({ message: 'All fields are required', success: false });
            }

            // Validate input using the correct schema
            const validateData = RegisterValidationSchema.safeParse(req.body);
            if (!validateData.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validateData.error.issues.map((err) => err.message),
                });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists', success: false });
            }

            const hashPassword = await bcrypt.hash(password, 8);

            const newUser = await User.create({
                firstname,
                lastname,
                email,
                password: hashPassword,
            });

            const token = generateToken({ id: newUser._id, role: newUser.role });

            return res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: newUser,
                token: token,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: error.message,
            });
        }
    },

    userLogin: async (req, res) => {
        const { email, password } = req.body;

        try {
            if (!email || !password) {
                return res.status(400).json({ message: 'All fields are required', success: false });
            }

            // Validate input using Login schema
            const validateData = LoginValidationSchema.safeParse(req.body);
            if (!validateData.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validateData.error.issues.map((err) => err.message),
                });
            }

            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return res
                    .status(400)
                    .json({ message: 'User not found with this email', success: false });
            }

            const isMatchPassword = await bcrypt.compare(password, existingUser.password);
            if (!isMatchPassword) {
                return res.status(400).json({ message: 'Invalid Credentials', success: false });
            }

            const token = generateToken({ id: existingUser._id, role: existingUser.role });

            return res.status(200).json({
                success: true,
                message: 'User logged in successfully',
                data: existingUser,
                token: token,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: error.message,
            });
        }
    },

    userProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ message: 'User profile not found', success: false });
            }

            return res.status(200).json({
                message: `Profile retrieved successfully: ${user.firstname} ${user.lastname}`,
                success: true,
                data: user,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: error.message,
            });
        }
    },

    userLogout: async (req, res) => {
        res.clearCookie('token');
        return res.status(200).json({
            success: true,
            message: 'User logged out successfully',
        });
    },
};

export default UserController;

# User API Endpoints

## Base Url  
**GET** `http://localhost:7777`

## Create User
**POST** `/api/v1/auth/create`

Create a new user account.

### Request Body
```json
{
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "password": "string"
}
```

### Response
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "string",
    "firstname": "string",
    "lastname": "string",
    "email": "string",
    "password": "string"
  },
  "token": "string"
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
  "message": "User logged in successfully",
  "data": {
    "id": "string",
    "firstname": "string",
    "lastname": "string",
    "email": "string",
    "password": "string"
  },
  "token": "string"
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
  "message": "Profile retrieved successfully",
  "data": {
    "id": "string",
    "firstname": "string",
    "lastname": "string",
    "email": "string"
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
  "message": "User logged out successfully"
}
```

## Update User
**PUT** `/api/v1/auth/update`

Update the authenticated user's information.

### Headers
```
Authorization: Bearer <token>
```

### Request Body
```json
{
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "password": "string"
}
```

### Response
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "string",
    "firstname": "string",
    "lastname": "string",
    "email": "string"
  }
}
```

### Error Responses
All endpoints may return the following error response format:
```json
{
  "success": false,
  "message": "Error message description",
  "error": "Error details"
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
  "message": "Course created successfully",
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "price": "number",
    "image": {
      "publicId": "string",
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
  "message": "Course updated successfully",
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "price": "number",
    "image": {
      "publicId": "string",
      "url": "string"
    }
  }
}
```

## Delete Course
**DELETE** `/api/v1/courses/delete/{courseId}`

Delete a course.

### Response
```json
{
  "success": true,
  "message": "Course deleted successfully",
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "price": "number",
    "image": {
      "publicId": "string",
      "url": "string"
    }
  }
}
```

## Get All Courses
**GET** `/api/v1/courses`

Retrieve all courses.

### Response
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "price": "number",
      "image": {
        "publicId": "string",
        "url": "string"
      }
    }
  ]
}
```

## Get Course Details
**GET** `/api/v1/courses/{courseId}`

Retrieve details of a specific course.

### Response
```json
{
  "success": true,
  "message": "Course details retrieved successfully",
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "price": "number",
    "image": {
      "publicId": "string",
      "url": "string"
    }
  }
}
```

## Buy Course
**POST** `/api/v1/courses/buy/{courseId}`

Buy a course.

### Response
```json
{
  "success": true,
  "message": "Course purchased successfully"
}
```

### Error Responses
All endpoints may return the following error response format:
```json
{
  "success": false,
  "message": "Error message description",
  "error": "Error details"
}
