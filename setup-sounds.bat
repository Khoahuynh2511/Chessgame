@echo off
echo Setting up chess sounds...

rem Create sounds directory if it doesn't exist
if not exist public\sounds mkdir public\sounds

echo Downloading chess sound effects...
rem Use curl to download sample sound effects
curl -o public\sounds\move.mp3 https://www.soundjay.com/button/sounds/button-28.mp3
curl -o public\sounds\capture.mp3 https://www.soundjay.com/button/sounds/button-14.mp3
curl -o public\sounds\check.mp3 https://www.soundjay.com/button/sounds/button-09.mp3
curl -o public\sounds\checkmate.mp3 https://www.soundjay.com/button/sounds/button-35.mp3
curl -o public\sounds\castle.mp3 https://www.soundjay.com/button/sounds/button-21.mp3
curl -o public\sounds\draw.mp3 https://www.soundjay.com/button/sounds/button-42.mp3
curl -o public\sounds\promotion.mp3 https://www.soundjay.com/button/sounds/button-30.mp3

echo Sound setup complete!
echo You can replace these placeholder sounds with actual chess sound effects. 