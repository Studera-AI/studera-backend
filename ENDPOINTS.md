## API Endpoints

### 1. User Endpoints

#### POST /signup

- Description: Register a user
- Request Body: JSON

  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```

#### POST /signin

- Description: Log in a user
- Request Body: JSON

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

#### GET /user

- Description: Get user information
- Request Body: None
- Authorization: Bearer Token

#### PATCH /user

- Description: Update user information
- Authorization: Bearer Token
- Request Body: JSON

  ```json
  {
    "name?": "string",
    "email?": "string",
    "password?": "string",
    "learnings?": "Learnings[]"
    /*Learnings type definition can be found in /dto/resource.dto.ts*/
  }
  ```

#### DELETE /user

- Description: Get user information
- Request Body: None
- Authorization: Bearer Token

### 2. Admin Endpoints

**Note:** These enpoints have destructive effects. Use with caution!

Admin-Access Header Format:

```bash
Admin-Access: Uniqueadminaccessstring
```

#### GET /admin

- Description: Get all users
- Request Body: None
- Request Header: Admin-Access

#### DELETE /admin

- Description: Delete all users information
- Request Body: None
- Request Header: Admin-Access

#### POST /feedback

- Description: Submit user feedback form
- Authorization: Bearer Token
- Request Body: JSON

  ```json
  {
    "email": "string",
    "feedback": "string"
  }
  ```

### 3. Resources Endpoint

#### POST /resource

- Description: Generate course content
- Authorization: Bearer Token
- Request Body: JSON

  ```json
  {
    "title": "string",
    "timeframe": "string",
    "type": "string"
  }
  ```

#### POST /test

- Description: Generate Test content
- Authorization: Bearer Token
- Request Body: JSON

  ```json
  {
    "day": "number",
    "title": "string"
  }
  ```

#### POST /submit_test

- Description: Log in a user
- Authorization: Bearer Token
- Request Body: JSON

  ```json
  {
    "userScore": "string",
    "maxScore": "string",
    "day": "number",
    "title": "string"
  }
  ```
