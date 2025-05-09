# Chess Game

A web-based chess game built with Next.js and chess.js.

## Features

- Full chess game with all standard rules
- Visual representation of the chessboard
- Move validation and highlighting of possible moves
- Game state tracking (check, checkmate, draw)
- Move history display
- Undo moves
- Start new games
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:

```bash
cd ChessGame
```

3. Run the setup script:

```bash
# Windows
setup.bat

# Linux/Mac
chmod +x setup.sh
./setup.sh
```

Or manually install dependencies:

```bash
npm install
# or
yarn install
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
ChessGame/
│
├── public/              # Static files
│   └── images/          # Chess piece images (optional)
│
├── src/                 # Source files
│   ├── components/      # React components
│   │   ├── ChessBoard.tsx     # Main chessboard component
│   │   ├── Piece.tsx          # Chess piece component (Unicode symbols)
│   │   ├── ChessPieceImage.tsx # Alternative piece component (SVG/PNG)
│   │   ├── Square.tsx         # Chess square component
│   │   └── GameHistory.tsx    # Move history component
│   │
│   ├── hooks/           # Custom React hooks
│   │   └── useChessGame.ts    # Chess game state management
│   │
│   ├── pages/           # Next.js pages
│   │   ├── index.tsx    # Home page
│   │   └── _app.tsx     # App wrapper
│   │
│   ├── styles/          # CSS modules
│   │   ├── ChessBoard.module.css
│   │   ├── GameHistory.module.css
│   │   ├── Home.module.css
│   │   ├── Piece.module.css
│   │   ├── Square.module.css
│   │   └── globals.css
│   │
│   └── types/           # TypeScript type definitions
│       └── index.ts
│
├── .gitignore           # Git ignore file
├── Dockerfile           # Docker configuration
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vercel.json          # Vercel deployment configuration
```

## Deployment

This project can be deployed using various platforms:

### Deploy to Vercel (Recommended)

The easiest way to deploy this app is through Vercel:

1. Create an account on [Vercel](https://vercel.com/)
2. Install Vercel CLI:

```bash
npm install -g vercel
```

3. Deploy:

```bash
vercel
```

Follow the prompts, and your app will be deployed.

### Deploy with Docker

1. Build the Docker image:

```bash
docker build -t chess-game .
```

2. Run the container:

```bash
docker run -p 3000:3000 chess-game
```

## Customizing

- Edit the CSS files in the `src/styles` directory to change the appearance
- Replace the Unicode chess pieces with image-based pieces:
  - Add SVG/PNG files to the `public/images` directory
  - Use the `ChessPieceImage` component instead of `Piece` in the ChessBoard component
- Add additional features like:
  - Player accounts
  - Online multiplayer
  - Chess AI
  - ELO rating system

## License

[MIT License](LICENSE) 