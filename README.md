## Studera Backend README

### Overview

Welcome to the backend repository of Studera, the hackathon project of team studera. An innovative E-Learning Platform powered by generative AI. This repository contains the backend codebase written in TypeScript and Node.js.

### Getting Started

To set up the Studera backend on your local machine, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Studera-AI/studera-backend
   cd studera-backend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Database Configuration:**

   - Create a MongoDB database and configure the connection in `./ormconfig.ts`.

4. **Environment Variables:**

   - Create a `.env` file in the root directory and configure environment variables, including database connection details and API keys required.(envexample will be updated soon)

5. **Start the Development Server:**

   ```bash
   npm run dev
   ```

   The server will be available at `http://localhost:5000`.

### API Endpoints
The available API endpoints are available in ENDPOINTS.md

### Additional Notes

- Ensure that the AI model and related services for generating study resources are correctly configured and integrated for proper functioning.

- Keep sensitive information, such as API keys and database credentials, secure and never commit them to the repository.

Feel free to reach out for any assistance or questions regarding Studera's backend.
