import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './styles/index.css'
import App from './App'
import { initAnalytics } from './utils/analytics'
import { site } from './config/site'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

initAnalytics()

if (import.meta.env.DEV) {
  const missing = [
    !site.url && 'site.url',
    !site.contact.email && 'contact.email',
    !site.contact.whatsapp && 'contact.whatsapp',
    !site.form.endpoint && 'form.endpoint',
    !site.social.instagram && 'social.instagram',
    !site.social.linkedin && 'social.linkedin',
  ].filter(Boolean)
  if (missing.length) console.info('[Alderige] Configure em src/config/site.ts:', missing.join(', '))
}
