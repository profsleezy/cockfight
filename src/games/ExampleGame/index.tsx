import { Canvas } from '@react-three/fiber'
import { GambaUi, useSound } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import SOUND_LOSE from './lose.mp3'
import SOUND_WIN from './win.mp3'

const SIDES = {
  black: [2, 0],
  white: [0, 2],
}
const WAGER_OPTIONS = [1, 5, 10, 50, 100]

type Side = keyof typeof SIDES

function CockFight() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [fighting, setFighting] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  const [side, setSide] = React.useState<Side>('black')
  const [wager, setWager] = React.useState(WAGER_OPTIONS[0])

  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
  })

  const play = async () => {
    try {
      setWin(false)
      setFighting(true)

      await game.play({
        bet: SIDES[side],
        wager,
        metadata: [side],
      })

      sounds.play('rooster')

      const result = await game.result()

      const win = result.payout > 0

      setResultIndex(result.resultIndex)

      setWin(win)

      if (win) {
        sounds.play('win')
      } else {
        sounds.play('lose')
      }
    } finally {
      setFighting(false)
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <Canvas
          linear
          flat
          orthographic
          camera={{
            zoom: 80,
            position: [0, 0, 100],
          }}
        >
          <React.Suspense fallback={null}>
            <Cock result={resultIndex} fighting={fighting} />
          </React.Suspense>
          <Effect color="white" />

          {fighting && <Effect color="white" />}
          {win && <Effect color="#42ff78" />}
          <ambientLight intensity={3} />
          <directionalLight
            position-z={1}
            position-y={1}
            castShadow
            color="#CCCCCC"
          />
          <hemisphereLight
            intensity={.5}
            position={[0, 1, 0]}
            scale={[1, 1, 1]}
            color="#ffadad"
            groundColor="#6666fe"
          />
        </Canvas>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput
          options={WAGER_OPTIONS}
          value={wager}
          onChange={setWager}
        />
        <GambaUi.Button disabled={gamba.isPlaying} onClick={() => setSide(side === 'black' ? 'white' : 'black')}>
          <div style={{ display: 'flex' }}>
            <img height="20px" src={side === 'black' ? 'black_cock.png' : 'white_cock.png'} />
            {side === 'black' ? 'Black Cock' : 'White Cock' }
          </div>
        </GambaUi.Button>
        <GambaUi.PlayButton onClick={play}>
          Fight!
        </GambaUi.PlayButton>
      </GambaUi.Portal>
    </>
  )
}

export default CockFight
