# CV Backend - Express.js API

A simple REST API server for serving CV data built with Express.js and Node.js.

## Installation

```bash
npm install
```

## Development

Run the server with hot-reload using nodemon:

```bash
npm run dev
```

## Production

Start the server:

```bash
npm start
```

## API Endpoints

- `GET /api/cv` - Get complete CV data
- `GET /api/cv/profile` - Get profile information
- `GET /api/cv/skills` - Get skills list
- `GET /api/cv/experiences` - Get work experiences
- `GET /api/cv/education` - Get education details
- `GET /api/cv/projects` - Get projects
- `GET /api/cv/socials` - Get social media links
- `GET /api/health` - Health check endpoint

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Middleware**: CORS
- **Dev Tool**: Nodemon

## Data Source

CV data is stored in `data/cv.json` and served through the API endpoints.
