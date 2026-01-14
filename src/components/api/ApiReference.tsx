'use client'

import { ApiReferenceReact } from '@scalar/api-reference-react'
import '@scalar/api-reference-react/style.css'
import { openApiSpec } from '@/lib/openapi'

export function ApiReference() {
  return (
    <>
      <ApiReferenceReact
        configuration={{
          content: openApiSpec,
          theme: 'kepler',
          hideDarkModeToggle: true,
          showSidebar: true,
          hideModels: false,
          defaultOpenAllTags: false,
          proxyUrl: 'https://proxy.scalar.com',
        }}
      />
      <style jsx global>{`
        /* Make Scalar fill the container and handle its own scrolling */
        .scalar-app,
        .scalar-api-reference {
          height: 100% !important;
        }
      `}</style>
    </>
  )
}
