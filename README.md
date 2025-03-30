# Elazar's React Template

A clean, responsive React template with light and dark theme support, based on the original HTML template.

## Features

- Light and dark theme with system preference detection
- Responsive design for mobile, tablet, and desktop
- Accessible design with skip links and semantic HTML
- Clean and modern UI
- Single CSS file structure (no CSS modules)

## Setup

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
.
├── public/              # Static files
├── src/                 # Source files
│   ├── components/      # React components
│   │   ├── Header.tsx   # Header component with theme toggle
│   │   ├── Footer.tsx   # Footer component
│   │   └── ThemeToggle.tsx # Theme toggle component
│   ├── styles/          # CSS styles
│   │   └── style.css    # Single CSS file for the entire app
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Entry point
├── index.html           # HTML template
└── package.json         # Project dependencies
```

## CSS Approach

This template uses a single CSS file (`src/styles/style.css`) for styling the entire application. No CSS modules or other CSS-in-JS solutions are used, as per the requirements.

## Browser Support

This template works in all modern browsers (Chrome, Firefox, Safari, Edge).
