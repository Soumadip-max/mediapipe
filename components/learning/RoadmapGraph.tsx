"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    Handle,
    Position,
    NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Video, ExternalLink, X, BookOpen, Layers, Terminal, Sparkles, AlertTriangle, CheckCircle2, Clock, FastForward } from "lucide-react";

// ==========================================
// TYPES & INTERFACES
// ==========================================
export interface RoadmapNodeData extends Record<string, unknown> {
    label: string;
    phase?: string;
    description?: string;
    type?: "main" | "subtopic" | "choice";
    keyConcepts?: string;
    notes?: string;
    youtubeQuery?: string;
    youtubeSearchQuery?: string;
    status?: "learning" | "done" | "skip";
}

const PRESET_DOMAINS = [
    "Full-Stack Web Engineering",
    "Backend & Microservices Architecture",
    "Frontend & UI Performance",
    "Data Structures & Algorithms",
    "System Design & Cloud Infrastructure",
];

// Custom Roadmap.sh Styled Node Component
function CustomRoadmapNode({ data, selected }: NodeProps) {
    const nodeData = data as unknown as RoadmapNodeData;
    const isMain = nodeData.type === "main";
    const status = nodeData.status || "learning";

    const statusBg =
        status === "done"
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
            : status === "skip"
            ? "bg-slate-700/40 text-slate-400 border-slate-600/30"
            : "bg-[#c3f400]/20 text-[#c3f400] border-[#c3f400]/40";

    return (
        <div
            className={`px-5 py-3.5 rounded-2xl transition-all cursor-pointer shadow-xl border text-left min-w-[240px] max-w-[280px] ${
                isMain
                    ? "bg-[#c3f400] text-[#283500] border-[#9fc700] shadow-[0_0_25px_rgba(195,244,0,0.35)] font-black"
                    : "bg-[#191b22] text-slate-100 border-white/10 hover:border-[#c3f400]/50 font-bold hover:bg-[#21232d]"
            } ${selected ? "ring-2 ring-[#c3f400] ring-offset-2 ring-offset-[#0c0e14] scale-105" : ""}`}
        >
            <Handle type="target" position={Position.Top} className="!bg-[#c3f400] !w-3.5 !h-3.5 !border-2 !border-[#0c0e14]" />
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                    <span
                        className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-extrabold tracking-wider ${
                            isMain
                                ? "bg-[#283500] text-[#c3f400]"
                                : "bg-[#282a30] text-[#c0c1ff]"
                        }`}
                    >
                        {nodeData.phase ? nodeData.phase.split(":")[0] : (nodeData.type || "Phase")}
                    </span>
                    <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold border ${statusBg}`}>
                        {status}
                    </span>
                </div>
                <span className="text-xs font-extrabold tracking-tight line-clamp-2 leading-snug">{nodeData.label}</span>
            </div>
            <Handle type="source" position={Position.Bottom} className="!bg-[#c3f400] !w-3.5 !h-3.5 !border-2 !border-[#0c0e14]" />
        </div>
    );
}

// Deep 7-Phase Initial Nodes Layout
const INITIAL_NODES: Node<RoadmapNodeData>[] = [
    // Phase 1 (Y: 0 to 180)
    {
        id: "1",
        position: { x: 0, y: 0 },
        data: {
            label: "Language Runtimes & Memory Models",
            phase: "Phase 1: Core Primitives",
            type: "main",
            description: "Master V8 event loop execution, stack/heap memory allocation, and async primitives.",
            keyConcepts: "Event Loop, Call Stack, Garbage Collection, Non-blocking I/O",
            notes: "Prevent thread-blocking synchronous operations and analyze memory leaks.",
            youtubeQuery: "Language runtimes memory model event loop tutorial",
            status: "done",
        },
        type: "roadmapNode",
    },
    {
        id: "2",
        position: { x: -280, y: 130 },
        data: {
            label: "Type Systems & Compiler Pipelines",
            phase: "Phase 1: Core Primitives",
            type: "subtopic",
            description: "Deep dive into static type inference, AST parsing, and build target compilation.",
            keyConcepts: "TypeScript Compiler, AST, Generics, Type Narrowing",
            notes: "Strict compiler flags prevent runtime uncaught exceptions.",
            youtubeQuery: "TypeScript compiler AST type inference deep dive",
            status: "done",
        },
        type: "roadmapNode",
    },
    {
        id: "3",
        position: { x: 280, y: 130 },
        data: {
            label: "Async Concurrency & Threads",
            phase: "Phase 1: Core Primitives",
            type: "subtopic",
            description: "Master Promises, Web Workers, Atomics, and thread synchronization.",
            keyConcepts: "Web Workers, SharedArrayBuffer, Atomics, Mutex",
            notes: "Offload compute-intensive vision loops to background worker threads.",
            youtubeQuery: "Web Workers SharedArrayBuffer JavaScript concurrency",
            status: "learning",
        },
        type: "roadmapNode",
    },

    // Phase 2 (Y: 320 to 500)
    {
        id: "4",
        position: { x: 0, y: 320 },
        data: {
            label: "System Data Structures & Algorithms",
            phase: "Phase 2: System Architecture",
            type: "main",
            description: "B-Trees, Trie structures, Bloom filters, and graph traversal optimization.",
            keyConcepts: "B-Trees, Bloom Filters, Consistent Hashing, Dijkstra",
            notes: "Select data structures according to time/space complexity trade-offs.",
            youtubeQuery: "Data structures bloom filters consistent hashing tutorial",
            status: "learning",
        },
        type: "roadmapNode",
    },
    {
        id: "5",
        position: { x: -280, y: 450 },
        data: {
            label: "Protocol Standards (HTTP/3, gRPC, WSS)",
            phase: "Phase 2: System Architecture",
            type: "subtopic",
            description: "HTTP/2 multiplexing, QUIC protocol, gRPC ProtoBuf serialization, and WebSocket state.",
            keyConcepts: "HTTP/3 QUIC, gRPC, Protocol Buffers, WebSocket Backpressure",
            notes: "Protocol Buffers reduce payload size by up to 80% compared to JSON.",
            youtubeQuery: "gRPC HTTP3 QUIC WebSockets protocol comparison",
            status: "learning",
        },
        type: "roadmapNode",
    },
    {
        id: "6",
        position: { x: 280, y: 450 },
        data: {
            label: "Distributed Systems & Consensus",
            phase: "Phase 2: System Architecture",
            type: "subtopic",
            description: "CAP theorem tradeoffs, Raft consensus algorithm, and event-driven sagas.",
            keyConcepts: "CAP Theorem, Raft Consensus, Event Sourcing, Saga Pattern",
            notes: "Balance linearizability vs availability in distributed state machines.",
            youtubeQuery: "Distributed systems Raft consensus CAP theorem tutorial",
            status: "learning",
        },
        type: "roadmapNode",
    },

    // Phase 3 (Y: 640 to 820)
    {
        id: "7",
        position: { x: 0, y: 640 },
        data: {
            label: "Framework Primaries & SSR Rendering",
            phase: "Phase 3: Framework Primaries",
            type: "main",
            description: "Next.js App Router, React 19 Server Components, Suspense, and Hydration boundaries.",
            keyConcepts: "Server Components, Partial Prerendering, Suspense, Hydration",
            notes: "Eliminate client hydration waterfalls with zero-bundle-size server components.",
            youtubeQuery: "Next.js App Router React 19 architecture tutorial",
            status: "learning",
        },
        type: "roadmapNode",
    },
    {
        id: "8",
        position: { x: -280, y: 770 },
        data: {
            label: "Atomic State & Client Cache",
            phase: "Phase 3: Framework Primaries",
            type: "subtopic",
            description: "Zustand state selectors, TanStack Query cache invalidation, and optimistic UI.",
            keyConcepts: "Zustand, TanStack Query, Mutation Optimistic Updates",
            notes: "Prevent re-render loops using granular state selectors.",
            youtubeQuery: "Zustand TanStack Query state orchestration tutorial",
            status: "learning",
        },
        type: "roadmapNode",
    },

    // Phase 4 (Y: 960 to 1140)
    {
        id: "9",
        position: { x: 0, y: 960 },
        data: {
            label: "Database Indexing & Query Tuning",
            phase: "Phase 4: Database Systems",
            type: "main",
            description: "Postgres B-Tree & GIN indexes, EXPLAIN ANALYZE execution plans, and N+1 query elimination.",
            keyConcepts: "B-Tree Indexing, GIN, EXPLAIN ANALYZE, Connection Pooling",
            notes: "Index foreign keys and composite filter queries for sub-10ms response times.",
            youtubeQuery: "PostgreSQL index query optimization EXPLAIN ANALYZE",
            status: "learning",
        },
        type: "roadmapNode",
    },
    {
        id: "10",
        position: { x: 280, y: 1090 },
        data: {
            label: "Redis Cluster & Storage Topologies",
            phase: "Phase 4: Database Systems",
            type: "subtopic",
            description: "Redis cluster sharding, cache stampede prevention (Singleflight), and Read-Through caching.",
            keyConcepts: "Redis Cluster, Cache Stampede, Singleflight, LRU Eviction",
            notes: "Implement distributed locks and rate limiters over Redis memory instances.",
            youtubeQuery: "Redis cluster caching strategies tutorial",
            status: "learning",
        },
        type: "roadmapNode",
    },

    // Phase 5 (Y: 1280 to 1460)
    {
        id: "11",
        position: { x: 0, y: 1280 },
        data: {
            label: "Security Protocols & API Gateways",
            phase: "Phase 5: Security Protocols",
            type: "main",
            description: "OAuth 2.0 PKCE, JWT RS256 signing, mTLS, and Rate-Limiting Gateways.",
            keyConcepts: "OAuth2 PKCE, JWT RS256, mTLS, Sliding Window Rate Limiting",
            notes: "Enforce zero-trust network policies and token revocation blacklists.",
            youtubeQuery: "OAuth2 JWT security API gateway architecture tutorial",
            status: "learning",
        },
        type: "roadmapNode",
    },

    // Phase 6 (Y: 1600 to 1780)
    {
        id: "12",
        position: { x: -280, y: 1600 },
        data: {
            label: "Automated E2E Testing & Chaos Engineering",
            phase: "Phase 6: Testing Paradigms",
            type: "subtopic",
            description: "Playwright E2E suites, MSW network mocking, and chaos latency injection.",
            keyConcepts: "Playwright, MSW, Chaos Engineering, Code Coverage",
            notes: "Run parallel headless browser runs on pull requests.",
            youtubeQuery: "Playwright E2E testing MSW API mocking tutorial",
            status: "learning",
        },
        type: "roadmapNode",
    },
    {
        id: "13",
        position: { x: 280, y: 1600 },
        data: {
            label: "CI/CD Automation & Build Pipelines",
            phase: "Phase 6: Testing Paradigms",
            type: "subtopic",
            description: "GitHub Actions matrix builds, Docker layer caching, and semantic release versioning.",
            keyConcepts: "GitHub Actions, Docker BuildKit, Semantic Release, Helm Charts",
            notes: "Optimize Docker multi-stage builds for zero-downtime deployment.",
            youtubeQuery: "GitHub Actions Docker CI CD pipeline optimization",
            status: "learning",
        },
        type: "roadmapNode",
    },

    // Phase 7 (Y: 1920 to 2100)
    {
        id: "14",
        position: { x: 0, y: 1920 },
        data: {
            label: "Kubernetes & Telemetry Observability",
            phase: "Phase 7: Cloud Infrastructure",
            type: "main",
            description: "K8s Ingress controllers, OpenTelemetry distributed tracing, Jaeger, and Prometheus metrics.",
            keyConcepts: "Kubernetes, OpenTelemetry, Jaeger, Prometheus, p99 Latency Alerts",
            notes: "Trace request lifecycles across microservice boundaries via OpenTelemetry context propagation.",
            youtubeQuery: "Kubernetes OpenTelemetry Jaeger Prometheus observability tutorial",
            status: "learning",
        },
        type: "roadmapNode",
    },
];

const INITIAL_EDGES: Edge[] = [
    // Phase 1 -> Phase 2
    { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#c3f400", strokeWidth: 2 } },
    { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: "#c3f400", strokeWidth: 2 } },
    { id: "e1-4", source: "1", target: "4", animated: true, style: { stroke: "#c3f400", strokeWidth: 2 } },
    { id: "e2-5", source: "2", target: "5", animated: true, style: { stroke: "#c0c1ff", strokeWidth: 2 } },
    { id: "e3-6", source: "3", target: "6", animated: true, style: { stroke: "#c0c1ff", strokeWidth: 2 } },

    // Phase 2 -> Phase 3
    { id: "e4-7", source: "4", target: "7", animated: true, style: { stroke: "#c3f400", strokeWidth: 2 } },
    { id: "e5-8", source: "5", target: "8", animated: true, style: { stroke: "#c0c1ff", strokeWidth: 2 } },

    // Phase 3 -> Phase 4
    { id: "e7-9", source: "7", target: "9", animated: true, style: { stroke: "#c3f400", strokeWidth: 2 } },
    { id: "e8-10", source: "8", target: "10", animated: true, style: { stroke: "#c0c1ff", strokeWidth: 2 } },

    // Phase 4 -> Phase 5
    { id: "e9-11", source: "9", target: "11", animated: true, style: { stroke: "#c3f400", strokeWidth: 2 } },

    // Phase 5 -> Phase 6
    { id: "e11-12", source: "11", target: "12", animated: true, style: { stroke: "#c0c1ff", strokeWidth: 2 } },
    { id: "e11-13", source: "11", target: "13", animated: true, style: { stroke: "#c0c1ff", strokeWidth: 2 } },

    // Phase 6 -> Phase 7
    { id: "e12-14", source: "12", target: "14", animated: true, style: { stroke: "#c3f400", strokeWidth: 2 } },
    { id: "e13-14", source: "13", target: "14", animated: true, style: { stroke: "#c3f400", strokeWidth: 2 } },
];

interface RoadmapGraphProps {
    onOpenDoubtSolver?: () => void;
}

export default function RoadmapGraph({ onOpenDoubtSolver }: RoadmapGraphProps) {
    const [targetRole, setTargetRole] = useState("");
    const [activePreset, setActivePreset] = useState("");
    const [level, setLevel] = useState("mid");
    const [isGenerating, setIsGenerating] = useState(false);
    const [roadmapTitle, setRoadmapTitle] = useState("Full-Stack Web Engineering Roadmap");
    const [roadmapOverview, setRoadmapOverview] = useState("Comprehensive 7-phase node graph roadmap spanning core language runtimes to production cloud observability.");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const nodeTypes = useMemo(() => ({ roadmapNode: CustomRoadmapNode }), []);

    const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES as Node[]);
    const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    }, []);

    const toggleNodeStatus = (nodeId: string, currentStatus?: string) => {
        const nextStatus = currentStatus === "done" ? "learning" : currentStatus === "learning" ? "skip" : "done";
        setNodes((prevNodes) =>
            prevNodes.map((n) => {
                if (n.id === nodeId) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            status: nextStatus,
                        },
                    };
                }
                return n;
            })
        );
        if (selectedNode && selectedNode.id === nodeId) {
            setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, status: nextStatus } } : null);
        }
    };

    const generateRoadmap = async (role: string, expLevel: string) => {
        if (!role.trim()) return;
        setIsGenerating(true);
        setErrorMsg(null);
        setRoadmapTitle(`${role} Roadmap`);
        setRoadmapOverview(`Generating customized pathway for ${role} (${expLevel} level)...`);

        try {
            const res = await fetch("/api/roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ domain: role, experienceLevel: expLevel }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Failed to generate AI roadmap (HTTP ${res.status})`);
            }

            const data = await res.json();

            if (data.nodes && Array.isArray(data.nodes) && data.nodes.length > 0) {
                const formattedNodes: Node[] = data.nodes.map((n: any, idx: number) => {
                    const defaultY = Math.floor(idx / 2) * 220;
                    const defaultX = (idx % 2 === 0 ? -180 : 180);

                    const posX = (n.position && typeof n.position.x === "number") ? n.position.x : defaultX;
                    const posY = (n.position && typeof n.position.y === "number") ? n.position.y : defaultY;

                    return {
                        id: n.id || `node-${idx + 1}`,
                        position: { x: posX, y: posY },
                        data: {
                            label: n.label || "Technical Competency",
                            phase: n.phase || `Phase ${Math.floor(idx / 3) + 1}`,
                            type: n.type || (idx % 3 === 0 ? "main" : "subtopic"),
                            description: n.description || "Master key architecture primitives and production patterns.",
                            keyConcepts: n.keyConcepts || "Core Primitives & Best Practices",
                            notes: n.notes || "Apply production design patterns and benchmark throughput.",
                            youtubeQuery: n.youtubeQuery || n.youtubeSearchQuery || `${n.label || role} tutorial`,
                            youtubeSearchQuery: n.youtubeQuery || n.youtubeSearchQuery || `${n.label || role} tutorial`,
                            status: n.status || "learning",
                        },
                        type: "roadmapNode",
                    };
                });

                const formattedEdges: Edge[] = (data.edges && Array.isArray(data.edges) && data.edges.length > 0)
                    ? data.edges.map((e: any, i: number) => ({
                          id: e.id || `e${e.source}-${e.target}-${i}`,
                          source: String(e.source),
                          target: String(e.target),
                          animated: true,
                          style: { stroke: "#c3f400", strokeWidth: 2 },
                      }))
                    : formattedNodes.slice(0, -1).map((n, i) => ({
                          id: `e${n.id}-${formattedNodes[i + 1].id}`,
                          source: n.id,
                          target: formattedNodes[i + 1].id,
                          animated: true,
                          style: { stroke: "#c3f400", strokeWidth: 2 },
                      }));

                setNodes(formattedNodes);
                setEdges(formattedEdges);
                if (data.roleTitle) setRoadmapTitle(data.roleTitle);
                if (data.overview) setRoadmapOverview(data.overview);
            } else {
                throw new Error("Roadmap API returned an empty or invalid node structure.");
            }
        } catch (err: any) {
            console.error("API roadmap generation error:", err);
            setErrorMsg(err?.message || "Unable to connect to AI roadmap service. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePresetClick = (preset: string) => {
        setActivePreset(preset);
        setTargetRole(preset);
        generateRoadmap(preset, level);
    };

    const handleGenerate = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!targetRole.trim()) return;
        generateRoadmap(targetRole.trim(), level);
    };

    return (
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 text-[#e2e2eb] font-sans">
            
            {/* Top Generator Control Card */}
            <section className="relative w-full rounded-3xl bg-gradient-to-br from-[#1e1f26] via-[#191b22] to-[#0c0e14] p-6 lg:p-8 shadow-2xl overflow-hidden border border-white/10">
                <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-[#c3f400]/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex flex-col gap-2 max-w-3xl">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-[#c3f400]/20 text-[#c3f400] text-xs font-black uppercase tracking-wider border border-[#c3f400]/40">
                                7-Phase Multi-Level Node Graph
                            </span>
                            <span className="text-xs text-slate-400 font-mono">roadmap.sh Engine</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                            Personalized Engineering Node Graph
                        </h1>
                        <p className="text-sm text-[#c4c9ac] leading-relaxed">
                            Generate deep multi-level interactive roadmaps spanning 7 explicit sequential progression phases complete with pan/zoom canvas, trade-offs analysis, and curated YouTube video links.
                        </p>
                    </div>

                    {/* Error Toast */}
                    {errorMsg && (
                        <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium animate-fadeIn">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-rose-400" />
                                <span>{errorMsg}</span>
                            </div>
                            <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Form Controls */}
                    <form onSubmit={handleGenerate} className="flex flex-col md:flex-row items-stretch gap-3">
                        <div className="relative flex-1">
                            <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c4c9ac] w-5 h-5" />
                            <input
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="e.g. Frontend Architecture, Systems Engineer, Java Specialist..."
                                disabled={isGenerating}
                                className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#0c0e14] text-white font-medium placeholder:text-[#c4c9ac]/50 focus:outline-none focus:ring-2 focus:ring-[#c3f400] transition-all text-sm disabled:opacity-60"
                            />
                        </div>
                        <div className="relative min-w-[210px]">
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                disabled={isGenerating}
                                className="w-full h-12 pl-4 pr-10 rounded-xl bg-[#0c0e14] text-white font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#c3f400] cursor-pointer transition-all text-sm border-0 disabled:opacity-60"
                            >
                                <option value="entry">Entry-Level (0-2 yrs)</option>
                                <option value="mid">Mid-Level (2-5 yrs)</option>
                                <option value="senior">Senior Engineer (5+ yrs)</option>
                                <option value="lead">Staff / Principal Architect</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={isGenerating}
                            className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#abd600] to-[#c3f400] text-[#283500] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_24px_-4px_rgba(195,244,0,0.35)] hover:brightness-110 transition-all cursor-pointer disabled:opacity-75"
                        >
                            <Sparkles className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                            <span>{isGenerating ? "Synthesizing 7-Phase Graph..." : "Generate Deep Roadmap"}</span>
                        </button>
                    </form>

                    {/* Presets Row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-[#c4c9ac] uppercase tracking-wider font-bold text-[11px] mr-1">Presets:</span>
                        {PRESET_DOMAINS.map((preset) => (
                            <button
                                key={preset}
                                onClick={() => handlePresetClick(preset)}
                                disabled={isGenerating}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                                    activePreset === preset
                                        ? "bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/40 font-bold"
                                        : "bg-[#282a30]/60 text-[#c4c9ac] hover:text-white hover:bg-[#282a30]"
                                }`}
                            >
                                {preset}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Graph Header Banner */}
            <section className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#282a30] flex items-center justify-center text-[#c3f400]">
                        <Layers className="w-4 h-4" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">{roadmapTitle}</h2>
                </div>
                <p className="text-xs text-[#c4c9ac] pl-11">{roadmapOverview}</p>
            </section>

            {/* REACTFLOW INTERACTIVE CANVAS CONTAINER */}
            <section className="relative w-full h-[750px] rounded-3xl bg-[#0c0e14] border border-white/10 overflow-hidden shadow-2xl">
                {isGenerating && (
                    <div className="absolute inset-0 z-30 bg-[#0c0e14]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                        <Sparkles className="w-8 h-8 text-[#c3f400] animate-spin" />
                        <span className="text-sm font-bold text-white">Generating customized pathway for {targetRole || "selected domain"}...</span>
                    </div>
                )}

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    fitView
                    attributionPosition="bottom-right"
                    className="bg-[#0c0e14]"
                >
                    <Background color="#33343b" gap={28} size={1} />
                    <Controls className="!bg-[#191b22] !border-white/10 !text-white" />
                    <MiniMap
                        nodeColor={(n) => (n.data?.type === "main" ? "#c3f400" : "#1e1f26")}
                        maskColor="rgba(12, 14, 20, 0.7)"
                        className="!bg-[#191b22] !border-white/10 rounded-xl"
                    />
                </ReactFlow>
            </section>

            {/* NODE INSPECTOR SIDE DRAWER */}
            {selectedNode && (() => {
                const nodeData = selectedNode.data as unknown as RoadmapNodeData;
                const youtubeQuery = (nodeData.youtubeQuery || nodeData.youtubeSearchQuery || nodeData.label) as string;

                return (
                    <div className="fixed inset-0 z-50 bg-[#0c0e14]/80 backdrop-blur-sm flex items-center justify-end p-4 lg:p-6 animate-fadeIn">
                        <div className="w-full max-w-xl bg-[#191b22] border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col gap-6 text-white max-h-[90vh] overflow-y-auto custom-scrollbar relative">
                            <button
                                onClick={() => setSelectedNode(null)}
                                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#282a30] text-[#c4c9ac] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col gap-2 border-b border-white/10 pb-4">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 rounded-full bg-[#c3f400]/20 text-[#c3f400] text-[10px] font-black uppercase tracking-wider w-fit border border-[#c3f400]/30">
                                        {(nodeData.phase as string) || "Phase Topic"}
                                    </span>
                                    <button
                                        onClick={() => toggleNodeStatus(selectedNode.id, nodeData.status)}
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                                            nodeData.status === "done"
                                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                                                : nodeData.status === "skip"
                                                ? "bg-slate-700/40 text-slate-400 border-slate-600/40 hover:bg-slate-700/60"
                                                : "bg-[#c3f400]/20 text-[#c3f400] border-[#c3f400]/40 hover:bg-[#c3f400]/30"
                                        }`}
                                    >
                                        Status: {nodeData.status || "learning"} (click to toggle)
                                    </button>
                                </div>
                                <h3 className="text-2xl font-extrabold text-white pr-10">{(nodeData.label as string)}</h3>
                            </div>

                            <div className="flex flex-col gap-4 text-xs">
                                <div className="flex flex-col gap-1.5">
                                    <span className="font-bold text-[#c4c9ac] uppercase tracking-wider text-[10px]">Overview</span>
                                    <p className="text-slate-200 text-sm leading-relaxed">{(nodeData.description as string)}</p>
                                </div>

                                {nodeData.keyConcepts && (
                                    <div className="p-4 rounded-2xl bg-[#0c0e14] border border-white/5 flex flex-col gap-1.5">
                                        <span className="font-bold text-[#c3f400] uppercase tracking-wider text-[10px] flex items-center gap-1">
                                            <BookOpen className="w-3.5 h-3.5" /> Key Architectural Concepts
                                        </span>
                                        <p className="text-xs font-medium text-white">{(nodeData.keyConcepts as string)}</p>
                                    </div>
                                )}

                                {nodeData.notes && (
                                    <div className="p-4 rounded-2xl bg-[#0c0e14] border border-white/5 flex flex-col gap-1.5">
                                        <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">Production Trade-Offs & Notes</span>
                                        <p className="text-xs font-medium text-slate-300">{(nodeData.notes as string)}</p>
                                    </div>
                                )}

                                {youtubeQuery && (
                                    <a
                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeQuery)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#d4004b]/20 hover:bg-[#d4004b]/30 text-[#ffb2ba] font-bold text-xs transition-all border border-[#d4004b]/30 shadow-md cursor-pointer"
                                    >
                                        <Video className="w-4 h-4 text-[#ffb2ba]" />
                                        <span>Watch Curated Tutorials for "{youtubeQuery}"</span>
                                        <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-70" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}

        </div>
    );
}
