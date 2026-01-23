'use client'

import { useEffect, useRef, useState } from 'react'

interface LogEntry {
  id: string | number
  timestamp: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | string
}

export default function LiveLog() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/status')
        const data = await res.json()
        if (data.logs && Array.isArray(data.logs)) {
             // Append only new logs? Simpler to just replace for now or dedupe
             // For simplicity, we just use the backend log, maybe slice last 50
             setLogs(data.logs.slice(-50))
        }
      } catch (e) {
        console.error("Failed to fetch logs", e)
      }
    }

    fetchLogs()
    const interval = setInterval(fetchLogs, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="bg-black/80 border border-white/10 rounded-xl p-4 h-[600px] flex flex-col font-mono text-xs backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-400 font-bold uppercase tracking-wider">System Logs</h3>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-500">LIVE (Real Data)</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide" ref={scrollRef}>
        {logs.length === 0 && (
            <div className="text-gray-600 italic">Waiting for Sisyphus activity...</div>
        )}
        {logs.map((log, idx) => (
          <div key={log.id || idx} className="flex gap-2">
            <span className="text-gray-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            <span className={
              log.type === 'error' ? 'text-red-400' :
              log.type === 'success' ? 'text-green-400' :
              log.type === 'running' ? 'text-blue-200' :
              'text-gray-300'
            }>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
