'use client'

import { useCallback, useState, useMemo } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
  NodeProps,
  BaseEdge,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  Database,
  Globe,
  Cpu,
  Server,
  BarChart3,
  Zap,
  Github,
  ExternalLink,
  ChevronRight,
  MousePointerClick,
  MoreHorizontal,
} from 'lucide-react'

// Chess pieces for random animation
const CHESS_PIECES = ['♟', '♞', '♝', '♜', '♛', '♚', '♙', '♘', '♗', '♖', '♕', '♔']

// ─────────────────────────────────────────────────────────────────────────────
// Node info content for the sidebar
// ─────────────────────────────────────────────────────────────────────────────

type NodeInfo = {
  title: string
  color: 'amber' | 'emerald' | 'teal' | 'sky' | 'violet' | 'rose'
  content: React.ReactNode
}

const workerContent = (
  <>
    <p>
      Games are processed in parallel using Rayon, a Rust library for data parallelism.
      Multiple CPU cores parse PGN files and compute aggregates at the same time.
    </p>
    <p>
      Each game gets grouped by:
    </p>
    <ul className="list-disc list-inside space-y-1 pl-2">
      <li><strong>Month played</strong> (e.g. 2024-01)</li>
      <li><strong>Opening family</strong> (ECO code groups)</li>
      <li><strong>White Elo bucket</strong> (200-point ranges)</li>
      <li><strong>Black Elo bucket</strong> (200-point ranges)</li>
    </ul>
    <p>
      For each combination we store: total games, white wins, black wins, and draws.
    </p>
    <div className="pt-3">
      <a
        href="https://github.com/lichesstrends/aggregator"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-teal-500/10 hover:bg-teal-500/20 transition-colors text-teal-700 dark:text-teal-300"
      >
        <Github className="w-4 h-4" />
        View Aggregator on GitHub
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  </>
)

const nodeInfoMap: Record<string, NodeInfo> = {
  lichess: {
    title: 'Lichess Database',
    color: 'amber',
    content: (
      <>
        <p>
          Lichess publishes monthly dumps of all rated games played on their platform.
          These are big compressed PGN files. Some months have over 100 million games.
        </p>
        <p>
          The game data includes player ratings, moves, timestamps, and results.
        </p>
        <div className="pt-3">
          <a
            href="https://database.lichess.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors text-amber-700 dark:text-amber-300"
          >
            Browse Lichess Database
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </>
    ),
  },
  stream: {
    title: 'HTTP Streaming',
    color: 'emerald',
    content: (
      <>
        <p>
          We stream the compressed dumps directly over HTTP. No need to download giant files first.
        </p>
        <p>
          The data flows through a Zstd decompressor in real-time. This lets us process terabytes
          of data with a small memory footprint. Each game is extracted as it arrives.
        </p>
      </>
    ),
  },
  worker1: {
    title: 'Parallel Workers',
    color: 'teal',
    content: workerContent,
  },
  worker2: {
    title: 'Parallel Workers',
    color: 'teal',
    content: workerContent,
  },
  dots: {
    title: 'Parallel Workers',
    color: 'teal',
    content: workerContent,
  },
  worker3: {
    title: 'Parallel Workers',
    color: 'teal',
    content: workerContent,
  },
  worker4: {
    title: 'Parallel Workers',
    color: 'teal',
    content: workerContent,
  },
  database: {
    title: 'MySQL Database',
    color: 'sky',
    content: (
      <>
        <p>
          The aggregated data is tiny compared to raw dumps. What would be terabytes as PGN
          becomes a small database of statistics.
        </p>
        <p>
          Each row is one unique combination of month, opening, and rating buckets.
          We only store the counts needed for analysis.
        </p>
      </>
    ),
  },
  api: {
    title: 'Next.js API',
    color: 'violet',
    content: (
      <>
        <p>
          The backend exposes REST endpoints that query the database and return JSON.
          Server-side caching keeps responses fast.
        </p>
        <p>
          Endpoints cover monthly game counts, opening popularity, rating heatmaps, and more.
        </p>
        <div className="pt-3">
          <a
            href="/api"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-violet-500/10 hover:bg-violet-500/20 transition-colors text-violet-700 dark:text-violet-300"
          >
            Explore the API
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </>
    ),
  },
  frontend: {
    title: 'React Frontend',
    color: 'rose',
    content: (
      <>
        <p>
          The frontend uses React 19 and Next.js 15. TanStack Query handles data fetching.
          Recharts powers the visualizations.
        </p>
        <p>
          Everything is open source. Contributions welcome!
        </p>
        <div className="pt-3">
          <a
            href="https://github.com/lichesstrends/app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition-colors text-rose-700 dark:text-rose-300"
          >
            <Github className="w-4 h-4" />
            View on GitHub
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </>
    ),
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom node component
// ─────────────────────────────────────────────────────────────────────────────

type PipelineNodeData = {
  label: string
  sublabel?: string
  icon: 'globe' | 'cpu' | 'database' | 'server' | 'chart' | 'zap' | 'dots'
  color: 'amber' | 'emerald' | 'teal' | 'sky' | 'violet' | 'rose'
}

const iconMap = {
  globe: Globe,
  cpu: Cpu,
  database: Database,
  server: Server,
  chart: BarChart3,
  zap: Zap,
  dots: MoreHorizontal,
}

const colorMap = {
  amber: {
    bg: 'bg-amber-500/20 dark:bg-amber-500/30',
    border: 'border-amber-500/50',
    borderSelected: 'border-amber-500',
    icon: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500/50',
  },
  emerald: {
    bg: 'bg-emerald-500/20 dark:bg-emerald-500/30',
    border: 'border-emerald-500/50',
    borderSelected: 'border-emerald-500',
    icon: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-500/50',
  },
  teal: {
    bg: 'bg-teal-500/20 dark:bg-teal-500/30',
    border: 'border-teal-500/50',
    borderSelected: 'border-teal-500',
    icon: 'text-teal-600 dark:text-teal-400',
    ring: 'ring-teal-500/50',
  },
  sky: {
    bg: 'bg-sky-500/20 dark:bg-sky-500/30',
    border: 'border-sky-500/50',
    borderSelected: 'border-sky-500',
    icon: 'text-sky-600 dark:text-sky-400',
    ring: 'ring-sky-500/50',
  },
  violet: {
    bg: 'bg-violet-500/20 dark:bg-violet-500/30',
    border: 'border-violet-500/50',
    borderSelected: 'border-violet-500',
    icon: 'text-violet-600 dark:text-violet-400',
    ring: 'ring-violet-500/50',
  },
  rose: {
    bg: 'bg-rose-500/20 dark:bg-rose-500/30',
    border: 'border-rose-500/50',
    borderSelected: 'border-rose-500',
    icon: 'text-rose-600 dark:text-rose-400',
    ring: 'ring-rose-500/50',
  },
}

function PipelineNode({ data, selected }: NodeProps<Node<PipelineNodeData>>) {
  const Icon = iconMap[data.icon]
  const colors = colorMap[data.color]

  return (
    <div
      className={`
        relative px-5 py-4 rounded-xl border-2 backdrop-blur-sm
        transition-all duration-200 cursor-pointer
        ${colors.bg} ${selected ? colors.borderSelected : colors.border}
        ${selected ? `ring-4 ${colors.ring} scale-105` : 'hover:scale-105'}
      `}
    >
      <Handle type="target" position={Position.Left} className="!bg-slate-400 !w-2 !h-2 !opacity-0" />
      <Handle type="source" position={Position.Right} className="!bg-slate-400 !w-2 !h-2 !opacity-0" />

      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        <div>
          <div className="font-semibold text-base text-slate-800 dark:text-slate-100 whitespace-nowrap">
            {data.label}
          </div>
          {data.sublabel && (
            <div className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {data.sublabel}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated edge with floating chess pieces (random pieces)
// ─────────────────────────────────────────────────────────────────────────────

function AnimatedChessEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const showPiece = data?.showPiece as boolean
  const animationDuration = (data?.speed as number) || 2

  // Pick a random chess piece on each render cycle
  const piece = useMemo(() => CHESS_PIECES[Math.floor(Math.random() * CHESS_PIECES.length)], [])

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} />
      {showPiece && (
        <g>
          <text
            className="text-lg pointer-events-none select-none"
            fill="currentColor"
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
          >
            <textPath href={`#${id}`} startOffset="0%">
              <animate
                attributeName="startOffset"
                from="0%"
                to="100%"
                dur={`${animationDuration}s`}
                repeatCount="indefinite"
              />
              {piece}
            </textPath>
          </text>
        </g>
      )}
      <path id={id} d={edgePath} fill="none" stroke="none" />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Info Panel Component
// ─────────────────────────────────────────────────────────────────────────────

const infoPanelTitleColors = {
  amber: 'text-amber-700 dark:text-amber-300',
  emerald: 'text-emerald-700 dark:text-emerald-300',
  teal: 'text-teal-700 dark:text-teal-300',
  sky: 'text-sky-700 dark:text-sky-300',
  violet: 'text-violet-700 dark:text-violet-300',
  rose: 'text-rose-700 dark:text-rose-300',
}

function InfoPanel({ nodeId }: { nodeId: string | null }) {
  const info = nodeId ? nodeInfoMap[nodeId] : null

  if (!info) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center">
        <div className="text-slate-400 dark:text-slate-500">
          <MousePointerClick className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-base font-medium mb-1">Click on any node</p>
          <p className="text-sm opacity-75">to learn more about each step</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full p-6">
      <h3 className={`text-xl font-semibold mb-4 ${infoPanelTitleColors[info.color]}`}>
        {info.title}
      </h3>
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {info.content}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Pipeline component
// ─────────────────────────────────────────────────────────────────────────────

const initialNodes: Node<PipelineNodeData>[] = [
  // Source
  {
    id: 'lichess',
    type: 'pipeline',
    position: { x: 0, y: 250 },
    data: {
      label: 'Lichess Database',
      sublabel: 'Monthly PGN dumps',
      icon: 'globe',
      color: 'amber',
    },
  },
  // Streaming
  {
    id: 'stream',
    type: 'pipeline',
    position: { x: 320, y: 250 },
    data: {
      label: 'HTTP Stream',
      sublabel: 'Zstd decompression',
      icon: 'zap',
      color: 'emerald',
    },
  },
  // Parallel workers (5 nodes: 2 workers, dots, 2 workers)
  {
    id: 'worker1',
    type: 'pipeline',
    position: { x: 620, y: 40 },
    data: {
      label: 'Worker 1',
      sublabel: 'Batch processing',
      icon: 'cpu',
      color: 'teal',
    },
  },
  {
    id: 'worker2',
    type: 'pipeline',
    position: { x: 620, y: 150 },
    data: {
      label: 'Worker 2',
      sublabel: 'Batch processing',
      icon: 'cpu',
      color: 'teal',
    },
  },
  {
    id: 'dots',
    type: 'pipeline',
    position: { x: 620, y: 260 },
    data: {
      label: '...',
      sublabel: 'Many more',
      icon: 'dots',
      color: 'teal',
    },
  },
  {
    id: 'worker3',
    type: 'pipeline',
    position: { x: 620, y: 370 },
    data: {
      label: 'Worker N-1',
      sublabel: 'Batch processing',
      icon: 'cpu',
      color: 'teal',
    },
  },
  {
    id: 'worker4',
    type: 'pipeline',
    position: { x: 620, y: 480 },
    data: {
      label: 'Worker N',
      sublabel: 'Batch processing',
      icon: 'cpu',
      color: 'teal',
    },
  },
  // Database
  {
    id: 'database',
    type: 'pipeline',
    position: { x: 920, y: 250 },
    data: {
      label: 'MySQL Database',
      sublabel: 'Aggregated stats',
      icon: 'database',
      color: 'sky',
    },
  },
  // API
  {
    id: 'api',
    type: 'pipeline',
    position: { x: 1220, y: 250 },
    data: {
      label: 'Next.js API',
      sublabel: 'REST endpoints',
      icon: 'server',
      color: 'violet',
    },
  },
  // Frontend
  {
    id: 'frontend',
    type: 'pipeline',
    position: { x: 1500, y: 250 },
    data: {
      label: 'React Frontend',
      sublabel: 'Interactive charts',
      icon: 'chart',
      color: 'rose',
    },
  },
]

const initialEdges: Edge[] = [
  // Lichess to Stream (with chess pieces)
  {
    id: 'e-lichess-stream',
    source: 'lichess',
    target: 'stream',
    type: 'animatedChess',
    style: { stroke: '#f59e0b', strokeWidth: 3 },
    data: { showPiece: true, speed: 1.5 },
  },
  // Stream to all workers
  {
    id: 'e-stream-w1',
    source: 'stream',
    target: 'worker1',
    type: 'animatedChess',
    animated: true,
    style: { stroke: '#14b8a6', strokeWidth: 2 },
    data: { showPiece: false },
  },
  {
    id: 'e-stream-w2',
    source: 'stream',
    target: 'worker2',
    type: 'animatedChess',
    animated: true,
    style: { stroke: '#14b8a6', strokeWidth: 2 },
    data: { showPiece: false },
  },
  {
    id: 'e-stream-dots',
    source: 'stream',
    target: 'dots',
    type: 'animatedChess',
    animated: true,
    style: { stroke: '#14b8a6', strokeWidth: 2 },
    data: { showPiece: false },
  },
  {
    id: 'e-stream-w3',
    source: 'stream',
    target: 'worker3',
    type: 'animatedChess',
    animated: true,
    style: { stroke: '#14b8a6', strokeWidth: 2 },
    data: { showPiece: false },
  },
  {
    id: 'e-stream-w4',
    source: 'stream',
    target: 'worker4',
    type: 'animatedChess',
    animated: true,
    style: { stroke: '#14b8a6', strokeWidth: 2 },
    data: { showPiece: false },
  },
  // Workers to Database
  {
    id: 'e-w1-db',
    source: 'worker1',
    target: 'database',
    type: 'animatedChess',
    animated: true,
    style: { stroke: '#14b8a6', strokeWidth: 2 },
    data: { showPiece: false },
  },
  {
    id: 'e-w2-db',
    source: 'worker2',
    target: 'database',
    type: 'animatedChess',
    animated: true,
    style: { stroke: '#14b8a6', strokeWidth: 2 },
    data: { showPiece: false },
  },
  {
    id: 'e-dots-db',
    source: 'dots',
    target: 'database',
    type: 'animatedChess',
    animated: true,
    style: { stroke: '#14b8a6', strokeWidth: 2 },
    data: { showPiece: false },
  },
  {
    id: 'e-w3-db',
    source: 'worker3',
    target: 'database',
    type: 'animatedChess',
    animated: true,
    style: { stroke: '#14b8a6', strokeWidth: 2 },
    data: { showPiece: false },
  },
  {
    id: 'e-w4-db',
    source: 'worker4',
    target: 'database',
    type: 'animatedChess',
    animated: true,
    style: { stroke: '#14b8a6', strokeWidth: 2 },
    data: { showPiece: false },
  },
  // Database to API
  {
    id: 'e-db-api',
    source: 'database',
    target: 'api',
    type: 'animatedChess',
    animated: true,
    style: { stroke: '#0ea5e9', strokeWidth: 3 },
    data: { showPiece: false },
  },
  // API to Frontend
  {
    id: 'e-api-frontend',
    source: 'api',
    target: 'frontend',
    type: 'animatedChess',
    animated: true,
    style: { stroke: '#8b5cf6', strokeWidth: 3 },
    data: { showPiece: false },
  },
]

const nodeTypes = { pipeline: PipelineNode }
const edgeTypes = { animatedChess: AnimatedChessEdge }

export function Pipeline() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  return (
    <div className="flex flex-col xl:flex-row w-full h-full min-h-[600px] gap-6 p-6">
      {/* Flowchart - takes full width, centered */}
      <div className="flex-1 h-[500px] xl:h-full flex items-center justify-center">
        <ReactFlow
          nodes={nodes.map((n) => ({ ...n, selected: n.id === selectedNode }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.15, minZoom: 0.5, maxZoom: 1.5 }}
          proOptions={{ hideAttribution: true }}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
        >
        </ReactFlow>
      </div>

      {/* Info panel - fixed width card on right */}
      <div className="w-full xl:w-96 min-h-[300px] xl:min-h-0 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg">
        <InfoPanel nodeId={selectedNode} />
      </div>
    </div>
  )
}
