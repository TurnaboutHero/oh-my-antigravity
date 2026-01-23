const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

// --- Configuration ---
const OMA_HOME = path.join(os.homedir(), '.oma');
const SESSIONS_DIR = path.join(OMA_HOME, 'sessions');
const BIN_DIR = path.join(__dirname);
const OMA_BIN = os.platform() === 'win32' ? 'oma.ps1' : 'oma';

// --- Helpers ---
function getTimestamp() { return new Date().toISOString(); }

function updateSession(sessionId, status, logs = [], plan = null) {
    const sessionDir = path.join(SESSIONS_DIR, sessionId);
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });
    
    let data = {
        sessionId,
        agentName: 'sisyphus',
        status: 'initializing',
        startTime: getTimestamp(),
        logs: [],
        plan: null
    };
    
    const metaPath = path.join(sessionDir, 'metadata.json');
    if (fs.existsSync(metaPath)) {
        try { data = JSON.parse(fs.readFileSync(metaPath, 'utf8')); } catch (e) {}
    }

    if (status) data.status = status;
    if (plan) data.plan = plan;
    if (logs && logs.length > 0) {
        data.logs.push(...logs.map(log => `[${getTimestamp()}] ${log}`));
    }
    
    fs.writeFileSync(metaPath, JSON.stringify(data, null, 2));
}

async function runSubagent(agentName, instruction, parentSessionId, isPlanning = false) {
    return new Promise((resolve, reject) => {
        const taskName = isPlanning ? "Thinking (Planning)" : `Delegating to ${agentName}`;
        updateSession(parentSessionId, undefined, [`${taskName}: "${instruction.substring(0, 60)}..."`]);
        console.log(`[Sisyphus] ${taskName}...`);
        
        const psCommand = `& "${path.join(BIN_DIR, 'oma.ps1')}" spawn ${agentName} "${instruction}"`;
        
        let child;
        if (os.platform() === 'win32') {
             child = spawn('powershell', ['-ExecutionPolicy', 'Bypass', '-Command', psCommand], {
                stdio: 'pipe',
                cwd: process.cwd(),
                env: process.env
            });
        } else {
             child = spawn('bash', ['-c', `"${path.join(BIN_DIR, 'oma')}" spawn ${agentName} "${instruction}"`], { stdio: 'pipe' });
        }

        let outputBuffer = "";

        child.stdout.on('data', (data) => {
            const str = data.toString();
            outputBuffer += str;
            if (!isPlanning) {
                console.log(`[${agentName}] ${str.trim()}`);
                if (str.includes("Step Id")) {
                   updateSession(parentSessionId, undefined, [`${agentName} working...`]);
                }
            }
        });

        child.stderr.on('data', (data) => console.error(`[${agentName} ERROR] ${data.toString()}`));

        child.on('close', (code) => {
            if (code === 0) {
                // If planning, we need to find the result file or parse output
                // For simplicity, we'll try to find the session ID from output and read result.md
                // OR since we are inside OMA, we can try to extract the JSON plan from the output if printed?
                // The most reliable way: The spawn command itself should return the content or path.
                // But oma-spawn just prints result to stdout.
                
                // Hack: In our mock, 'generate planning' writes to a file.
                // But oma-spawn handles the session.
                
                // Let's assume for this step, we just read the result from the session created.
                // We neeed to parse the session ID from the output string "[OMA] Session ID: ..."
                const match = outputBuffer.match(/Session ID: ([a-f0-9-]+)/);
                if (match) {
                    const subSessionId = match[1];
                    const resultPath = path.join(SESSIONS_DIR, subSessionId, 'result.md');
                    if (fs.existsSync(resultPath)) {
                        const result = fs.readFileSync(resultPath, 'utf8');
                        resolve({ success: true, output: result });
                        return;
                    }
                }
                resolve({ success: true, output: outputBuffer });
            } else {
                updateSession(parentSessionId, 'error', [`${agentName} failed.`]);
                resolve({ success: false });
            }
        });
    });
}

// --- Main ---
async function main() {
    const objective = process.argv[2];
    if (!objective) process.exit(1);

    const sessionId = uuidv4();
    console.log(`[Sisyphus] Manager Session: ${sessionId}`);
    updateSession(sessionId, 'planning', [`Objective: "${objective}"`]);

    // 1. Planning Phase (Ask Sisyphus yourself)
    console.log("[Sisyphus] Formulating plan...");
    const planPrompt = `Plan for: ${objective}.
    IMPORTANT: Return ONLY a JSON array of steps.
    If tasks can be done IN PARALLEL, group them in a nested array.
    Example: [
      { "agent": "oracle", "instruction": "Research" },
      [ { "agent": "pixel", "instruction": "Design" }, { "agent": "codesmith", "instruction": "Database" } ],
      { "agent": "tester", "instruction": "Verify" }
    ]`;
    const planResult = await runSubagent('sisyphus', planPrompt, sessionId, true);
    
    if (!planResult.success) {
        updateSession(sessionId, 'failed', ["Planning failed."]);
        process.exit(1);
    }

    let plan = [];
    try {
        // Attempt to extract JSON from markdown block if present
        let jsonStr = planResult.output;
        if (jsonStr.includes("```json")) {
            jsonStr = jsonStr.split("```json")[1].split("```")[0];
        } else if (jsonStr.includes("```")) {
             jsonStr = jsonStr.split("```")[1].split("```")[0];
        }
        plan = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse plan JSON:", e);
        // Fallback for demo
         plan = [
            { agent: "oracle", instruction: "Analyze project structure." },
            { agent: "codesmith", instruction: "Implement core improvements." }
        ];
        updateSession(sessionId, 'planning', ["Planning parsing failed, using backup strategy."]);
    }

    updateSession(sessionId, 'executing', [`Plan generated with ${plan.length} steps.`], plan);

    // 2. Execution Phase
    // 2. Execution Phase
    for (const step of plan) {
        if (Array.isArray(step)) {
            // Parallel Execution
            updateSession(sessionId, 'executing', [`Starting parallel group of ${step.length} agents...`]);
            console.log(`[Sisyphus] 🚀 Launching ${step.length} agents in parallel...`);
            
            const promises = step.map(s => runSubagent(s.agent, s.instruction, sessionId));
            const results = await Promise.all(promises);
            
            const failures = results.filter(r => !r.success);
            if (failures.length > 0) {
                 updateSession(sessionId, 'failed', [`${failures.length} parallel agents failed.`]);
                 process.exit(1);
            }
        } else {
            // Sequential Execution
            updateSession(sessionId, 'executing', [`Starting step: ${step.agent} - ${step.instruction}`]);
            const result = await runSubagent(step.agent, step.instruction, sessionId);
            if (!result.success) {
                 updateSession(sessionId, 'failed', [`Step failed: ${step.agent}`]);
                 process.exit(1);
            }
        }
    }

    updateSession(sessionId, 'completed', ["All planned tasks completed."]);
    console.log("[Sisyphus] Mission Complete.");
}

main();
