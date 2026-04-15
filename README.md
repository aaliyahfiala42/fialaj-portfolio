# Jennifer Fiala Portfolio

A clean, responsive Node.js + Express portfolio website with:

- neutral, maroon, and green styling
- subtle plant-inspired effects
- hover animations
- mobile-friendly responsive layout
- editable text, links, images, and hero video
- simple admin login and dashboard

## Tech stack

- Node.js
- Express
- EJS templates
- express-session for admin login
- Multer for media uploads
- JSON content storage for easy editing

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
3. Update the admin credentials in `.env`.
4. Start the app:
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```
5. Open:
   ```
   http://localhost:3000
   ```

## Admin login

Go to `/login` and sign in with the username and password from `.env`.

## Editing content

After logging in, open `/admin` to edit:

- homepage text
- table of contents links
- education
- work experience
- projects
- volunteer work
- skills, accomplishments, and certifications
- gallery photos
- profile image
- waterfall feature image
- hero video and poster image

All content is stored in:

```bash
data/content.json
```

Uploaded files are saved to:

```bash
public/uploads
```

## Notes

- Replace the LinkedIn URL with Jennifer’s real LinkedIn profile.
- The app includes generated placeholder images and a looping background video so the site works right away.
- You can also paste external image or video URLs in the admin panel instead of uploading local files.
