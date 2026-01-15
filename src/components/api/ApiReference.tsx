'use client'

import { ApiReferenceReact } from '@scalar/api-reference-react'
import '@scalar/api-reference-react/style.css'
import { useTheme } from 'next-themes'
import { openApiSpec } from '@/lib/openapi'

export function ApiReference() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <>
      <ApiReferenceReact
        configuration={{
          content: openApiSpec,
          darkMode: isDark,
          hideDarkModeToggle: true,
          showSidebar: true,
          hideModels: false,
          defaultOpenAllTags: false,
          proxyUrl: 'https://proxy.scalar.com',
        }}
      />
      <style jsx global>{`
        /* Make Scalar fill the container */
        .scalar-app,
        .scalar-api-reference {
          height: 100% !important;
        }
        
        /* Force sidebar backgrounds to be transparent */
        .scalar-api-reference .sidebar,
        .scalar-api-reference .sidebar-content,
        .scalar-api-reference [class*="sidebar"]:not([class*="header"]),
        .scalar-api-reference [class*="Sidebar"]:not([class*="header"]),
        .scalar-api-reference .t-doc__sidebar {
          background: transparent !important;
          background-color: transparent !important;
        }
        
        /* Override Scalar CSS variables - keep background-1 for header */
        .scalar-app {
          --scalar-background-2: transparent !important;
          --scalar-background-3: transparent !important;
          --scalar-sidebar-background: transparent !important;
        }
      `}</style>
    </>
  )
}
