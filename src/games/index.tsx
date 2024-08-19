import { GameBundle } from 'gamba-react-ui-v2'
import React from 'react'

export const GAMES: GameBundle[] = [
   {
     id: 'cockfight',
     meta: {
       background: '#00ffe1',
       name: 'CockFight',
       image: '#',
       description: 'bet on the right cock and win REAL cash',
     },
     app: React.lazy(() => import('./ExampleGame')),
   },
  ]