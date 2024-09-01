import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2';
import React, { useEffect, useState, useRef } from 'react';
import SOUND from './test.mp3';
import WIN_SOUND from './win.mp3';
import LOSS_SOUND from './lose.mp3';
import chicken1 from './gif1.png'; 
import chicken2 from './gif2.png'; 
import BottomIcons from './BottomIcons';


 const SIDES = {
   black: [2, 0],
   white: [0, 2],
 };

 const WAGER_OPTIONS = [1, 3, 5, 10, 20, 40, 60, 80, 100]

export default function ExampleGame() {
  const [wager, setWager] = useWagerInput();
  const game = GambaUi.useGame();
  const sound = useSound({
    test: SOUND,
    win: WIN_SOUND,
    loss: LOSS_SOUND,
  });

  const chicken1Ref = useRef();
  const chicken2Ref = useRef();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [fightEnded, setFightEnded] = useState(false);
  const [winner, setWinner] = useState(null);
  const [selectedChicken, setSelectedChicken] = useState('black');
  const [resultMessage, setResultMessage] = useState('');
  const [effect, setEffect] = useState(null);
  const [textAnimation, setTextAnimation] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
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

  useEffect(() => {
    const handleCanvasClick = (event: MouseEvent) => {
      const canvas = canvasRef.current;
      if (canvas && chicken1Ref.current && chicken2Ref.current) {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
  
        // Define the chickens' bounding boxes
        const chicken1Box = {
          x: canvas.width / 4 - chicken1Ref.current.width / 2,
          y: canvas.height / 2 - chicken1Ref.current.height / 2,
          width: chicken1Ref.current.width,
          height: chicken1Ref.current.height,
        };
  
        const chicken2Box = {
          x: (3 * canvas.width) / 4 - chicken2Ref.current.width / 2,
          y: canvas.height / 2 - chicken2Ref.current.height / 2,
          width: chicken2Ref.current.width,
          height: chicken2Ref.current.height,
        };
  
        // Check if the click is within the first chicken's bounding box
        if (
          clickX >= chicken1Box.x &&
          clickX <= chicken1Box.x + chicken1Box.width &&
          clickY >= chicken1Box.y &&
          clickY <= chicken1Box.y + chicken1Box.height
        ) {
          setSelectedChicken('black');
        }
  
        // Check if the click is within the second chicken's bounding box
        if (
          clickX >= chicken2Box.x &&
          clickX <= chicken2Box.x + chicken2Box.width &&
          clickY >= chicken2Box.y &&
          clickY <= chicken2Box.y + chicken2Box.height
        ) {
          setSelectedChicken('white');
        }
      }
    };
  
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('click', handleCanvasClick);
    }
  
    return () => {
      if (canvas) {
        canvas.removeEventListener('click', handleCanvasClick);
      }
    };
  }, [fightEnded]);

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
      <GambaUi.Portal target="screen">
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        <GambaUi.Canvas
          render={({ ctx, size }) => {
            ctx.clearRect(0, 0, size.width, size.height);

            const baseFontSize = size.width * 0.05; 
            const smallFontSize = baseFontSize * 0.6; 

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
                ctx.font = `${baseFontSize}px "VT323", monospace`;
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText('Pick a cock, Double or nothing your solana', size.width / 2, size.height / 6);
              }

              if (textAnimation) {
                ctx.save();
                ctx.translate(0, -size.height);
                ctx.font = `${baseFontSize}px "VT323", monospace`;
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
                let chicken2Height = maxChickenWidth / chicken2AspectRatio;
                if (chicken2Height > maxChickenHeight) {
                  chicken2Height = maxChickenHeight;
                  chicken2Width = maxChickenHeight * chicken2AspectRatio;
                }

                const chicken1X = size.width / 4 - chicken1Width / 2;
                const chicken1Y = size.height / 2 - chicken1Height / 2;

                const chicken2X = (3 * size.width) / 4 - chicken2Width / 2;
                const chicken2Y = size.height / 2 - chicken2Height / 2;

                ctx.drawImage(chicken1Ref.current, chicken1X, chicken1Y, chicken1Width, chicken1Height);
                ctx.drawImage(chicken2Ref.current, chicken2X, chicken2Y, chicken2Width, chicken2Height);

                if (selectedChicken === 'black') {
                  ctx.strokeStyle = 'red';
                  ctx.lineWidth = 5;
                  ctx.strokeRect(chicken1X, chicken1Y, chicken1Width, chicken1Height);
                } else if (selectedChicken === 'white') {
                  ctx.strokeStyle = 'red';
                  ctx.lineWidth = 5;
                  ctx.strokeRect(chicken2X, chicken2Y, chicken2Width, chicken2Height);
                }
              }
            } else {
              ctx.font = `${baseFontSize}px "VT323", monospace`;
              ctx.fillStyle = winner === selectedChicken ? 'green' : 'red';
              ctx.textAlign = 'center';
              ctx.fillText(resultMessage, size.width / 2, size.height / 2);

              if (confetti.length > 0) {
                confetti.forEach((particle) => {
                  ctx.fillStyle = particle.color;
                  ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
                });
              }
            }

            ctx.resetTransform();
            ctx.filter = 'none';
          }}
        />
      </GambaUi.Portal>
      <GambaUi.WagerPicker value={wager} onChange={setWager} options={WAGER_OPTIONS} />
      <BottomIcons
        onClick={click}
        fightEnded={fightEnded}
        winner={winner}
        selectedChicken={selectedChicken}
        toggleChicken={toggleChicken}
      />
    </>
  );
}
