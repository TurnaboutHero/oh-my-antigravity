'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

type NodeType = 'orchestrator' | 'subagent'

interface Node {
  id: string
  label: string
  type: NodeType
  x: number
  y: number
  status: 'idle' | 'active'
}

const initialNodes: Node[] = [
  { id: 'sisyphus', label: 'Sisyphus', type: 'orchestrator', x: 400, y: 300, status: 'active' }, // Sisyphus always active
  { id: 'oracle', label: 'Oracle', type: 'subagent', x: 400, y: 100, status: 'idle' },
  { id: 'pixel', label: 'Pixel', type: 'subagent', x: 650, y: 300, status: 'idle' },
  { id: 'codesmith', label: 'CodeSmith', type: 'subagent', x: 400, y: 500, status: 'idle' },
  { id: 'debugger', label: 'Debugger', type: 'subagent', x: 150, y: 300, status: 'idle' },
  { id: 'stitch', label: 'Stitch', type: 'subagent', x: 600, y: 150, status: 'idle' }, // Add Stitch
]

export default function AgentGraph() {
  const [nodes, setNodes] = useState(initialNodes)
  const [activeAgents, setActiveAgents] = useState<string[]>([])

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status')
        const data = await res.json()
        if (data.active_agents) {
          setActiveAgents(data.active_agents)
        }
      } catch (e) {
        console.error("Failed to fetch status", e)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setNodes(prev => prev.map(n => ({
      ...n,
      status: n.id === 'sisyphus' || activeAgents.includes(n.id) ? 'active' : 'idle'
    })))
  }, [activeAgents])

  return (
    <div className="relative w-full h-[600px] bg-black/50 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
      <svg className="absolute inset-0 w-full h-full">
        {/* Connections based on active agents */}
        {nodes.filter(n => n.id !== 'sisyphus').map(node => (
          <line
            key={node.id}
            x1="400"
            y1="300"
            x2={node.x}
            y2={node.y}
            stroke={node.status === 'active' ? '#3b82f6' : '#333'}
            strokeWidth={node.status === 'active' ? 2 : 1}
            strokeDasharray={node.status === 'active' ? "5,5" : "0"}
            className="transition-colors duration-500"
          >
             {node.status === 'active' && (
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1s" repeatCount="indefinite" />
             )}
          </line>
        ))}
      </svg>

      {nodes.map(node => (
        <motion.div
          key={node.id}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={clsx(
            "absolute flex items-center justify-center w-24 h-24 rounded-full border-2 transition-all duration-300",
            node.type === 'orchestrator' 
              ? "bg-purple-900/50 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5)]" 
              : "bg-slate-900/50 border-slate-700",
            node.status === 'active' && node.type !== 'orchestrator' && "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] bg-blue-900/20"
          )}
          style={{ left: node.x - 48, top: node.y - 48 }}
        >
          <div className="text-center">
            <div className={clsx(
              "font-bold text-sm",
              node.type === 'orchestrator' ? "text-purple-200" : "text-gray-300"
            )}>
              {node.label}
            </div>
            {node.status === 'active' && (
              <div className="text-[10px] text-green-400 animate-pulse">Running</div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
