import { Search, User, Settings, LogOut, Shield } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { logoutUser } from "../authSlice";

function Navbar() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);
    const [search, setSearch] = useState("");
    const menuRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () =>
            document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser());
        } finally {
            navigate("/login");
        }
    };

    return (
        <nav className="sticky top-0 left-0 right-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-zinc-800">
            <div className="max-w-400 mx-auto h-20 px-6 flex items-center justify-between">

                {/* Left */}

                <div className="flex items-center gap-10">

                    <Link
                        to="/problems"
                        className="text-2xl font-bold font-heading"
                    >
                        CodeForge
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">

                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `relative transition-colors duration-300 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-primary after:transition-all after:duration-300
                                ${isActive
                                    ? "text-white after:w-full"
                                    : "text-zinc-400 after:w-0 hover:after:w-full"
                                }`
                            }
                        >
                            Problems
                        </NavLink>

                        <button
                            className="relative text-zinc-500 cursor-not-allowed transition-colors"
                        >
                            Explore
                        </button>

                    </div>
                </div>

                {/* Search */}

                <div className="hidden lg:flex w-100 relative">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (
                                e.key === "Enter" &&
                                search.trim()
                            ) {
                                navigate(
                                    `/?search=${encodeURIComponent(
                                        search
                                    )}`
                                );
                            }
                        }}
                        placeholder="Search problems..."
                        className="w-full h-11 rounded-2xl bg-zinc-900/70 border border-zinc-800 pl-12 pr-4 outline-none transition-all duration-300 focus:border-primary"
                    />
                </div>

                {/* Right */}

                <div className="flex items-center gap-4">

                    {user?.role === "admin" && (
                        <Link
                            to="/admin"
                            className="btn btn-sm rounded-xl border-zinc-700 bg-zinc-900/50 hover:border-primary hover:bg-zinc-900 transition-all duration-300"
                        >
                            <Shield size={16} />
                            Admin
                        </Link>
                    )}

                    <div
                        className="relative"
                        ref={menuRef}
                    >
                        <button
                            onClick={() => setShowMenu((p) => !p)}
                            className="w-11 h-11 rounded-full bg-primary text-white font-bold flex items-center justify-center"
                        >
                            {user?.firstName
                                ?.charAt(0)
                                .toUpperCase()}
                        </button>

                        {showMenu && (
                            <div
                                className="absolute right-0 mt-3 w-56 rounded-2xl bg-card border border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-2 "
                            >
                                <div className="p-4 border-b border-zinc-800">
                                    <p className="font-semibold">
                                        {user?.firstName}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        {user?.email}
                                    </p>
                                </div>

                                <button
                                    className="w-full px-4 py-3 text-left hover:bg-zinc-900 flex items-center gap-3"
                                >
                                    <User size={16} />
                                    Profile
                                </button>

                                <button
                                    className="w-full px-4 py-3 text-left hover:bg-zinc-900 flex items-center gap-3"
                                >
                                    <Settings size={16} />
                                    Settings
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 text-left text-red-400 hover:bg-zinc-900 flex items-center gap-3"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;