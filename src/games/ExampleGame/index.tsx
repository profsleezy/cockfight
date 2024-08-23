import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2';
import React from 'react';
import SOUND from './test.mp3';
import WIN_SOUND from './win.mp3';
import LOSS_SOUND from './lose.mp3';
import chicken1 from './gif1.png'; // Black cock
import chicken2 from './gif2.png'; // White cock

const SIDES = {
  black: [2, 0],
  white: [0, 2],
};

// Function to generate mock results
const generateMockResults = () => {
  const totalGames = 100;
  const results = { black: 0, white: 0 };

  for (let i = 0; i < totalGames; i++) {
    const winner = Math.random() > 0.5 ? 'black' : 'white';
    results[winner]++;
  }

  return results;
};

export default function ExampleGame() {
  const [wager, setWager] = useWagerInput();
  const game = GambaUi.useGame();
  const sound = useSound({
    test: SOUND,
    win: WIN_SOUND,
    loss: LOSS_SOUND,
  });

  const chicken1Ref = React.useRef();
  const chicken2Ref = React.useRef();

  const [fightEnded, setFightEnded] = React.useState(false);
  const [winner, setWinner] = React.useState(null);
  const [selectedChicken, setSelectedChicken] = React.useState('black');
  const [resultMessage, setResultMessage] = React.useState('');
  const [effect, setEffect] = React.useState(null);
  const [textAnimation, setTextAnimation] = React.useState(false);
  const [confetti, setConfetti] = React.useState([]);

  // State for progress bar
  const [progress, setProgress] = React.useState(0);
  const [mockResults, setMockResults] = React.useState(generateMockResults());

  React.useEffect(() => {
    // Update mock results every 5 seconds
    const intervalId = setInterval(() => {
      setMockResults(generateMockResults());
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    console.log('Mock results updated:', mockResults);
    
    // Calculate progress as a percentage of total games
    const totalGames = mockResults.black + mockResults.white;
    const blackWinPercentage = (mockResults.black / totalGames) * 100;

    setProgress(blackWinPercentage);
  }, [mockResults]);

  React.useEffect(() => {
    const chicken1Image = new Image();
    chicken1Image.src = chicken1;
    chicken1Image.onload = () => {
      chicken1Ref.current = chicken1Image;
    };

    const chicken2Image = new Image();
    chicken2Image.src = chicken2;
    chicken2Image.onload = () => {
      chicken2Ref.current = chicken2Image;
    };
  }, []);

  const click = async () => {
    if (fightEnded) {
      setFightEnded(false);
      setWinner(null);
      setResultMessage('');
      setTextAnimation(false);
      setConfetti([]);
      return;
    }

    if (!textAnimation) {
      setTextAnimation(true);
      setTimeout(() => {
        startFight();
      }, 1000);
    } else {
      startFight();
    }
  };

  const startFight = async () => {
    sound.play('test', { playbackRate: 0.75 + Math.random() * 0.5 });
    triggerEffect();
    setTimeout(endFight, 2000);
  };

  const endFight = async () => {
    await game.play({
      bet: SIDES[selectedChicken],
      wager,
      metadata: [selectedChicken],
    });

    const result = await game.result();
    const actualWinner = result.resultIndex === 0 ? 'black' : 'white';

    const win = result.payout > 0 && actualWinner === selectedChicken;
    const payoutAmount = result.payout / 1000000000;
    const lossAmount = wager / 1000000000;

    const formattedPayout = payoutAmount.toFixed(2);
    const formattedLoss = lossAmount.toFixed(2);

    const message = win
      ? `${selectedChicken === 'black' ? 'Black cock' : 'White cock'} won you\n${formattedPayout} SOL`
      : `loser! ${actualWinner === 'black' ? 'Black cock' : 'White cock'} took\n${formattedLoss} SOL`;

    setResultMessage(message);
    setWinner(actualWinner);
    setFightEnded(true);

    if (win) {
      sound.play('win');
      generateConfetti();
    } else {
      sound.play('loss');
      setConfetti([]);
    }
  };

  const triggerEffect = () => {
    const applyEffect = (timesLeft) => {
      if (timesLeft > 0) {
        const effectType = timesLeft % 2 === 0 ? 'shake' : 'invert';
        setEffect({ type: effectType, duration: 500 });
        setTimeout(() => {
          setEffect(null);
          setTimeout(() => {
            applyEffect(timesLeft - 1);
          }, 200);
        }, 500);
      }
    };
    applyEffect(3);
  };

  const toggleChicken = () => {
    setSelectedChicken(prev => (prev === 'black' ? 'white' : 'black'));
  };

  const generateConfetti = () => {
    const newConfetti = Array.from({ length: 100 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 2,
      speedX: Math.random() * 4 - 2,
      speedY: Math.random() * 4 - 2,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    }));
    setConfetti(newConfetti);
  };

  return (
    <>
      <header className="header">
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>
      <GambaUi.Portal target="screen">
        <GambaUi.Canvas
          render={({ ctx, size }) => {
            ctx.clearRect(0, 0, size.width, size.height);

            if (effect) {
              switch (effect.type) {
                case 'shake':
                  const shakeMagnitude = 8;
                  const offsetX = Math.random() * shakeMagnitude - shakeMagnitude / 2;
                  const offsetY = Math.random() * shakeMagnitude - shakeMagnitude / 2;
                  ctx.translate(offsetX, offsetY);
                  break;
                case 'invert':
                  ctx.filter = 'invert(100%)';
                  break;
                default:
                  break;
              }
            }

            if (!fightEnded) {
              if (!textAnimation) {
                ctx.font = '36px "VT323", monospace';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText('Pick a cock, Double or nothing your solana', size.width / 2, size.height / 6);
              }

              if (textAnimation) {
                ctx.save();
                ctx.translate(0, -size.height);
                ctx.font = '36px "VT323", monospace';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText('Pick a cock, Double or nothing your solana', size.width / 2, size.height / 6);
                ctx.restore();
              }

              if (chicken1Ref.current && chicken2Ref.current) {
                const maxChickenWidth = size.width / 4;
                const maxChickenHeight = size.height / 4;

                const chicken1AspectRatio = chicken1Ref.current.width / chicken1Ref.current.height;
                const chicken2AspectRatio = chicken2Ref.current.width / chicken2Ref.current.height;

                let chicken1Width = maxChickenWidth;
                let chicken1Height = maxChickenWidth / chicken1AspectRatio;
                if (chicken1Height > maxChickenHeight) {
                  chicken1Height = maxChickenHeight;
                  chicken1Width = maxChickenHeight * chicken1AspectRatio;
                }

                let chicken2Width = maxChickenWidth;
                let chicken2Height = chicken2Width / chicken2AspectRatio;
                if (chicken2Height > maxChickenHeight) {
                  chicken2Height = maxChickenHeight;
                  chicken2Width = maxChickenHeight * chicken2AspectRatio;
                }

                // Draw the first chicken on the left side
                ctx.drawImage(
                  chicken1Ref.current,
                  size.width / 4 - chicken1Width / 2,
                  size.height / 2 - chicken1Height / 2,
                  chicken1Width,
                  chicken1Height
                );

                // Draw the second chicken on the right side
                ctx.drawImage(
                  chicken2Ref.current,
                  (3 * size.width) / 4 - chicken2Width / 2,
                  size.height / 2 - chicken2Height / 2,
                  chicken2Width,
                  chicken2Height
                );

                // Draw border around selected chicken
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 5;

                if (selectedChicken === 'black') {
                  ctx.strokeRect(
                    size.width / 4 - chicken1Width / 2,
                    size.height / 2 - chicken1Height / 2,
                    chicken1Width,
                    chicken1Height
                  );
                } else {
                  ctx.strokeRect(
                    (3 * size.width) / 4 - chicken2Width / 2,
                    size.height / 2 - chicken2Height / 2,
                    chicken2Width,
                    chicken2Height
                  );
                }
              }
            } else {
              ctx.font = '48px "VT323", monospace';
              ctx.fillStyle = 'white';
              ctx.textAlign = 'center';
              ctx.fillText(resultMessage, size.width / 2, size.height / 2);

              // Draw confetti
              confetti.forEach((piece) => {
                ctx.fillStyle = piece.color;
                ctx.beginPath();
                ctx.arc(piece.x, piece.y, piece.size, 0, 2 * Math.PI);
                ctx.fill();
              });
            }
          }}
        />
      </GambaUi.Portal>
      <GambaUi.Buttons>
        <GambaUi.Button onClick={toggleChicken}>
          Switch Chicken
        </GambaUi.Button>
        <GambaUi.Button
          color={fightEnded ? 'yellow' : 'purple'}
          onClick={click}
        >
          {fightEnded ? 'Play Again' : 'Fight'}
        </GambaUi.Button>
      </GambaUi.Buttons>
    </>
  );
}
