import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import Home from '@/pages/Home'

// Páginas internas carregadas sob demanda
const ProjectPage = lazy(() => import('@/pages/ProjectPage'))
const ArticlePage = lazy(() => import('@/pages/ArticlePage'))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const page = (el: React.ReactNode) => <Suspense fallback={<div className="min-h-[100svh]" />}>{el}</Suspense>

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/projetos/:slug', element: page(<ProjectPage />) },
      { path: '/insights/:slug', element: page(<ArticlePage />) },
      { path: '/privacidade', element: page(<PrivacyPage />) },
      { path: '*', element: page(<NotFound />) },
    ],
  },
], { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' })

export default function App() {
  return <RouterProvider router={router} />
}
