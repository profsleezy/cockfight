import React, { useEffect, useRef } from 'react';
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;
      console.log('Canvas clicked at:', clickX, clickY);
    }
  };

  const click = () => {
    console.log('Button clicked');
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%' }}
          onClick={handleCanvasClick}
        />
        <GambaUi.Canvas
          render={({ ctx, size }) => {
            ctx.clearRect(0, 0, size.width, size.height);
            ctx.fillStyle = 'lightgray';
            ctx.fillRect(0, 0, size.width, size.height);
            ctx.font = '30px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.fillText('Click on the canvas!', size.width / 2, size.height / 2);
          }}
        />
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput
          options={WAGER_OPTIONS}
          value={wager}
          onChange={setWager}
        />
        <GambaUi.Button onClick={click}>Test Button</GambaUi.Button>
      </GambaUi.Portal>
      <BottomIcons />
    </>
  );
}
