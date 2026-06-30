import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import PageSkeleton from "../components/PageSkeleton";
import Navbar from "../components/Navbar";

const DIFFICULTY_OPTIONS = ['all', 'Easy', 'Medium', 'Hard'];
const TAG_OPTIONS = [
  'all',
  'Array',
  'String',
  'Linked List',
  'Tree',
  'Graph',
  'Dynamic Programming',
  'Backtracking',
  'Greedy',
  'Sorting',
  'Searching',
];

const difficultyBadgeClass = (difficulty) => {
  const value = (difficulty || '').toLowerCase();

  if (value === 'easy') return 'badge-success';
  if (value === 'medium') return 'badge-warning';
  if (value === 'hard') return 'badge-error';
  return 'badge-ghost';
};

const difficultyRank = (difficulty) => {
  const value = (difficulty || '').toLowerCase();
  if (value === 'easy') return 1;
  if (value === 'medium') return 2;
  if (value === 'hard') return 3;
  return 99;
};

const normalize = (value) => String(value || '').trim().toLowerCase();

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all',
  });

  const menuRef = useRef(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const onClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    const query =
      searchParams.get("search");

    if (query) {
      setSearch(query);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [problemRes, solvedRes] = await Promise.all([
          axiosClient.get('/problem/getall'),
          user?._id
            ? axiosClient.get('/problem/solvedByUser')
            : Promise.resolve({ data: [] }),
        ]);

        setProblems(Array.isArray(problemRes.data) ? problemRes.data : []);
        setSolvedProblems(Array.isArray(solvedRes.data) ? solvedRes.data : []);
      } catch (err) {
        console.error('Error fetching home data:', err);
        setProblems([]);
        setSolvedProblems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  const solvedSet = useMemo(() => {
    return new Set(
      solvedProblems.map((item) => String(item?._id ?? item)).filter(Boolean)
    );
  }, [solvedProblems]);

  const solvedCount = solvedSet.size;
  const totalCount = problems.length;
  const unsolvedCount = Math.max(totalCount - solvedCount, 0);
  const completion = totalCount ? Math.round((solvedCount / totalCount) * 100) : 0;

  const recentSolvedProblems = useMemo(() => {
    return solvedProblems
      .filter((item) => item && typeof item === 'object' && item._id && item.title)
      .slice(0, 5);
  }, [solvedProblems]);

  const filteredProblems = useMemo(() => {
    const q = normalize(search);

    let list = problems.filter((problem) => {
      const problemId = String(problem._id);
      const isSolved = solvedSet.has(problemId);

      const matchesSearch =
        !q ||
        normalize(problem.title).includes(q) ||
        normalize(problem.description).includes(q) ||
        normalize(problem.tags).includes(q) ||
        normalize(problem.difficulty).includes(q);

      const matchesDifficulty =
        filters.difficulty === 'all' || problem.difficulty === filters.difficulty;

      const matchesTag =
        filters.tag === 'all' || problem.tags === filters.tag;

      const matchesStatus =
        filters.status === 'all'
          ? true
          : filters.status === 'solved'
            ? isSolved
            : !isSolved;

      return matchesSearch && matchesDifficulty && matchesTag && matchesStatus;
    });

    if (sortBy === 'title-asc') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      list = [...list].sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'difficulty-easy') {
      list = [...list].sort((a, b) => difficultyRank(a.difficulty) - difficultyRank(b.difficulty));
    } else if (sortBy === 'difficulty-hard') {
      list = [...list].sort((a, b) => difficultyRank(b.difficulty) - difficultyRank(a.difficulty));
    }

    return list;
  }, [problems, search, filters, sortBy, solvedSet]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
    } finally {
      setShowMenu(false);
      navigate('/login');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSortBy('default');
    setFilters({
      difficulty: 'all',
      tag: 'all',
      status: 'all',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-425 px-6 py-10 lg:px-5">

        <div>
          <section className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xl">
            <section className="mb-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                <div>
                  <h1 className="text-4xl font-bold tracking-tight">
                    Problems
                  </h1>

                  <p className="mt-2 text-base-content/60">
                    Browse and solve coding challenges to improve your problem-solving skills.
                  </p>
                </div>

                <div className="text-sm text-base-content/50">
                  {totalCount} Problems
                </div>

              </div>
            </section>



            <div className="
sticky
top-20
z-20
mb-8
rounded-3xl
border
border-zinc-800
bg-zinc-950/80
p-5
backdrop-blur-xl
">



              <div className="flex flex-col gap-3 lg:flex-row">

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search problems..."
                  className="input input-bordered flex-1"
                />

                <select
                  className="select select-bordered"
                  value={filters.difficulty}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      difficulty: e.target.value
                    }))
                  }
                >
                  {DIFFICULTY_OPTIONS.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item === "all"
                        ? "Difficulty"
                        : item}
                    </option>
                  ))}
                </select>

                <select
                  className="select select-bordered"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: e.target.value
                    }))
                  }
                >
                  <option value="all">
                    Status
                  </option>

                  <option value="solved">
                    Solved
                  </option>

                  <option value="unsolved">
                    Unsolved
                  </option>
                </select>

                <select
                  className="select select-bordered"
                  value={filters.tag}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      tag: e.target.value
                    }))
                  }
                >
                  {TAG_OPTIONS.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item === "all"
                        ? "Topic"
                        : item}
                    </option>
                  ))}
                </select>

                <button
                  onClick={clearFilters}
                  className="btn btn-outline"
                >
                  Clear
                </button>
              </div>


              <div className="mt-4 text-sm text-base-content/50 py-2">
                Showing {filteredProblems.length} of {totalCount} problems
              </div>

              {loading ? (
                <PageSkeleton />
              ) : filteredProblems.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 p-10 text-center">
                  <h3 className="text-xl font-semibold">No problems found</h3>
                  <p className="mt-2 text-sm text-base-content/60">
                    Try changing filters, search terms, or clear the current selection.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProblems.map((problem, index) => {
                    const isSolved = solvedSet.has(
                      String(problem._id)
                    );

                    return (
                      <div
                        key={problem._id}
                        onClick={() =>
                          navigate(`/problem/${problem._id}`)
                        }
                        className="
          group
          cursor-pointer
          rounded-2xl
          border
          border-zinc-800
          bg-[#111113]
          px-6
          py-5
          transition-all
          duration-200
          hover:border-primary/50
          hover:bg-zinc-900/40
          hover:-translate-y-0.5
        "
                      >
                        <div className="flex items-center justify-between">

                          {/* Left */}

                          <div className="flex items-center gap-5">

                            <div
                              className={`
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-lg
                ${isSolved
                                  ? "bg-success/10 text-success"
                                  : "bg-zinc-800 text-zinc-500"
                                }
              `}
                            >
                              {isSolved ? "✓" : "○"}
                            </div>

                            <div>
                              <div className="flex items-center gap-3">

                                <span className="text-zinc-500">
                                  #{index + 1}
                                </span>

                                <h3 className="font-semibold text-lg group-hover:text-primary transition">
                                  {problem.title}
                                </h3>
                              </div>

                              <p className="text-sm text-zinc-500 mt-1">
                                {problem.tags}
                              </p>
                            </div>
                          </div>

                          {/* Right */}

                          <div className="flex items-center gap-3">

                            <span
                              className={`badge ${difficultyBadgeClass(
                                problem.difficulty
                              )}`}
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
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default HomePage;