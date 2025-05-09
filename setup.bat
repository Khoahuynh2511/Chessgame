@echo off
echo Installing dependencies for Chess Game...
npm install
echo Creating sample environment file...
echo NEXT_PUBLIC_APP_NAME=Chess Game > .env.local
echo Setup complete! To start the development server, run:
echo npm run dev 