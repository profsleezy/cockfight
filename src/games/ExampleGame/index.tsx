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
  
  const [commentary, setCommentary] = React.useState([]) // To store the displayed commentary
  const [fightEnded, setFightEnded] = React.useState(false) // To track if the fight has ended
  const [winner, setWinner] = React.useState(null) // To track the winner

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
    if (fightEnded) return

    const possibleCommentary = [
      "White cock takes an uppercut!",
      "Black cock dodges a takedown!",
      "White cock delivers a powerful kick!",
      "Black cock charges forward aggressively!",
      "White cock evades with a swift move!",
      "Black cock counters with a jab!"
    ]

    // Pick a random commentary line
    const randomCommentary = possibleCommentary[Math.floor(Math.random() * possibleCommentary.length)]

    // Update the commentary state
    setCommentary(prev => [...prev, randomCommentary])

    // Play sound
    sound.play('test', { playbackRate: .75 + Math.random() * .5 })

    // If this is the third commentary, end the fight
    if (commentary.length === 2) {
      endFight()
    }
  }

  const endFight = () => {
    const randomWinner = Math.random() > 0.5 ? 'black' : 'white'
    setWinner(randomWinner)
    setFightEnded(true)
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

            if (!fightEnded) {
              // Draw the chickens if the fight hasn't ended
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

              // Draw the commentary text
              ctx.font = '24px Arial'
              ctx.fillStyle = 'white'
              ctx.textAlign = 'center'
              commentary.forEach((line, index) => {
                ctx.fillText(line, size.width / 2, size.height / 2 + (index + 2) * 30)
              })
            } else {
              // Draw the end screen with the winner
              ctx.font = '32px Arial'
              ctx.fillStyle = 'white'
              ctx.textAlign = 'center'
              ctx.fillText(`${winner === 'black' ? 'Black' : 'White'} cock won!`, size.width / 2, size.height / 4)

              // Draw the winning chicken centered
              if (winner === 'black' && chicken1Ref.current) {
                ctx.drawImage(
                  chicken1Ref.current,
                  size.width / 2 - chicken1Ref.current.width / 2,
                  size.height / 2 - chicken1Ref.current.height / 2,
                  chicken1Ref.current.width,
                  chicken1Ref.current.height
                )
              } else if (winner === 'white' && chicken2Ref.current) {
                ctx.drawImage(
                  chicken2Ref.current,
                  size.width / 2 - chicken2Ref.current.width / 2,
                  size.height / 2 - chicken2Ref.current.height / 2,
                  chicken2Ref.current.width,
                  chicken2Ref.current.height
                )
              }
            }
          }}
        />
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        <GambaUi.Button onClick={click}>
          Useless button
        </GambaUi.Button>
        <GambaUi.PlayButton onClick={play}>
          Double Or nothing
        </GambaUi.PlayButton>
      </GambaUi.Portal>
    </>
  )
}
