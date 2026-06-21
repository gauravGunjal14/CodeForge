import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axiosClient from '../utils/axiosClient';
import { useSelector } from 'react-redux';

const LEFT_TABS = ['description', 'editorial', 'solutions', 'submissions'];
const RIGHT_TABS = ['code', 'testcase', 'result'];

const LANGUAGE_OPTIONS = ['JavaScript', 'Java', 'C++'];

const languageToMonaco = (language) => {
  if (language === 'C++') return 'cpp';
  if (language === 'Java') return 'java';
  return 'javascript';
};

const difficultyBadgeClass = (difficulty) => {
  const value = (difficulty || '').toLowerCase();

  if (value === 'easy') return 'badge-success';
  if (value === 'medium') return 'badge-warning';
  if (value === 'hard') return 'badge-error';
  return 'badge-ghost';
};

const prettyDate = (value) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleString();
};

const safeArray = (value) => (Array.isArray(value) ? value : []);

function ProblemPage() {
  const { problemId } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');

  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [selectedSolutionLanguage, setSelectedSolutionLanguage] = useState('JavaScript');

  const [codeByLanguage, setCodeByLanguage] = useState({
    JavaScript: '',
    Java: '',
    'C++': '',
  });

  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const editorRef = useRef(null);

  const currentCode = codeByLanguage[selectedLanguage] ?? '';

  const currentReferenceSolution = useMemo(() => {
    const solutions = safeArray(problem?.referenceSolution);
    if (!solutions.length) return null;

    return (
      solutions.find((item) => item.language === selectedSolutionLanguage) ||
      solutions[0]
    );
  }, [problem, selectedSolutionLanguage]);

  const currentStarterCode = useMemo(() => {
    const starters = safeArray(problem?.startCode);
    if (!starters.length) return '';

    return (
      starters.find((item) => item.language === selectedLanguage)?.initialCode ||
      starters[0]?.initialCode ||
      ''
    );
  }, [problem, selectedLanguage]);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      setPageError('');

      try {
        const { data } = await axiosClient.get(`/problem/get/${problemId}`);
        setProblem(data);

        const nextCodeMap = {
          JavaScript:
            data?.startCode?.find((item) => item.language === 'JavaScript')?.initialCode ||
            '',
          Java: data?.startCode?.find((item) => item.language === 'Java')?.initialCode || '',
          'C++': data?.startCode?.find((item) => item.language === 'C++')?.initialCode || '',
        };

        setCodeByLanguage(nextCodeMap);

        const availableLanguages = safeArray(data?.startCode).map((item) => item.language);
        if (availableLanguages.includes(selectedLanguage)) {
          setSelectedLanguage(selectedLanguage);
        } else if (availableLanguages.length > 0) {
          setSelectedLanguage(availableLanguages[0]);
        } else {
          setSelectedLanguage('JavaScript');
        }

        const solutionLanguages = safeArray(data?.referenceSolution).map((item) => item.language);
        if (solutionLanguages.includes(selectedSolutionLanguage)) {
          setSelectedSolutionLanguage(selectedSolutionLanguage);
        } else if (solutionLanguages.length > 0) {
          setSelectedSolutionLanguage(solutionLanguages[0]);
        } else {
          setSelectedSolutionLanguage('JavaScript');
        }
      } catch (error) {
        setPageError(error.response?.data?.message || error.message || 'Failed to load problem');
      } finally {
        setLoading(false);
      }
    };

    if (problemId) fetchProblem();
  }, [problemId]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user?._id || !problemId) {
        setSubmissions([]);
        return;
      }

      setLoadingSubmissions(true);
      try {
        const { data } = await axiosClient.get(`/problem/solvedByUser/`);
        const list = Array.isArray(data) ? data : (data?.submissions || data?.answer || []);
        setSubmissions(list);
      } catch (error) {
        setSubmissions([]);
      } finally {
        setLoadingSubmissions(false);
      }
    };

    fetchSubmissions();
  }, [problemId, user?._id]);

  useEffect(() => {
    if (!currentStarterCode) return;
    setCodeByLanguage((prev) => ({
      ...prev,
      [selectedLanguage]: prev[selectedLanguage] || currentStarterCode,
    }));
  }, [currentStarterCode, selectedLanguage]);

  const handleEditorChange = (value) => {
    setCodeByLanguage((prev) => ({
      ...prev,
      [selectedLanguage]: value ?? '',
    }));
  };

  const handleRun = async () => {
    setRunning(true);
    setRunResult(null);
    setActiveRightTab('result');

    try {
      const { data } = await axiosClient.post(`/submission/run/${problemId}`, {
        problemId,
        language: selectedLanguage,
        code: currentCode,
      });

      setRunResult(data);
    } catch (error) {
      setRunResult({
        status: 'Error',
        message: error.response?.data?.message || error.message || 'Run failed',
      });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitResult(null);
    setActiveRightTab('result');

    try {
      const { data } = await axiosClient.post(`/submission/submit/${problemId}`, {
        problemId,
        language: selectedLanguage,
        code: currentCode,
      });

      setSubmitResult(data);
      await axiosClient.get(`/problem/solvedByUser/${problemId}`).then((res) => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.submissions || []);
        setSubmissions(list);
      });
    } catch (error) {
      setSubmitResult({
        status: 'Error',
        message: error.response?.data?.message || error.message || 'Submit failed',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const visibleExamples = safeArray(problem?.visibleTestCases);
  const hiddenExamples = safeArray(problem?.hiddenTestCases);
  const starterLanguages = safeArray(problem?.startCode);
  const solutionLanguages = safeArray(problem?.referenceSolution);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-300 p-4">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xl">
              <div className="skeleton h-8 w-44 mb-4" />
              <div className="skeleton h-5 w-80 mb-2" />
              <div className="skeleton h-5 w-3/4 mb-2" />
              <div className="skeleton h-5 w-2/3 mb-6" />
              <div className="skeleton h-40 w-full mb-4" />
              <div className="skeleton h-40 w-full" />
            </div>

            <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xl">
              <div className="skeleton h-8 w-44 mb-4" />
              <div className="skeleton h-[600px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center p-4">
        <div className="alert alert-error max-w-xl shadow-xl">
          <span>{pageError}</span>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Problem not found</h2>
            <p>The requested problem could not be loaded.</p>
          </div>
        </div>
      </div>
    );
  }

  const renderLeftTab = () => {
    if (activeLeftTab === 'description') {
      return (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`badge ${difficultyBadgeClass(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className="badge badge-outline">{problem.tags}</span>
              <span className="badge badge-ghost">{visibleExamples.length} Example(s)</span>
              <span className="badge badge-ghost">{hiddenExamples.length} Hidden</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight leading-tight">
              {problem.title}
            </h1>

            <p className="whitespace-pre-wrap leading-7 text-base-content/80">
              {problem.description}
            </p>
          </div>

          {Array.isArray(problem.constraints) && problem.constraints.length > 0 && (
            <div className="rounded-2xl border border-base-300 bg-base-200/60 p-4">
              <h3 className="mb-3 text-lg font-semibold">Constraints</h3>
              <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
                {problem.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Examples</h3>

            {visibleExamples.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/50 p-6 text-sm text-base-content/60">
                No examples added yet.
              </div>
            ) : (
              visibleExamples.map((example, index) => (
                <div
                  key={`${example.input}-${index}`}
                  className="rounded-2xl border border-base-300 bg-base-200/60 p-4 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-semibold">Example {index + 1}:</h4>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl bg-base-100 p-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-base-content/50">
                        Input
                      </p>
                      <pre className="whitespace-pre-wrap font-mono text-sm">
                        {example.input}
                      </pre>
                    </div>

                    <div className="rounded-xl bg-base-100 p-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-base-content/50">
                        Output
                      </p>
                      <pre className="whitespace-pre-wrap font-mono text-sm">
                        {example.output}
                      </pre>
                    </div>
                  </div>

                  {example.explanation && (
                    <div className="mt-3 rounded-xl bg-base-100 p-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-base-content/50">
                        Explanation
                      </p>
                      <p className="text-sm leading-6 text-base-content/80">
                        {example.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    if (activeLeftTab === 'editorial') {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Editorial</h2>

          {problem.editorial ? (
            <div className="rounded-2xl border border-base-300 bg-base-200/60 p-5 leading-7 text-base-content/80 whitespace-pre-wrap">
              {problem.editorial}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/60 p-6">
              <h3 className="mb-2 text-lg font-semibold">No editorial added yet</h3>
              <p className="text-sm text-base-content/70 leading-6">
                Add an editorial field later if you want to show step-by-step solution notes,
                complexity analysis, and alternative approaches.
              </p>
            </div>
          )}
        </div>
      );
    }

    if (activeLeftTab === 'solutions') {
      return (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">Solutions</h2>

            <div className="tabs tabs-boxed bg-base-200">
              {solutionLanguages.length > 0 ? (
                solutionLanguages.map((item) => (
                  <button
                    key={item.language}
                    type="button"
                    className={`tab ${selectedSolutionLanguage === item.language ? 'tab-active' : ''}`}
                    onClick={() => setSelectedSolutionLanguage(item.language)}
                  >
                    {item.language}
                  </button>
                ))
              ) : (
                <span className="px-3 py-2 text-sm text-base-content/60">
                  No saved solutions
                </span>
              )}
            </div>
          </div>

          {!currentReferenceSolution ? (
            <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/60 p-6">
              <p className="text-sm text-base-content/70">
                No reference solutions available.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-base-300 bg-base-200/60 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">Reference Solution — {currentReferenceSolution.language}</h3>
                </div>

                <pre className="overflow-x-auto rounded-xl bg-base-100 p-4 text-sm leading-6">
                  <code>{currentReferenceSolution.completeCode}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeLeftTab === 'submissions') {
      return (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">Submissions</h2>
            <span className="badge badge-outline">{submissions.length} record(s)</span>
          </div>

          {loadingSubmissions ? (
            <div className="space-y-3">
              <div className="skeleton h-24 w-full" />
              <div className="skeleton h-24 w-full" />
              <div className="skeleton h-24 w-full" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/60 p-6">
              <p className="text-sm text-base-content/70">
                No submissions found for this problem yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission, index) => {
                const statusText =
                  submission.status?.description ||
                  submission.status ||
                  submission.verdict ||
                  'Submitted';

                const statusId = submission.status?.id;

                const statusClass =
                  statusId === 3 || /accepted/i.test(statusText)
                    ? 'badge-success'
                    : /wrong|failed|error|rejected/i.test(statusText)
                    ? 'badge-error'
                    : 'badge-warning';

                return (
                  <div
                    key={submission._id || submission.token || index}
                    className="rounded-2xl border border-base-300 bg-base-200/60 p-4 shadow-sm"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`badge ${statusClass}`}>
                          {statusText}
                        </span>
                        <span className="badge badge-outline">
                          {submission.language || submission.lang || 'Unknown'}
                        </span>
                      </div>
                      <span className="text-xs text-base-content/50">
                        {prettyDate(submission.createdAt || submission.created_at || submission.date)}
                      </span>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="rounded-xl bg-base-100 p-3">
                        <p className="text-xs uppercase tracking-wider text-base-content/50">
                          Runtime
                        </p>
                        <p className="mt-1 font-semibold">
                          {submission.runtime || submission.time || '--'}
                        </p>
                      </div>

                      <div className="rounded-xl bg-base-100 p-3">
                        <p className="text-xs uppercase tracking-wider text-base-content/50">
                          Memory
                        </p>
                        <p className="mt-1 font-semibold">
                          {submission.memory || '--'}
                        </p>
                      </div>

                      <div className="rounded-xl bg-base-100 p-3">
                        <p className="text-xs uppercase tracking-wider text-base-content/50">
                          Language
                        </p>
                        <p className="mt-1 font-semibold">
                          {submission.language || submission.lang || '--'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const renderRightTab = () => {
    if (activeRightTab === 'code') {
      return (
        <div className="flex h-full min-h-0 flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="tabs tabs-boxed bg-base-200">
              {LANGUAGE_OPTIONS.map((language) => (
                <button
                  key={language}
                  type="button"
                  className={`tab ${selectedLanguage === language ? 'tab-active' : ''}`}
                  onClick={() => setSelectedLanguage(language)}
                >
                  {language}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setCodeByLanguage((prev) => ({
                  ...prev,
                  [selectedLanguage]: currentStarterCode || '',
                }));
              }}
            >
              Reset code
            </button>
          </div>

          <div className="flex-1 overflow-hidden rounded-2xl border border-base-300 bg-[#1e1e1e] shadow-lg">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              language={languageToMonaco(selectedLanguage)}
              theme="vs-dark"
              value={currentCode}
              onChange={handleEditorChange}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                smoothScrolling: true,
                lineNumbers: 'on',
                tabSize: 2,
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="btn btn-outline btn-lg"
              onClick={handleRun}
              disabled={running}
            >
              {running ? 'Running...' : 'Run'}
            </button>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      );
    }

    if (activeRightTab === 'testcase') {
      return (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">Test Cases</h2>
            <span className="badge badge-outline">
              {visibleExamples.length} visible / {hiddenExamples.length} hidden
            </span>
          </div>

          <div className="space-y-3">
            {visibleExamples.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/60 p-6">
                <p className="text-sm text-base-content/70">
                  No visible test cases available.
                </p>
              </div>
            ) : (
              visibleExamples.map((example, index) => (
                <div
                  key={`${example.input}-${index}`}
                  className="rounded-2xl border border-base-300 bg-base-200/60 p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Case {index + 1}</h3>
                    <span className="badge badge-primary badge-outline">Visible</span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl bg-base-100 p-3">
                      <p className="mb-2 text-xs uppercase tracking-wider text-base-content/50">
                        Input
                      </p>
                      <pre className="whitespace-pre-wrap font-mono text-sm">
                        {example.input}
                      </pre>
                    </div>

                    <div className="rounded-xl bg-base-100 p-3">
                      <p className="mb-2 text-xs uppercase tracking-wider text-base-content/50">
                        Expected Output
                      </p>
                      <pre className="whitespace-pre-wrap font-mono text-sm">
                        {example.output}
                      </pre>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/60 p-4">
            <p className="text-sm leading-6 text-base-content/70">
              Run will evaluate your code against the visible test cases.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">Result</h2>
          {(runResult || submitResult) && (
            <span className="badge badge-outline">Latest execution</span>
          )}
        </div>

        {!runResult && !submitResult ? (
          <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/60 p-6">
            <p className="text-sm text-base-content/70">
              Run or submit your code to see execution results here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { label: 'Run Result', value: runResult },
              { label: 'Submit Result', value: submitResult },
            ].map((block) =>
              block.value ? (
                <div
                  key={block.label}
                  className="rounded-2xl border border-base-300 bg-base-200/60 p-4 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold">{block.label}</h3>
                    <span className="badge badge-outline">
                      {block.value.status?.description ||
                        block.value.status ||
                        block.value.verdict ||
                        'Completed'}
                    </span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-4">
                    <div className="rounded-xl bg-base-100 p-3">
                      <p className="text-xs uppercase tracking-wider text-base-content/50">
                        Passed
                      </p>
                      <p className="mt-1 font-semibold">
                        {block.value.passed ?? block.value.accepted ?? '--'}
                      </p>
                    </div>

                    <div className="rounded-xl bg-base-100 p-3">
                      <p className="text-xs uppercase tracking-wider text-base-content/50">
                        Total
                      </p>
                      <p className="mt-1 font-semibold">
                        {block.value.total ?? block.value.totalTests ?? '--'}
                      </p>
                    </div>

                    <div className="rounded-xl bg-base-100 p-3">
                      <p className="text-xs uppercase tracking-wider text-base-content/50">
                        Runtime
                      </p>
                      <p className="mt-1 font-semibold">
                        {block.value.runtime || block.value.time || '--'}
                      </p>
                    </div>

                    <div className="rounded-xl bg-base-100 p-3">
                      <p className="text-xs uppercase tracking-wider text-base-content/50">
                        Memory
                      </p>
                      <p className="mt-1 font-semibold">
                        {block.value.memory || '--'}
                      </p>
                    </div>
                  </div>

                  {Array.isArray(block.value.tests) && block.value.tests.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {block.value.tests.map((t, index) => (
                        <div
                          key={index}
                          className="rounded-xl bg-base-100 p-3 text-sm"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-medium">Test {index + 1}</span>
                            <span
                              className={`badge ${
                                t.status?.id === 3 || /accepted/i.test(t.status || '')
                                  ? 'badge-success'
                                  : 'badge-error'
                              }`}
                            >
                              {t.status?.description || t.status || '--'}
                            </span>
                          </div>

                          <div className="grid gap-2 md:grid-cols-2">
                            <div>
                              <p className="text-xs uppercase tracking-wider text-base-content/50">
                                Expected
                              </p>
                              <pre className="whitespace-pre-wrap font-mono text-xs">
                                {t.expected_output || t.expected || '--'}
                              </pre>
                            </div>

                            <div>
                              <p className="text-xs uppercase tracking-wider text-base-content/50">
                                Actual
                              </p>
                              <pre className="whitespace-pre-wrap font-mono text-xs">
                                {t.actual_output || t.output || '--'}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {block.value.message && (
                    <div className="mt-4 rounded-xl bg-error/10 p-3 text-sm text-error">
                      {block.value.message}
                    </div>
                  )}
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-300">
      <div className="mx-auto max-w-[1700px] px-3 py-3 lg:px-5">
        <div className="mb-3 flex flex-col gap-2 rounded-3xl border border-base-300 bg-base-100 px-5 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-base-content/50">
              Problem Workspace
            </p>
            <h1 className="text-2xl font-bold tracking-tight">
              {problem.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`badge ${difficultyBadgeClass(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            <span className="badge badge-outline">{problem.tags}</span>
            <span className="badge badge-ghost">User: {user?.firstName || 'Guest'}</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
          <section className="lg:sticky lg:top-4 lg:h-[calc(100vh-5.75rem)]">
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-xl">
              <div className="border-b border-base-300 px-4 py-3">
                <div className="tabs tabs-boxed bg-base-200 p-1">
                  {LEFT_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`tab capitalize ${activeLeftTab === tab ? 'tab-active' : ''}`}
                      onClick={() => setActiveLeftTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                {renderLeftTab()}
              </div>
            </div>
          </section>

          <section className="lg:sticky lg:top-4 lg:h-[calc(100vh-5.75rem)]">
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-xl">
              <div className="border-b border-base-300 px-4 py-3">
                <div className="tabs tabs-boxed bg-base-200 p-1">
                  {RIGHT_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`tab capitalize ${activeRightTab === tab ? 'tab-active' : ''}`}
                      onClick={() => setActiveRightTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {renderRightTab()}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProblemPage;