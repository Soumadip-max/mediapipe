export interface EvaluationMetrics {
    roadmapProgress: number; // 0 to 100
    atsScore: number;        // 0 to 100
    interviewScore: number;  // 0 to 100
    doubtEngagement: number; // 0 to 100
}

export interface EvaluationRank {
    tier: string;
    badge: string;
    title: string;
    description: string;
    color: string;
    bgGradient: string;
    borderColor: string;
}

export interface CandidateEvaluationResult {
    overallScore: number;
    rank: EvaluationRank;
    breakdown: {
        roadmapWeighted: number;
        atsWeighted: number;
        interviewWeighted: number;
        doubtWeighted: number;
    };
    strengths: string[];
    gaps: string[];
}

export const DEFAULT_METRICS: EvaluationMetrics = {
    roadmapProgress: 75,
    atsScore: 88,
    interviewScore: 82,
    doubtEngagement: 70,
};

export function calculateCandidateEvaluation(metrics: EvaluationMetrics = DEFAULT_METRICS): CandidateEvaluationResult {
    const roadmapWeighted = (metrics.roadmapProgress * 0.25);
    const atsWeighted = (metrics.atsScore * 0.25);
    const interviewWeighted = (metrics.interviewScore * 0.30);
    const doubtWeighted = (metrics.doubtEngagement * 0.20);

    const overallScore = Math.round(roadmapWeighted + atsWeighted + interviewWeighted + doubtWeighted);

    let rank: EvaluationRank;

    if (overallScore >= 90) {
        rank = {
            tier: "Principal Tier",
            badge: "🏆 Principal Tier (Top 1% Candidate)",
            title: "Principal / Staff Engineering Contender",
            description: "Exceptional technical mastery across system design, high composure under interview pressure, and peak ATS compatibility.",
            color: "text-[#c3f400]",
            bgGradient: "from-[#c3f400]/20 via-[#c0c1ff]/10 to-transparent",
            borderColor: "border-[#c3f400]/50 shadow-[0_0_25px_rgba(195,244,0,0.25)]",
        };
    } else if (overallScore >= 75) {
        rank = {
            tier: "Senior Engineer Ready",
            badge: "⚡ Senior Engineer Ready (Top 10%)",
            title: "Senior Engineering Production Ready",
            description: "Strong architecture grasp, excellent interview speech metrics, and high technical problem-solving engagement.",
            color: "text-indigo-400",
            bgGradient: "from-indigo-500/20 via-violet-500/10 to-transparent",
            borderColor: "border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.2)]",
        };
    } else if (overallScore >= 50) {
        rank = {
            tier: "Mid-Level Developer",
            badge: "📈 Mid-Level Developer (Solid Contender)",
            title: "Solid Mid-Level Full Stack Contender",
            description: "Good foundation in core algorithms and frameworks. Ready for mid-level roles with minor areas for speech pacing polish.",
            color: "text-[#c0c1ff]",
            bgGradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
            borderColor: "border-blue-500/30",
        };
    } else {
        rank = {
            tier: "Early Career",
            badge: "🌱 Early Career / In Development",
            title: "Early Career Engineer in Acceleration",
            description: "Actively building foundations. Focus on completing milestone roadmaps and practicing mock interviews to elevate score.",
            color: "text-amber-400",
            bgGradient: "from-amber-500/20 via-orange-500/10 to-transparent",
            borderColor: "border-amber-500/30",
        };
    }

    // Dynamic Strengths Analysis
    const strengths: string[] = [];
    if (metrics.interviewScore >= 80) strengths.push("Strong System Design & Interview Composure");
    if (metrics.atsScore >= 80) strengths.push("High ATS Resume Match Score & Keyword Density");
    if (metrics.roadmapProgress >= 70) strengths.push("Consistent Technical Roadmap Execution");
    if (metrics.doubtEngagement >= 65) strengths.push("Proactive Technical Inquiry & Debugging Habit");
    if (strengths.length === 0) strengths.push("Solid foundation in core computer science primitives");

    // Dynamic Key Gaps Analysis
    const gaps: string[] = [];
    if (metrics.interviewScore < 80) gaps.push("Needs minor improvement in Interview Speech Pacing & Filler Words");
    if (metrics.atsScore < 80) gaps.push("Resume action-verb impact score could be strengthened");
    if (metrics.roadmapProgress < 70) gaps.push("Expand coverage in Advanced Distributed Systems & Cloud Security");
    if (metrics.doubtEngagement < 65) gaps.push("Increase engagement in Doubt Solver architecture reviews");
    if (gaps.length === 0) gaps.push("Maintain current interview practice routine before top tech loops");

    return {
        overallScore,
        rank,
        breakdown: {
            roadmapWeighted: Math.round(roadmapWeighted),
            atsWeighted: Math.round(atsWeighted),
            interviewWeighted: Math.round(interviewWeighted),
            doubtWeighted: Math.round(doubtWeighted),
        },
        strengths,
        gaps,
    };
}

export function formatShareableCandidateCard(
    candidateName: string,
    targetRole: string,
    result: CandidateEvaluationResult
): string {
    return `========================================
ZENITH CANDIDATE EVALUATION REPORT
========================================
Candidate: ${candidateName}
Target Role: ${targetRole}
Overall Readiness Score: ${result.overallScore}%
Evaluation Rank: ${result.rank.badge}

MODULE READINESS BREAKDOWN:
- 📘 Roadmap Execution: ${result.breakdown.roadmapWeighted}/25 pts
- 📄 ATS Resume Optimization: ${result.breakdown.atsWeighted}/25 pts
- 🎙️ AI Mock Interview (Vision + Speech): ${result.breakdown.interviewWeighted}/30 pts
- 💬 Doubt Solver Engagement: ${result.breakdown.doubtWeighted}/20 pts

TOP CANDIDATE STRENGTHS:
${result.strengths.map(s => `• ${s}`).join("\n")}

RECOMMENDED ACTIONABLE GAPS:
${result.gaps.map(g => `• ${g}`).join("\n")}
========================================
Generated by Zenith AI Career Platform`;
}
