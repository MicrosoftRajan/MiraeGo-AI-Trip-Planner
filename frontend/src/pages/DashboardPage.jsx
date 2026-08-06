import { useState } from 'react'
import DashShell from '../components/dashboard/DashShell'
import Dashboard from '../components/dashboard/Dashboard'

export default function DashboardPage() {
  const [search, setSearch] = useState('')

  return (
    <DashShell>
      <Dashboard search={search} onSearchChange={setSearch} />
    </DashShell>
  )
}
