import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import React from 'react'
import SOUND from './test.mp3'

// Import the chicken images
import chicken1 from './gif1.png'
import chicken2 from './gif2.png'

export default function ExampleGame() {
  const [wager, setWager] = useWagerInput()
  const game = GambaUi.useGame()
  const sound = useSound({ test: SOUND })

  const chicken1Ref = React.useRef()
  const chicken2Ref = React.useRef()

  React.useEffect(() => {
    // Load the chicken images into Image objects
    const chicken1Image = new Image()
    chicken1Image.src = chicken1
    chicken1Image.onload = () => {
      chicken1Ref.current = chicken1Image
    }

    const chicken2Image = new Image()
    chicken2Image.src = chicken2
    chicken2Image.onload = () => {
      chicken2Ref.current = chicken2Image
    }
  }, [])

  const click = () => {
    sound.play('test', { playbackRate: .75 + Math.random() * .5 })
  }

  const play = async () => {
    await game.play({
      wager,
      bet: [2, 0],
    })
    const result = await game.result()
    console.log(result)
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <GambaUi.Canvas
          render={({ ctx, size }) => {
            // Clear the canvas
            ctx.clearRect(0, 0, size.width, size.height)

            // Draw the chickens if they are loaded
            if (chicken1Ref.current && chicken2Ref.current) {
              const maxChickenWidth = size.width / 4; // Maximum width available for each chicken
              const maxChickenHeight = size.height / 4; // Maximum height available for each chicken

              // Calculate the aspect ratio of each chicken
              const chicken1AspectRatio = chicken1Ref.current.width / chicken1Ref.current.height;
              const chicken2AspectRatio = chicken2Ref.current.width / chicken2Ref.current.height;

              // Calculate the dimensions for the first chicken while maintaining aspect ratio
              let chicken1Width = maxChickenWidth;
              let chicken1Height = maxChickenWidth / chicken1AspectRatio;
              if (chicken1Height > maxChickenHeight) {
                chicken1Height = maxChickenHeight;
                chicken1Width = maxChickenHeight * chicken1AspectRatio;
              }

              // Calculate the dimensions for the second chicken while maintaining aspect ratio
              let chicken2Width = maxChickenWidth;
              let chicken2Height = maxChickenWidth / chicken2AspectRatio;
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
            }
          }}
        />
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        <GambaUi.Button onClick={click}>
          Play Sound
        </GambaUi.Button>
        <GambaUi.PlayButton onClick={play}>
          Double Or nothing
        </GambaUi.PlayButton>
      </GambaUi.Portal>
    </>
  )
}
