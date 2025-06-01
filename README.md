# Task Pilot

A task management app.

## Technologies Used

- React
- TypeScript
- Node.js
- Express.js
- MongoDB (via Mongoose)

## Setup

1. Clone the repository:

```bash
git clone <repository_url>
cd task-pilot
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
```

3. Install backend dependencies:

```bash
cd ../task-pilot-backend
npm install
```

4. Set up environment variables:
   - Create a `.env` file in the `task-pilot-backend` directory.
   - Add your MongoDB connection URI to the `.env` file:

     ```
     MONGODB_URI=<your_mongodb_connection_string>
     ```
   - Make sure to replace `<your_mongodb_connection_string>` with your actual connection string.

5. Run the backend server:

```bash
cd ../task-pilot-backend
npm start # or node index.js
```

6. Run the frontend development server:

```bash
cd ../frontend
npm run dev
```

The frontend should now be running on `http://localhost:8081` and the backend on `http://localhost:3000`.

## Deployment

This project can be deployed to platforms like Vercel (frontend and backend as a monorepo setup).

### Vercel Deployment

1. Connect your Git repository to Vercel.
2. Configure the project with the following settings:
   - **Root Directory:** Leave empty (or set to `./` if needed, depending on Vercel's autoconfiguration).
   - **Build Command:** `npm run build` (in the frontend subdirectory)
   - **Output Directory:** `dist` (in the frontend subdirectory)
   - **Install Command:** `npm install && cd task-pilot-backend && npm install && cd ..`
   - **Development Command:** `npm run dev`
3. Add environment variables in Vercel, including `MONGODB_URI` with your MongoDB Atlas connection string.
4. Vercel will automatically detect the monorepo structure based on the `vercel.json` file in the root directory.

## Project Structure

- `frontend/`: Contains the React/TypeScript frontend code.
- `task-pilot-backend/`: Contains the Node.js/Express.js backend code.
- `vercel.json`: Configuration file for Vercel monorepo deployment.
- `.gitignore`: Specifies intentionally untracked files that Git should ignore.
