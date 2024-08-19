import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import React from 'react'
import SOUND from './test.mp3'

// Import the chicken and banner images
import chicken1 from './gif1.png' // Black cock
import chicken2 from './gif2.png' // White cock
import bannerImage from './cockfight.png' // Image to display above chickens

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
  const banner1Ref = React.useRef()
  const banner2Ref = React.useRef()

  const [commentary, setCommentary] = React.useState([]) // To store the displayed commentary
  const [fightEnded, setFightEnded] = React.useState(false) // To track if the fight has ended
  const [winner, setWinner] = React.useState(null) // To track the winner
  const [selectedChicken, setSelectedChicken] = React.useState('black') // To track the selected chicken
  const [resultMessage, setResultMessage] = React.useState('') // To display the result message
  const [effect, setEffect] = React.useState(null) // To track the current effect
  const [bannerAnimation, setBannerAnimation] = React.useState({}) // Track banner animation state

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

    const banner1Image = new Image()
    banner1Image.src = bannerImage
    banner1Image.onload = () => {
      banner1Ref.current = banner1Image
    }

    const banner2Image = new Image()
    banner2Image.src = bannerImage
    banner2Image.onload = () => {
      banner2Ref.current = banner2Image
    }
  }, [])

  const click = async () => {
    if (fightEnded) {
      // Reset the state to start a new fight
      setCommentary([])
      setFightEnded(false)
      setWinner(null)
      setResultMessage('')
      setBannerAnimation({}) // Reset banner animation
      return
    }

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
      while (selectedCommentary.length < 3) {
        const randomIndex = Math.floor(Math.random() * possibleCommentary.length)
        const selectedLine = possibleCommentary[randomIndex]
        if (!selectedCommentary.includes(selectedLine)) {
          selectedCommentary.push(selectedLine)
        }
      }

      // Start banner animation when the game starts
      setBannerAnimation({
        banner1: { animate: true, direction: 'up' },
        banner2: { animate: true, direction: 'up' }
      })

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
              // Draw the banners above the chickens
              if (banner1Ref.current && banner2Ref.current) {
                const bannerWidth = size.width / 4
                const bannerHeight = bannerWidth / (banner1Ref.current.width / banner1Ref.current.height)

                const banner1Y = bannerAnimation.banner1?.animate ? -bannerHeight : size.height / 4 - bannerHeight * 1.5
                const banner2Y = bannerAnimation.banner2?.animate ? -bannerHeight : size.height / 4 - bannerHeight * 1.5

                // Draw banner for the first chicken
                ctx.drawImage(
                  banner1Ref.current,
                  size.width / 4 - bannerWidth / 2,
                  banner1Y,
                  bannerWidth,
                  bannerHeight
                )

                // Draw banner for the second chicken
                ctx.drawImage(
                  banner2Ref.current,
                  (3 * size.width) / 4 - bannerWidth / 2,
                  banner2Y,
                  bannerWidth,
                  bannerHeight
                )
              }

              // Draw the chickens
              if (chicken1Ref.current && chicken2Ref.current) {
                const maxChickenWidth = size.width / 4 // Maximum width available for each chicken
                const maxChickenHeight = size.height / 4 // Maximum height available for each chicken

                // Calculate the aspect ratio of each chicken
                const chicken1AspectRatio = chicken1Ref.current.width / chicken1Ref.current.height
                const chicken2AspectRatio = chicken2Ref.current.width / chicken2Ref.current.height

                // Calculate the dimensions for the first chicken while maintaining aspect ratio
                let chicken1Width = maxChickenWidth
                let chicken1Height = maxChickenWidth / chicken1AspectRatio
                if (chicken1Height > maxChickenHeight) {
                  chicken1Height = maxChickenHeight
                  chicken1Width = maxChickenHeight * chicken1AspectRatio
                }

                // Calculate the dimensions for the second chicken while maintaining aspect ratio
                let chicken2Width = maxChickenWidth
                let chicken2Height = maxChickenWidth / chicken2AspectRatio
                if (chicken2Height > maxChickenHeight) {
                  chicken2Height = maxChickenHeight
                  chicken2Width = maxChickenHeight * chicken2AspectRatio
                }

                // Draw first chicken
                ctx.drawImage(
                  chicken1Ref.current,
                  size.width / 4 - chicken1Width / 2,
                  size.height / 2 - chicken1Height / 2,
                  chicken1Width,
                  chicken1Height
                )

                // Draw second chicken
                ctx.drawImage(
                  chicken2Ref.current,
                  (3 * size.width) / 4 - chicken2Width / 2,
                  size.height / 2 - chicken2Height / 2,
                  chicken2Width,
                  chicken2Height
                )
              }
            } else {
              // Display the winning chicken
              const winningChicken = winner === 'black' ? chicken1Ref.current : chicken2Ref.current
              const maxChickenWidth = size.width / 2 // Use half of the canvas width for the winning chicken
              const maxChickenHeight = size.height / 2 // Use half of the canvas height for the winning chicken

              const chickenAspectRatio = winningChicken.width / winningChicken.height

              let chickenWidth = maxChickenWidth
              let chickenHeight = maxChickenWidth / chickenAspectRatio
              if (chickenHeight > maxChickenHeight) {
                chickenHeight = maxChickenHeight
                chickenWidth = maxChickenHeight * chickenAspectRatio
              }

              ctx.drawImage(
                winningChicken,
                size.width / 2 - chickenWidth / 2,
                size.height / 2 - chickenHeight / 2,
                chickenWidth,
                chickenHeight
              )

              // Display the result message
              ctx.font = '30px Arial'
              ctx.fillStyle = 'white'
              ctx.textAlign = 'center'
              ctx.fillText(resultMessage, size.width / 2, size.height / 4)
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
