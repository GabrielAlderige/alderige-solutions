import { SceneCanvas } from '@/components/3d/SceneCanvas'
import { Hero } from '@/components/sections/Hero'
import { Manifesto } from '@/components/sections/Manifesto'
import { Solutions } from '@/components/sections/Solutions'
import { Projects } from '@/components/sections/Projects'
import { Process } from '@/components/sections/Process'
import { Differentials } from '@/components/sections/Differentials'
import { Insights } from '@/components/sections/Insights'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Contact } from '@/components/sections/Contact'
import { Marquee } from '@/components/ui/Marquee'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { useSceneChoreography } from '@/hooks/useSceneChoreography'

export default function Home() {
  useDocumentMeta({ path: '/' })
  useSceneChoreography()

  return (
    <>
      <SceneCanvas />
      <Hero />
      <Marquee />
      <Manifesto />
      <Solutions />
      <Projects />
      <Process />
      <Differentials />
      <Insights />
      <FinalCTA />
      <Contact />
    </>
  )
}
