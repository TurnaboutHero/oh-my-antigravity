import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Define the root of OMA relative to the dashboard directory
// Dashboard is in /dashboard, OMA root is one level up
const OMA_ROOT = path.resolve(process.cwd(), '..')
const SESSIONS_DIR = path.join(OMA_ROOT, '.oma', 'sessions')

export async function GET() {
  try {
    if (!fs.existsSync(SESSIONS_DIR)) {
      return NextResponse.json({ active_agents: [], logs: [] })
    }

    const sessions = fs.readdirSync(SESSIONS_DIR).filter(file => {
      return fs.statSync(path.join(SESSIONS_DIR, file)).isDirectory()
    })

    const activeAgents: string[] = []
    const logs: any[] = []

    // Read latest 5 sessions
    const recentSessions = sessions
      .map(id => ({ id, path: path.join(SESSIONS_DIR, id) }))
      .sort((a, b) => {
        const statA = fs.statSync(a.path)
        const statB = fs.statSync(b.path)
        return statB.birthtime.getTime() - statA.birthtime.getTime()
      })
      .slice(0, 5)

    for (const session of recentSessions) {
      const metadataPath = path.join(session.path, 'metadata.json')
      
      if (fs.existsSync(metadataPath)) {
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
          
          if (metadata.status === 'running' || metadata.status === 'running_async') {
            activeAgents.push(metadata.subagent)
          }

          logs.push({
            id: session.id,
            timestamp: metadata.started_at,
            message: `[${metadata.subagent.toUpperCase()}] ${metadata.task.substring(0, 50)}...`,
            status: metadata.status
          })
          
          if (metadata.status === 'completed') {
             logs.push({
                id: session.id + '_end',
                timestamp: metadata.completed_at || new Date().toISOString(),
                message: `[${metadata.subagent.toUpperCase()}] Task Completed`,
                status: 'success'
             })
          }
           if (metadata.status === 'failed') {
             logs.push({
                id: session.id + '_err',
                timestamp: metadata.failed_at || new Date().toISOString(),
                message: `[${metadata.subagent.toUpperCase()}] Failed: ${metadata.error}`,
                status: 'error'
             })
          }

        } catch (e) {
          console.error(`Error parsing metadata for session ${session.id}`, e)
        }
      }
    }

    // Sort logs by time
    logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    return NextResponse.json({
      active_agents: Array.from(new Set(activeAgents)), // unique
      logs: logs
    })

  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 })
  }
}
