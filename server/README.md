
# PixAI Animation Server

This is the backend server for PixAI animation generation using Google's Gemini API.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your Gemini API key:
   ```
   cp .env.example .env
   ```

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### `/api/generate-story`
Generates a story based on a prompt and settings.

### `/api/generate-scenes`
Breaks down a story into individual scenes.

### `/api/generate-animation`
Generates an animation from scenes.

### `/api/animation-progress`
Gets the current progress of animation generation.

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key
- `PORT`: Server port (default: 3000)
