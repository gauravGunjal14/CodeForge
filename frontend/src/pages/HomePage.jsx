import { logoutUser } from '../authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import axiosClient from '../utils/axiosClient';

function HomePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [showMenu, setShowMenu] = useState(false);
    const [problems, setProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [filters, setFilters] = useState({
        difficulty: 'all',
        tag: 'all',
        status: 'all'
    });

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const { data } = await axiosClient.get('/problem/getall');
                setProblems(data);
            }
            catch (err) {
                console.error('Error fetching problems:', err);
            }
        };

        const fetchSolvedProblemed = async () => {
            try {
                const { data } = await axiosClient.get('/problem/solvedByUser');
                setSolvedProblems(data);
            }
            catch (err) {
                console.error('Error fetching solved problems:', err)
            }
        };

        fetchProblems();
        if (user) fetchSolvedProblemed();
    }, [user]);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/login');
    };

    const filteredProblems = problems.filter(problem => {
        const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
        const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
        const isSolved = solvedProblems.some(
            (sp) => sp._id === problem._id
        );

        const statusMatch =
            filters.status === "all" ? true :
                filters.status === "solved"
                    ? isSolved
                    : !isSolved;

        return difficultyMatch && tagMatch && statusMatch;
    });

    return (
        <div>
            {/* navbar */}
            <div className="navbar bg-base-100 border-b px-8 shadow-sm">

                <div className="flex-1">
                    <h1 className="text-2xl font-bold">
                        CodeForge
                    </h1>
                </div>

                <div className="flex items-center gap-8">

                    <Link className="font-medium hover:text-primary">
                        Problems
                    </Link>

                    <Link className="font-medium hover:text-primary">
                        Contests
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="btn btn-sm btn-outline"
                        >
                            {user?.firstName}
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-40 bg-base-100 border rounded-xl shadow-lg z-50">

                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 hover:bg-base-200"
                                >
                                    Logout
                                </button>

                            </div>
                        )}
                    </div>

                </div>
            </div >

            {/* filter */}
            < div className="flex gap-4 px-8 py-6" >
                <select className="select select-bordered"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                    <option value='all'>All Problems</option>
                    <option value='solved'>Solved</option>
                </select>

                <select className="select select-bordered"
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                >
                    <option value='all'>Difficulty</option>
                    <option value='Easy'>Easy</option>
                    <option value='Medium'>Medium</option>
                    <option value='Hard'>Hard</option>
                </select>

                <select className="select select-bordered"
                    value={filters.tag}
                    onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
                >
                    <option value='all'>Topic</option>
                    <option value='Array'>Array</option>
                    <option value='Linkedlist'>Linked List</option>
                    <option value='Tree'>Tree</option>
                    <option value='Graph'>Graph</option>
                    <option value='Dp'>DP</option>
                </select>
            </div >

            {/* problems */}
            <div className="px-8 py-6 flex flex-col gap-4">
                {filteredProblems.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No problems found.
                    </div>
                ) : (
                    filteredProblems.map((problem) => {
                        const isSolved = solvedProblems.some(
                            (sp) => sp._id === problem._id
                        );

                        return (
                            <div
                                key={problem._id}
                                className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            {isSolved && (
                                                <span className="text-success text-lg">
                                                    ✓
                                                </span>
                                            )}
                                            <h2 className="text-xl font-semibold">
                                                {problem.title}
                                            </h2>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                                            {problem.description}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 ml-6">
                                        <span
                                            className={`badge ${problem.difficulty === "easy"
                                                ? "badge-success"
                                                : problem.difficulty === "medium"
                                                    ? "badge-warning"
                                                    : "badge-error"
                                                }`}
                                        >
                                            {problem.difficulty}
                                        </span>
                                        <span className="badge badge-outline">
                                            {problem.tags}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    )
}

export default HomePage;