import { useNavigate } from "react-router-dom";
import { PlusCircle, Database, BarChart3, Activity, ShieldCheck, ArrowRight, FileCode2, CircleCheckBig, Clock3, } from "lucide-react";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

function AdminPanel() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        total: 0,
        easy: 0,
        medium: 0,
        hard: 0,
    });

    const [loading, setLoading] = useState(true);

    const statCards = [
        {
            title: "Total Problems",
            value: stats.total,
            icon: FileCode2,
        },
        {
            title: "Easy",
            value: stats.easy,
            icon: CircleCheckBig,
        },
        {
            title: "Medium",
            value: stats.medium,
            icon: Clock3,
        },
        {
            title: "Hard",
            value: stats.hard,
            icon: Activity,
        },
    ];

    const cards = [
        {
            title: "Create Problem",
            description:
                "Add a new coding problem with examples, test cases, constraints and reference solutions.",
            icon: PlusCircle,
            path: "/admin/create",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Manage Problems",
            description:
                "Browse, update and delete existing problems from a single place.",
            icon: Database,
            path: "/admin/problems",
            color: "text-primary",
            bg: "bg-primary/10",
        },
    ];

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axiosClient.get("/problem/getall");
            const problems = res.data;

            setStats({
                total: problems.length,
                easy: problems.filter((p) => p.difficulty === "Easy").length,
                medium: problems.filter((p) => p.difficulty === "Medium").length,
                hard: problems.filter((p) => p.difficulty === "Hard").length,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-zinc-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Header */}

                <div className="mb-14">

                    <div className="flex items-center gap-4 mb-6">

                        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center">
                            <ShieldCheck
                                size={32}
                                className="text-primary"
                            />
                        </div>

                        <div>
                            <p className="text-primary font-medium">
                                Administration
                            </p>

                            <h1 className="text-5xl font-bold">
                                Control Center
                            </h1>
                        </div>
                    </div>

                    <p className="max-w-3xl text-zinc-400 leading-8">
                        Manage coding problems, maintain platform content,
                        monitor activity and control every aspect of
                        CodeForge from one place.
                    </p>
                </div>

                {/* Stats */}

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-14">

                    {statCards.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="rounded-[28px] border border-zinc-800 bg-card p-6 "
                            >
                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-sm text-zinc-500">
                                            {item.title}
                                        </p>

                                        <h3 className="text-3xl font-bold mt-4">
                                            {loading ? "--" : item.value}
                                        </h3>
                                    </div>

                                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                        <Icon
                                            size={22}
                                            className="text-zinc-400"
                                        />
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}

                <div className="mb-8">

                    <h2 className="text-3xl font-bold">
                        Quick Actions
                    </h2>

                    <p className="mt-2 text-zinc-500">
                        Frequently used administrative tools.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">

                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                onClick={() => {
                                    if (!card.disabled) {
                                        navigate(card.path);
                                    }
                                }}
                                className={`rounded-4xl border border-zinc-800 bg-card p-8 transition-all duration-300
                                    ${card.disabled
                                        ? "opacity-60 cursor-not-allowed"
                                        : "cursor-pointer hover:border-primary/40 hover:-translate-y-1"
                                    }
                                `}
                            >
                                <div
                                    className={` w-16 h-16 rounded-2xl ${card.bg} flex items-center justify-center mb-8`}
                                >
                                    <Icon
                                        size={30}
                                        className={card.color}
                                    />
                                </div>

                                <h3 className="text-2xl font-bold mb-4">
                                    {card.title}
                                </h3>

                                <p className="text-zinc-400 leading-7">
                                    {card.description}
                                </p>

                                <div
                                    className={`mt-8 flex items-center gap-2 font-medium
                                        ${card.disabled
                                            ? "text-zinc-500"
                                            : "text-primary"
                                        }`}
                                >
                                    {card.disabled
                                        ? "Coming Soon"
                                        : "Open"}

                                    {!card.disabled && (
                                        <ArrowRight size={18} />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

export default AdminPanel;