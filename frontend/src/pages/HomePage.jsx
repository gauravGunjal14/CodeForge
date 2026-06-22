import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

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
    <div className="min-h-screen bg-base-300">
      <div className="mx-auto max-w-[1700px] px-3 py-3 lg:px-5">
        <div className="mb-4 rounded-3xl border border-base-300 bg-base-100 px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-content font-black">
                {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  CodeForge
                </h1>

                <p className="text-sm text-base-content/60">
                  {totalCount} Problems
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`
                }
              >
                Problems
              </NavLink>

              <span className="btn btn-sm btn-ghost pointer-events-none opacity-60">
                Contests
              </span>

              {user?.role === 'admin' && (
                <Link to="/admin" className="btn btn-sm btn-outline">
                  Admin Panel
                </Link>
              )}

              <div className="divider divider-horizontal mx-0 hidden lg:flex" />

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="btn btn-sm btn-outline"
                >
                  {user?.firstName || 'User'}
                  <span className="ml-1 opacity-70">▼</span>
                </button>

                {showMenu && (
                  <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl">

                    <div className="border-b border-base-200 px-4 py-3">
                      <p className="font-semibold">
                        {user?.firstName}
                      </p>

                      <p className="text-xs text-base-content/50">
                        {user?.email || user?.emailId}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-error hover:bg-base-200"
                    >
                      Logout
                    </button>

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <section className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xl">
            <div className="mb-5 grid gap-3 md:grid-cols-4">
              <div className="rounded-2xl bg-base-200/70 p-4">
                <p className="text-xs uppercase tracking-wider text-base-content/50">
                  Total Problems
                </p>
                <p className="mt-2 text-2xl font-bold">{totalCount}</p>
              </div>

              <div className="rounded-2xl bg-base-200/70 p-4">
                <p className="text-xs uppercase tracking-wider text-base-content/50">
                  Solved
                </p>
                <p className="mt-2 text-2xl font-bold text-success">{solvedCount}</p>
              </div>

              <div className="rounded-2xl bg-base-200/70 p-4">
                <p className="text-xs uppercase tracking-wider text-base-content/50">
                  Unsolved
                </p>
                <p className="mt-2 text-2xl font-bold">{unsolvedCount}</p>
              </div>

              <div className="rounded-2xl bg-base-200/70 p-4">
                <p className="text-xs uppercase tracking-wider text-base-content/50">
                  Progress
                </p>
                <p className="mt-2 text-2xl font-bold">{completion}%</p>
                <progress
                  className="progress progress-primary mt-2 w-full"
                  value={completion}
                  max="100"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-base-300 bg-base-200/50 p-4">
              <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="grid w-full gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <label className="form-control">
                    <div className="label pb-1">
                      <span className="label-text text-xs uppercase tracking-wider text-base-content/50">
                        Search
                      </span>
                    </div>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      type="text"
                      placeholder="Search by title, tag, difficulty..."
                      className="input input-bordered w-full rounded-2xl"
                    />
                  </label>

                  <label className="form-control">
                    <div className="label pb-1">
                      <span className="label-text text-xs uppercase tracking-wider text-base-content/50">
                        Status
                      </span>
                    </div>
                    <select
                      className="select select-bordered w-full rounded-2xl"
                      value={filters.status}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, status: e.target.value }))
                      }
                    >
                      <option value="all">All Problems</option>
                      <option value="solved">Solved</option>
                      <option value="unsolved">Unsolved</option>
                    </select>
                  </label>

                  <label className="form-control">
                    <div className="label pb-1">
                      <span className="label-text text-xs uppercase tracking-wider text-base-content/50">
                        Difficulty
                      </span>
                    </div>
                    <select
                      className="select select-bordered w-full rounded-2xl"
                      value={filters.difficulty}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          difficulty: e.target.value,
                        }))
                      }
                    >
                      {DIFFICULTY_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item === 'all' ? 'All Difficulty' : item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="form-control">
                    <div className="label pb-1">
                      <span className="label-text text-xs uppercase tracking-wider text-base-content/50">
                        Topic
                      </span>
                    </div>
                    <select
                      className="select select-bordered w-full rounded-2xl"
                      value={filters.tag}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          tag: e.target.value,
                        }))
                      }
                    >
                      {TAG_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item === 'all' ? 'All Topics' : item}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="form-control">
                    <div className="label pb-1">
                      <span className="label-text text-xs uppercase tracking-wider text-base-content/50">
                        Sort
                      </span>
                    </div>
                    <select
                      className="select select-bordered rounded-2xl"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="default">Default</option>
                      <option value="title-asc">Title: A → Z</option>
                      <option value="title-desc">Title: Z → A</option>
                      <option value="difficulty-easy">Difficulty: Easy → Hard</option>
                      <option value="difficulty-hard">Difficulty: Hard → Easy</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="btn btn-outline rounded-2xl"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="badge badge-outline">
                  {filteredProblems.length} shown
                </span>
                <span className="badge badge-ghost">Solved: {solvedCount}</span>
                <span className="badge badge-ghost">Unsolved: {unsolvedCount}</span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  <div className="skeleton h-28 w-full rounded-2xl" />
                  <div className="skeleton h-28 w-full rounded-2xl" />
                  <div className="skeleton h-28 w-full rounded-2xl" />
                </div>
              ) : filteredProblems.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 p-10 text-center">
                  <h3 className="text-xl font-semibold">No problems found</h3>
                  <p className="mt-2 text-sm text-base-content/60">
                    Try changing filters, search terms, or clear the current selection.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProblems.map((problem) => {
                    const problemId = String(problem._id);
                    const isSolved = solvedSet.has(problemId);

                    return (
                      <Link
                        to={`/problem/${problem._id}`}
                        key={problem._id}
                        className="group block rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex-1">
                            <div className="mb-3 flex items-center gap-3">
                              <div
                                className={`grid h-9 w-9 place-items-center rounded-2xl ${isSolved ? 'bg-success/15 text-success' : 'bg-base-200'
                                  }`}
                              >
                                {isSolved ? '✓' : '•'}
                              </div>

                              <div>
                                <h2 className="text-xl font-bold tracking-tight group-hover:text-primary">
                                  {problem.title}
                                </h2>
                                <p className="text-xs uppercase tracking-wider text-base-content/40">
                                  Click to open problem
                                </p>
                              </div>
                            </div>

                            <p className="max-h-12 overflow-hidden text-sm leading-6 text-base-content/70">
                              {problem.description}
                            </p>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <span className={`badge ${difficultyBadgeClass(problem.difficulty)}`}>
                                {problem.difficulty}
                              </span>
                              <span className="badge badge-outline">{problem.tags}</span>
                              {typeof problem.hiddenTestCasesCount === 'number' && (
                                <span className="badge badge-ghost">
                                  {problem.hiddenTestCasesCount} Hidden
                                </span>
                              )}
                              {isSolved && (
                                <span className="badge badge-success badge-outline">
                                  Solved
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start">
                            <span className="btn btn-sm btn-primary rounded-2xl">
                              Open
                            </span>
                          </div>
                        </div>
                      </Link>
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