import React, { useEffect, useRef, useState } from 'react';
import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2';
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

const WAGER_OPTIONS = [1, 3, 5, 10, 20, 40, 60, 80, 100];

export default function ExampleGame() {
  const [wager, setWager] = useWagerInput();
  const game = GambaUi.useGame();
  const sound = useSound({
    test: SOUND,
    win: WIN_SOUND,
    loss: LOSS_SOUND,
  });

  const chicken1Ref = useRef<HTMLImageElement | null>(null);
  const chicken2Ref = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [fightEnded, setFightEnded] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [selectedChicken, setSelectedChicken] = useState<string>('black');
  const [resultMessage, setResultMessage] = useState<string>('');
  const [textAnimation, setTextAnimation] = useState(false);

  useEffect(() => {
    const loadImage = (src: string, ref: React.RefObject<HTMLImageElement>) => {
      const image = new Image();
      image.src = src;
      image.onload = () => {
        ref.current = image;
      };
    };

    loadImage(chicken1, chicken1Ref);
    loadImage(chicken2, chicken2Ref);
  }, []);

  useEffect(() => {
    const handleCanvasClick = (event: MouseEvent) => {
      const canvas = canvasRef.current;
      if (canvas && chicken1Ref.current && chicken2Ref.current) {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // Simplified size for debugging
        const chicken1Width = 100;
        const chicken1Height = 100;
        const chicken2Width = 100;
        const chicken2Height = 100;

        const chicken1Box = {
          x: canvas.width / 4 - chicken1Width / 2,
          y: canvas.height / 2 - chicken1Height / 2,
          width: chicken1Width,
          height: chicken1Height,
        };

        const chicken2Box = {
          x: (3 * canvas.width) / 4 - chicken2Width / 2,
          y: canvas.height / 2 - chicken2Height / 2,
          width: chicken2Width,
          height: chicken2Height,
        };

        // Debugging: Log click coordinates and bounding boxes
        console.log('Click Coordinates:', clickX, clickY);
        console.log('Chicken 1 Box:', chicken1Box);
        console.log('Chicken 2 Box:', chicken2Box);

        if (
          clickX >= chicken1Box.x &&
          clickX <= chicken1Box.x + chicken1Box.width &&
          clickY >= chicken1Box.y &&
          clickY <= chicken1Box.y + chicken1Box.height
        ) {
          console.log('Chicken 1 clicked');
          setSelectedChicken('black');
        } else if (
          clickX >= chicken2Box.x &&
          clickX <= chicken2Box.x + chicken2Box.width &&
          clickY >= chicken2Box.y &&
          clickY <= chicken2Box.y + chicken2Box.height
        ) {
          console.log('Chicken 2 clicked');
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
    } else {
      sound.play('loss');
    }
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        <GambaUi.Canvas
          render={({ ctx, size }) => {
            ctx.clearRect(0, 0, size.width, size.height);

            if (chicken1Ref.current && chicken2Ref.current) {
              const chicken1Width = 100; // Simplified width
              const chicken1Height = 100; // Simplified height
              const chicken2Width = 100; // Simplified width
              const chicken2Height = 100; // Simplified height

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
              ctx.strokeStyle = 'red';
              ctx.lineWidth = 5;
              if (selectedChicken === 'black') {
                ctx.strokeRect(
                  size.width / 4 - chicken1Width / 2,
                  size.height / 2 - chicken1Height / 2,
                  chicken1Width,
                  chicken1Height
                );
              } else if (selectedChicken === 'white') {
                ctx.strokeRect(
                  (3 * size.width) / 4 - chicken2Width / 2,
                  size.height / 2 - chicken2Height / 2,
                  chicken2Width,
                  chicken2Height
                );
              }
            }

            if (fightEnded) {
              ctx.font = '20px Arial';
              ctx.textAlign = 'center';
              ctx.fillStyle = 'white';
              ctx.fillText(resultMessage, size.width / 2, size.height / 2);
            }
          }}
        />
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput
          options={WAGER_OPTIONS}
          value={wager}
          onChange={setWager}
        />
        <GambaUi.Button
          onClick={click}
          style={{
            backgroundColor: selectedChicken === 'black' ? 'black' : 'white',
            color: selectedChicken === 'black' ? 'white' : 'black'
          }}
        >
          {fightEnded ? 'Replay' : 'Start Fight'}
        </GambaUi.Button>
        <GambaUi.Button onClick={() => setSelectedChicken(prev => (prev === 'black' ? 'white' : 'black'))}>
          {selectedChicken === 'black' ? 'Black Cock' : 'White Cock'}
        </GambaUi.Button>
      </GambaUi.Portal>
      <BottomIcons />
    </>
  );
