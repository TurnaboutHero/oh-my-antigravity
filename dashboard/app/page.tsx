import AgentGraph from '@/components/AgentGraph'
import LiveLog from '@/components/LiveLog'
import { Activity, Cpu, GitBranch, Terminal } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen p-8 flex flex-col gap-6">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Sisyphus Control Center
          </h1>
          <p className="text-gray-400 mt-2">Oh My Antigravity Orchestration Dashboard</p>
        </div>
        <div className="flex gap-4">
          <StatusCard icon={Activity} label="Status" value="Online" color="text-green-400" />
          <StatusCard icon={Cpu} label="Load" value="12%" color="text-blue-400" />
          <StatusCard icon={GitBranch} label="Active Threads" value="3" color="text-purple-400" />
        </div>
      </header>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-gray-200">Orchestration Graph</h2>
            </div>
            <AgentGraph />
        </div>
        <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-200">Live Activity</h2>
            </div>
            <LiveLog />
        </div>
      </div>

    </main>
  )
}

function StatusCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 min-w-[140px] flex items-center gap-4">
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
        <div className={`text-lg font-bold ${color}`}>{value}</div>
      </div>
    </div>
  )
}
