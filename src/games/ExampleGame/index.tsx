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
  const [commentaryAnimation, setCommentaryAnimation] = React.useState([]) // To track commentary animations

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
      setCommentaryAnimation([])
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
        "Black cock counters with a jab!",
        "White cocks uppercut lands with a jackhammer thud!",
        "Black cock dodges like he’s dancing in the rain!",
        "White cocks kick could smash a watermelon!",
        "Black cock charges forward as if he’s late for lunch!",
        "White cock evades smoothly, like butter on a hot pan!",
        "Black cock counters with a jab faster than a cat’s swipe!",
        "White cocks body slam shakes the arena!",
        "Black cock sidesteps with impressive agility!",
        "White cocks roundhouse kick is like a meteor impact!",
        "Black cock rolls out of the way like a circus performer!",
        "White cocks flying kick launches like a rocket!",
        "Black cock pecks back with pinpoint precision!",
        "White cocks aerial maneuver is a true showstopper!",
        "Black cock sidesteps gracefully, like sliding on butter!",
        "White cocks combo hits with jet-speed intensity!",
        "Black cock dodges like lightning on a greased floor!",
        "White cocks kick packs enough power to change the weather!",
        "Black cock strikes back like he’s swatting mosquitoes!",
        "White cocks high kick is more dramatic than a soap opera!",
        "Black cock parries and responds with expert precision!",
        "White cocks rapid strikes are delivered at sound-barrier speed!",
        "Black cock spins away with the grace of a ballerina!",
        "White cocks flying kick is launched like a catapult!",
        "Black cock rolls out of the way with silky smoothness!",
        "White cocks knee strike hits with earth-shaking force!",
        "Black cock retaliates with a strike that’s full of zing!",
        "White cocks punch could knock off anyone’s socks!",
        "Black cock bounces back with the agility of a grasshopper!",
        "White cocks rapid strikes come with squirrel-like speed!",
        "Black cock flips like a superhero avoiding an attack!",
        "White cocks aerial attack is precise as a laser!",
        "Black cock sidesteps like a smooth jazz rhythm!",
        "White cocks uppercut connects with rocket-fuel power!",
        "Black cock counters with a jab as sharp as a pencil!",
        "White cocks roundhouse kick could clear a whole room!",
        "Black cock strikes back with Swiss-watch precision!",
        "White cocks dramatic leap lands a solid hit!",
        "Black cock dodges and strikes back with quick precision!",
        "White cocks rapid attacks whip up a storm of force!",
        "Black cock rolls and retaliates like a seasoned pro!"
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
          setCommentaryAnimation(prev => [
            ...prev,
            { index, opacity: 0 } // Initialize animation with opacity 0
          ]) 

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
                ctx.font = '36px "Russo One", sans-serif' // Updated font
                ctx.fillStyle = 'white'
                ctx.textAlign = 'center'
                ctx.fillText('Black Cock vs White Cock', size.width / 2, size.height / 6)
              }

              // Animate text out of the canvas if animation is active
              if (textAnimation) {
                ctx.save()
                ctx.translate(0, -size.height) // Move the text up out of view
                ctx.font = '36px "Russo One", sans-serif' // Updated font
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

              // Draw the commentary text with animation
              ctx.font = '16px "Press Start 2P", cursive' // Updated font
              ctx.fillStyle = 'white'
              ctx.textAlign = 'center'

              commentary.forEach((line, index) => {
                const anim = commentaryAnimation.find(anim => anim.index === index)
                if (line && anim) { // Ensure line and animation state are defined
                  // Apply fade-in effect
                  ctx.globalAlpha = anim.opacity

                  // Apply slide-in effect if needed
                  const slideOffset = 30 * (anim.index + 1) // Adjust the slide offset based on index
                  ctx.fillText(line, size.width / 2, size.height / 2 + slideOffset + (index + 2) * 30)

                  // Update opacity for fade-in effect
                  if (anim.opacity < 1) {
                    anim.opacity += 0.05 // Increment opacity
                  }
                }
              })

              // Reset globalAlpha after drawing
              ctx.globalAlpha = 1
            } else {
              // Display the end screen with the winner
              ctx.font = '32px "Russo One", sans-serif' // Updated font
              ctx.textAlign = 'center'
              ctx.fillStyle = 'white'
              if (winner === 'black') {
                ctx.fillText(resultMessage, size.width / 2, size.height / 2 - 40)
                if (chicken1Ref.current) {
                  ctx.drawImage(
                    chicken1Ref.current,
                    size.width / 2 - chicken1Ref.current.width / 2,
                    size.height / 2 + 10,
                    chicken1Ref.current.width,
                    chicken1Ref.current.height
                  )
                }
              } else if (winner === 'white') {
                ctx.fillText(resultMessage, size.width / 2, size.height / 2 - 40)
                if (chicken2Ref.current) {
                  ctx.drawImage(
                    chicken2Ref.current,
                    size.width / 2 - chicken2Ref.current.width / 2,
                    size.height / 2 + 10,
                    chicken2Ref.current.width,
                    chicken2Ref.current.height
                  )
                }
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
