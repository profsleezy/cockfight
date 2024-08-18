import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import React from 'react'
import SOUND from './test.mp3'

// Import the GIFs
import gif1 from './gif1.gif'
import gif2 from './gif2.gif'

export default function ExampleGame() {
  const _hue = React.useRef(0)
  const [wager, setWager] = useWagerInput()
  const game = GambaUi.useGame()
  const sound = useSound({ test: SOUND })

  const gif1Ref = React.useRef()
  const gif2Ref = React.useRef()

  React.useEffect(() => {
    // Load the GIFs into Image objects
    const gif1Image = new Image()
    gif1Image.src = gif1
    gif1Image.onload = () => {
      gif1Ref.current = gif1Image
    }

    const gif2Image = new Image()
    gif2Image.src = gif2
    gif2Image.onload = () => {
      gif2Ref.current = gif2Image
    }
  }, [])

  const click = () => {
    _hue.current = (_hue.current + 30) % 360
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
          render={({ ctx, size }, clock) => {
            const scale = 3 + Math.cos(clock.time) * .5
            const hue = _hue.current

            ctx.fillStyle = 'hsla(' + hue + ', 50%, 3%, 1)'
            ctx.fillRect(0, 0, size.width, size.height)

            ctx.save()
            ctx.translate(size.width / 2, size.height / 2)

            for (let i = 0; i < 5; i++) {
              ctx.save()
              ctx.scale(scale * (1 + i), scale * (1 + i))
              ctx.fillStyle = 'hsla(' + hue + ', 75%, 60%, .2)'
              ctx.beginPath()
              ctx.arc(0, 0, 10, 0, Math.PI * 2)
              ctx.fill()
              ctx.restore()
            }

            ctx.fillStyle = 'hsla(' + hue + ', 75%, 60%, 1)'
            ctx.beginPath()
            ctx.arc(0, 0, 8, 0, Math.PI * 2)
            ctx.fill()

            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.font = '32px Arial'

            ctx.fillStyle = 'hsla(' + hue + ', 75%, 90%, 1)'
            ctx.fillText('HELLO', 0, 0)

            ctx.restore()

            // Draw the GIFs if they are loaded
            if (gif1Ref.current && gif2Ref.current) {
              const maxGifWidth = size.width / 4; // Maximum width available for each GIF
              const maxGifHeight = size.height / 4; // Maximum height available for each GIF

              // Calculate the aspect ratio of each GIF
              const gif1AspectRatio = gif1Ref.current.width / gif1Ref.current.height;
              const gif2AspectRatio = gif2Ref.current.width / gif2Ref.current.height;

              // Calculate the dimensions for the first GIF while maintaining aspect ratio
              let gif1Width = maxGifWidth;
              let gif1Height = maxGifWidth / gif1AspectRatio;
              if (gif1Height > maxGifHeight) {
                gif1Height = maxGifHeight;
                gif1Width = maxGifHeight * gif1AspectRatio;
              }

              // Calculate the dimensions for the second GIF while maintaining aspect ratio
              let gif2Width = maxGifWidth;
              let gif2Height = maxGifWidth / gif2AspectRatio;
              if (gif2Height > maxGifHeight) {
                gif2Height = maxGifHeight;
                gif2Width = maxGifHeight * gif2AspectRatio;
              }

              // Draw the first GIF on the left side
              ctx.drawImage(
                gif1Ref.current,
                size.width / 4 - gif1Width / 2,
                size.height - gif1Height - 20,
                gif1Width,
                gif1Height
              );

              // Draw the second GIF on the right side
              ctx.drawImage(
                gif2Ref.current,
                (3 * size.width) / 4 - gif2Width / 2,
                size.height - gif2Height - 20,
                gif2Width,
                gif2Height
              );
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
