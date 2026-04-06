# LeaveFlow

LeaveFlow is a modern employee leave management application built with React, Vite, Tailwind CSS, and Axios. It includes separate employee and manager experiences for applying, reviewing, and tracking leave requests.

This project was originally built for internal company use and has been refreshed as a portfolio project with updated branding and a Vite-based frontend setup.

## Highlights

- Employee login, signup, forgot password, and profile management
- Employee dashboard for submitting and tracking leave requests
- Manager dashboard for reviewing users and approving or rejecting leave
- Responsive UI for desktop and mobile screens
- Theme-aware interface with polished dashboard layouts

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- Lucide React

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env
```

On Windows PowerShell you can use:

```powershell
Copy-Item .env.example .env
```

3. Set your API base URL in `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

4. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` starts the Vite development server
- `npm start` starts the same Vite development server
- `npm run build` creates a production build in `dist/`
- `npm run preview` previews the production build locally

## Project Structure

```text
src/
  assets/
  components/
  contexts/
  hooks/
  pages/
  services/
public/
```

## Deployment

The project includes a `Dockerfile` configured to build the app with Vite and serve the production output using Nginx.

## Notes

- The frontend now uses Vite environment variables, so `VITE_API_URL` is required instead of CRA-style `REACT_APP_*` variables.
- Generated folders like `dist/` and the old CRA `build/` output are ignored and should not be committed.
