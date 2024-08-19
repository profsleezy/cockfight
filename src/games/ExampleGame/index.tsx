import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import React from 'react'
import SOUND from './test.mp3'

// Import the chicken images
import chicken1 from './gif1.png' // Black cock
import chicken2 from './gif2.png' // White cock

// Define the sides
const SIDES = {
  black: [2, 0], // Black cock's bet
  white: [0, 2], // White cock's bet
}

export default function ExampleGame() {
  const [wager, setWager] = useWagerInput()
  const game = GambaUi.useGame()
  const sound = useSound({ test: SOUND })

  const chicken1Ref = React.useRef()
  const chicken2Ref = React.useRef()

  const [commentary, setCommentary] = React.useState([]) // To store the displayed commentary
  const [fightEnded, setFightEnded] = React.useState(false) // To track if the fight has ended
  const [winner, setWinner] = React.useState(null) // To track the winner
  const [selectedChicken, setSelectedChicken] = React.useState('black') // To track the selected chicken
  const [resultMessage, setResultMessage] = React.useState('') // To display the result message
  const [effect, setEffect] = React.useState(null) // To track the current effect
  const [textAnimation, setTextAnimation] = React.useState(false) // To track text animation state


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

  const click = async () => {
    if (fightEnded) {
      // Reset the state to start a new fight
      setCommentary([])
      setFightEnded(false)
      setWinner(null)
      setResultMessage('')
      setTextAnimation(false) // Reset text animation
      return
    }

    if (!textAnimation) {
      // Animate text out of the canvas
      setTextAnimation(true)
      setTimeout(() => {
        startFight()
      }, 1000) // Delay to complete text animation
    } else {
      startFight()
    }
  }

  const startFight = async () => {
    if (commentary.length === 0) {
      const possibleCommentary = [
        "White cock takes an uppercut!",
        "Black cock dodges a takedown!",
        "White cock delivers a powerful kick!",
        "Black cock charges forward aggressively!",
        "White cock evades with a swift move!",
        "Black cock counters with a jab!"
      ]

      // Randomly select three unique commentary lines
      const selectedCommentary = []
      while (selectedCommentary.length < 4) {
        const randomIndex = Math.floor(Math.random() * possibleCommentary.length)
        const selectedLine = possibleCommentary[randomIndex]
        if (!selectedCommentary.includes(selectedLine)) {
          selectedCommentary.push(selectedLine)
        }
      }

      let index = 0

      const displayNextCommentary = () => {
        if (index < selectedCommentary.length) {
          // Update the commentary state with the next line
          setCommentary(prev => [...prev, selectedCommentary[index]])

          // Play sound
          sound.play('test', { playbackRate: .75 + Math.random() * .5 })

          // Trigger effects based on the commentary line
          triggerEffect(index)

          // Move to the next commentary line after a delay
          index++
          setTimeout(displayNextCommentary, 2000) // 2-second delay
        } else {
          // End the fight after all commentary is displayed
          endFight()
        }
      }

      // Start displaying the commentary
      displayNextCommentary()
    }
  }

  const endFight = async () => {
    // Simulate game play and result fetching
    await game.play({
      bet: SIDES[selectedChicken], // Use SIDES to determine the bet
      wager,
      metadata: [selectedChicken],
    })

    const result = await game.result()
    const actualWinner = result.resultIndex === 0 ? 'black' : 'white' // Map resultIndex to actual winner

    const win = result.payout > 0 && actualWinner === selectedChicken

    // Determine the result message
    setResultMessage(win ? `You won! ${selectedChicken === 'black' ? 'Black cock' : 'White cock'} won!` : `You lost! ${actualWinner === 'black' ? 'Black cock' : 'White cock'} won!`)
    setWinner(actualWinner)
    setFightEnded(true)
  }

  const triggerEffect = (index) => {
    // Define effects based on the commentary line index
    switch (index) {
      case 0:
        // Shake effect
        setEffect({ type: 'shake', duration: 500 })
        break
      case 1:
        // Invert color effect
        setEffect({ type: 'invert', duration: 500 })
        break
      case 2:
        // Second Shake effect (more intense or different timing)
        setEffect({ type: 'shake', duration: 700 })
        break
      default:
        setEffect(null)
    }

    // Clear the effect after its duration
    setTimeout(() => {
      setEffect(null)
    }, 500)
  }

  const toggleChicken = () => {
    // Toggle between black and white cock
    setSelectedChicken(prev => (prev === 'black' ? 'white' : 'black'))
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <GambaUi.Canvas
          render={({ ctx, size }) => {
            // Clear the canvas
            ctx.clearRect(0, 0, size.width, size.height)

            // Apply effects if any
            if (effect) {
              switch (effect.type) {
                case 'shake':
                  const shakeMagnitude = 8 // Increased shake intensity for second shake effect
                  const offsetX = Math.random() * shakeMagnitude - shakeMagnitude / 2
                  const offsetY = Math.random() * shakeMagnitude - shakeMagnitude / 2
                  ctx.translate(offsetX, offsetY)
                  break
                case 'invert':
                  ctx.filter = 'invert(100%)'
                  break
                default:
                  break
              }
            }

            if (!fightEnded) {

              // Draw the initial text above the chickens if the game hasn't started
              if (!textAnimation) {
                ctx.font = '24px Arial'
                ctx.fillStyle = 'white'
                ctx.textAlign = 'center'
                ctx.fillText('Black Cock vs White Cock', size.width / 2, size.height / 6)
              }
              
              // Animate text out of the canvas if animation is active
              if (textAnimation) {
                ctx.save()
                ctx.translate(0, -size.height) // Move the text up out of view
                ctx.font = '24px Arial'
                ctx.fillStyle = 'white'
                ctx.textAlign = 'center'
                ctx.fillText('Black Cock vs White Cock', size.width / 2, size.height / 6)
                ctx.restore()
              }
              
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
                )
              }

              // Draw the commentary text
              ctx.font = '24px Arial'
              ctx.fillStyle = 'white'
              ctx.textAlign = 'center'
              commentary.forEach((line, index) => {
                if (line) { // Ensure line is defined
                  ctx.fillText(line, size.width / 2, size.height / 2 + (index + 2) * 30)
                }
              })
            } else {
              // Draw the end screen with the winner
              ctx.font = '32px Arial'
              ctx.fillStyle = 'white'
              ctx.textAlign = 'center'
              ctx.fillText(resultMessage, size.width / 2, size.height / 4)

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

            // Reset transformations and filters if an effect was applied
            if (effect) {
              ctx.setTransform(1, 0, 0, 1, 0, 0) // Reset transformations after applying the effect
              ctx.filter = 'none' // Reset filter after applying the effect
            }
          }}
        />
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        <GambaUi.Button onClick={click}>
          {fightEnded ? 'Replay' : 'Start Fight'}
        </GambaUi.Button>
        <GambaUi.Button onClick={toggleChicken}>
          {selectedChicken === 'black' ? 'Black Cock' : 'White Cock'}
        </GambaUi.Button>
      </GambaUi.Portal>
    </>
  )
}
