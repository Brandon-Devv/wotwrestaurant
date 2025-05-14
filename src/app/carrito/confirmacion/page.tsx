'use client'

import { Suspense } from 'react'
import ConfirmacionContent from './ConfirmacionContent'

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Cargando confirmación...</p>}>
      <ConfirmacionContent />
    </Suspense>
  )
}
