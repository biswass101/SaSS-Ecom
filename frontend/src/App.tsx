import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowUpRight, Bell, ChevronDown, CircleDollarSign, Menu, Package, Plus, ShoppingCart, Users } from 'lucide-react'
import { useAppStore } from './store/app-store'
import './App.css'

const workspaceSchema = z.object({ workspaceName: z.string().min(2) })
type WorkspaceForm = z.infer<typeof workspaceSchema>

const metrics = [
  { label: 'Gross volume', value: '$128,430', change: '+18.2%', icon: CircleDollarSign },
  { label: 'Active subscriptions', value: '2,841', change: '+12.4%', icon: Users },
  { label: 'Orders this month', value: '1,209', change: '+8.7%', icon: ShoppingCart },
]

function App() {
  const workspaceName = useAppStore((state) => state.workspaceName)
  const setWorkspaceName = useAppStore((state) => state.setWorkspaceName)
  const { register, handleSubmit } = useForm<WorkspaceForm>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: { workspaceName },
  })

  const saveWorkspace = (values: WorkspaceForm) => setWorkspaceName(values.workspaceName)

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">N</span><span>northstar</span></div>
        <nav><a className="active" href="#overview">Overview</a><a href="#orders">Orders</a><a href="#catalog">Catalog</a><a href="#customers">Customers</a></nav>
        <div className="sidebar-footer"><span className="status-dot" /> All systems operational</div>
      </aside>
      <section className="content">
        <header className="topbar"><button className="icon-button menu-button" aria-label="Open menu"><Menu size={20} /></button><div className="breadcrumbs">Workspace / <strong>Overview</strong></div><div className="top-actions"><button className="icon-button" aria-label="Notifications"><Bell size={18} /></button><div className="avatar">AB</div></div></header>
        <div className="page-content">
          <div className="page-heading"><div><p className="eyebrow">Wednesday, October 7, 2026</p><h1>Good morning, Alex</h1><p className="muted">Here is what is happening across your store today.</p></div><button className="primary-button"><Plus size={17} /> Create order</button></div>
          <div className="metric-grid">{metrics.map(({ label, value, change, icon: Icon }) => <article className="metric" key={label}><div className="metric-icon"><Icon size={19} /></div><p className="muted">{label}</p><div className="metric-value">{value}</div><span className="change">{change} <ArrowUpRight size={14} /></span></article>)}</div>
          <div className="dashboard-grid"><article className="panel revenue-panel"><div className="panel-heading"><div><p className="eyebrow">Revenue performance</p><h2>$128,430.00</h2></div><button className="select-button">Last 30 days <ChevronDown size={15} /></button></div><div className="chart"><div className="chart-fill" /><div className="chart-line" /><span className="chart-label label-one">$32k</span><span className="chart-label label-two">$24k</span><span className="chart-label label-three">$16k</span><div className="chart-axis"><span>Sep 08</span><span>Sep 15</span><span>Sep 22</span><span>Sep 29</span><span>Oct 06</span></div></div></article><article className="panel setup-panel"><div className="panel-heading"><div><p className="eyebrow">Quick setup</p><h2>Make it yours</h2></div><Package size={21} /></div><p className="muted">Name your workspace so your team knows where they are.</p><form onSubmit={handleSubmit(saveWorkspace)}><input {...register('workspaceName')} aria-label="Workspace name" /><button className="primary-button" type="submit">Save</button></form><div className="progress"><span /><small>1 of 4 complete</small></div></article></div>
        </div>
      </section>
    </main>
  )
}

export default App
