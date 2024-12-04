import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

export const IS_DEV = true;

createRoot(document.getElementById('root')!).render(
  <>
    {IS_DEV ? (
      <>
        {/* {app.editor && <CustomEditor />} */}
        <App />
      </>
    ) : (
      <StrictMode>
        <App />
      </StrictMode>
    )}
  </>,
)
