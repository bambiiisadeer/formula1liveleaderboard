import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LeaderLiveBoard from './leaderliveboard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LeaderLiveBoard />
  </StrictMode>,
)
