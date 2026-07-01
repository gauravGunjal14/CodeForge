import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axiosClient from '../utils/axiosClient';
import { useSelector } from 'react-redux';
import ChatAI from '../components/ChatAI';
import Navbar from "../components/Navbar";
import { Group, Panel, Separator } from "react-resizable-panels";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

const LEFT_TABS = ['description', 'editorial', 'solutions', 'submissions', 'Forge AI'];
const RIGHT_TABS = ['code', 'testcase', 'result'];

const LANGUAGE_OPTIONS = ['JavaScript', 'Java', 'C++'];

const languageToMonaco = (language) => {
  if (language === 'C++') return 'cpp';
  if (language === 'Java') return 'java';
  return 'javascript';
};

const languageMap = {
  "C++": "cpp",
  "Java": "java",
  "javascript": "javascript",
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
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async (code) => {
    await navigator.clipboard.writeText(code);

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

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
  const starterLanguages = safeArray(problem?.startCode);
  const solutionLanguages = safeArray(problem?.referenceSolution);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-300 p-4">
        <div className="mx-auto max-w-400">
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
              <div className="skeleton h-150 w-full" />
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
    if (activeLeftTab === "description") {
      return (
        <div className="space-y-8 pb-10">

          {/* Header */}

          <div className="space-y-6">

            <div className="flex flex-wrap items-center gap-3">

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border
                  ${difficultyBadgeClass(problem.difficulty)}
                `}
              >
                {problem.difficulty}
              </span>

              <span className="px-3 py-1 rounded-full text-xs border border-zinc-700 bg-zinc-900 text-zinc-300">
                {problem.tags}
              </span>

              <span className="px-3 py-1 rounded-full text-xs bg-zinc-900 text-zinc-400">
                {visibleExamples.length} Examples
              </span>

              <span className="px-3 py-1 rounded-full text-xs bg-zinc-900 text-zinc-400">
                {problem.hiddenTestCasesCount} Hidden
              </span>

            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-100">
                {problem.title}
              </h1>

              <div className="mt-5 h-px bg-zinc-500" />
            </div>

            <p className="whitespace-pre-wrap leading-8 text-zinc-300">
              {problem.description}
            </p>
          </div>

          {/* Examples */}

          <div className="space-y-5">

            <h3 className="text-2xl font-bold">
              Examples
            </h3>

            {visibleExamples.length === 0 ? (
              <div
                className="rounded-[28px] border border-zinc-900 bg-zinc-950 overflow-hidden shadow-xl"
              >
                No examples added yet.
              </div>
            ) : (
              visibleExamples.map(
                (example, index) => (
                  <div
                    key={`${example.input}-${index}`}
                    className="rounded-3xl border border-base-300 bg-base-300/40 overflow-hidden "
                  >
                    <div className="px-5 py-4 border-b border-base-300 bg-base-200/60">

                      <h4 className="font-semibold">
                        Example {index + 1}
                      </h4>

                    </div>

                    <div className="p-5 space-y-4">

                      <div>
                        <p className="text-xs uppercase tracking-wider text-base-content/50 mb-2">
                          Input
                        </p>

                        <pre
                          className="rounded-2xl bg-base-100 p-4 overflow-x-auto text-sm font-mono"
                        >
                          {example.input}
                        </pre>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-base-content/50 mb-2">
                          Output
                        </p>

                        <pre
                          className="rounded-2xl bg-base-100 p-4 overflow-x-auto text-sm font-mono"
                        >
                          {example.output}
                        </pre>
                      </div>

                      {example.explanation && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-base-content/50 mb-2">
                            Explanation
                          </p>

                          <div
                            className="rounded-2xl bg-base-100 p-4 leading-7 text-sm text-base-content/80 "
                          >
                            {example.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      );
    }

    if (activeLeftTab === "editorial") {
      return (
        <div className="space-y-8 pb-10">

          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              Editorial
            </h2>

            <p className="mt-3 text-zinc-400 leading-7">
              Detailed explanations, approaches and solution walkthroughs for this problem.
            </p>

            <div
              className="mt-5 h-px bg-zinc-500"
            />
          </div>

          <div
            className="rounded-[28px] border border-zinc-800 bg-card p-10 "
          >
            <h3 className="text-xl font-semibold text-zinc-100">
              Editorial Coming Soon...
            </h3>

            <p className="mt-4 max-w-2xl text-zinc-400 leading-7">
              The editorial feature is currently unavailable for this problem.
              Future updates will include detailed written explanations,
              complexity analysis, alternative approaches, and video solution walkthroughs...
            </p>
          </div>
        </div>
      );
    }

    if (activeLeftTab === "solutions") {
      return (
        <div className="space-y-8 pb-10">

          {/* Header */}

          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              Solutions
            </h2>

            <p className="mt-3 text-zinc-400 leading-7">
              Reference implementations for this problem in different programming languages.
            </p>

            <div className="mt-5 h-px bg-zinc-500" />
          </div>

          {/* No Solutions */}

          {solutionLanguages.length === 0 ? (
            <div className="rounded-[28px] border border-zinc-800 bg-card p-10">
              <h3 className="text-xl font-semibold text-zinc-100">
                Solutions Coming Soon...
              </h3>

              <p className="mt-4 max-w-2xl text-zinc-400 leading-7">
                Reference solutions for this problem are not available yet.
                Future updates will include optimized solutions, alternative
                approaches, and implementations in multiple languages.
              </p>
            </div>
          ) : (
            <>
              {/* Language Switcher */}

              <div className="flex flex-wrap gap-3">

                {solutionLanguages.map((item) => (
                  <button
                    key={item.language}
                    onClick={() =>
                      setSelectedSolutionLanguage(
                        item.language
                      )
                    }
                    className={`px-4 py-2 rounded-xl border transition-all duration-300
                      ${selectedSolutionLanguage ===
                        item.language
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-zinc-800 bg-card text-zinc-400 hover:text-white"
                      }
                `}
                  >
                    {item.language}
                  </button>
                ))}

              </div>

              {/* Solution Card */}

              <div
                className="rounded-[28px] border border-zinc-800 bg-card overflow-hidden "
              >
                <div
                  className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between "
                >
                  <h3 className="font-semibold text-lg">
                    Reference Solution
                  </h3>

                  <span
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {currentReferenceSolution.language}
                  </span>
                </div>

                <div className="relative">

                  <button
                    onClick={() =>
                      handleCopy(
                        currentReferenceSolution.completeCode
                      )
                    }
                    className="absolute top-4 right-4 z-10 btn btn-sm bg-zinc-800 border-zinc-700 hover:bg-zinc-700 "
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>

                  <SyntaxHighlighter
                    language={languageMap[currentReferenceSolution.language.toLowerCase()] || "javascript"}
                    style={oneDark}
                    showLineNumbers
                    wrapLongLines
                    customStyle={{
                      margin: 0,
                      padding: "24px",
                      background: "#0B0B0D",
                      fontSize: "14px",
                      borderRadius: "0px"
                    }}
                    lineNumberStyle={{
                      color: "#52525b",
                      minWidth: "2.5em"
                    }}
                  >
                    {currentReferenceSolution.completeCode}
                  </SyntaxHighlighter>

                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    if (activeLeftTab === 'submissions') {
      return (
        <div className="space-y-5">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              Submissions
            </h2>

            <p className="mt-3 text-zinc-400 leading-7">
              Review your previous submissions, runtime and memory usage.
            </p>

            <div className="mt-5 h-px bg-zinc-500" />
          </div>

          {loadingSubmissions ? (
            <div className="space-y-4">
              <div className="h-20 rounded-3xl bg-zinc-900 animate-pulse" />
              <div className="h-20 rounded-3xl bg-zinc-900 animate-pulse" />
              <div className="h-20 rounded-3xl bg-zinc-900 animate-pulse" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="rounded-[28px] border border-zinc-800 bg-card p-10">
              <h3 className="text-xl font-semibold text-zinc-100">
                No submissions yet
              </h3>

              <p className="mt-4 max-w-2xl text-zinc-400 leading-7">
                You haven't submitted a solution for this problem yet.
                Submit your code to track your progress and performance.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[28px] border border-zinc-800 bg-card ">
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
                    className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-4 px-6 py-5 border-b border-zinc-800 hover:bg-zinc-900/40 transition-colors "
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

    if (activeLeftTab === 'Forge AI') {
      return (
        <div className="h-full">
          <ChatAI
            problem={problem}
            selectedLanguage={selectedLanguage}
          />
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
              {visibleExamples.length} visible / {problem.hiddenTestCasesCount} hidden
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
                              className={`badge ${t.status?.id === 3 || /accepted/i.test(t.status || '')
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
      <Navbar />
      <div className="mx-auto h-[90vh] max-w-425 px-3 py-3 lg:px-5">
        <Group
          direction="horizontal"
          className="h-[calc(90vh-2.5rem)] gap-2"
        >

          <Panel
            defaultSize={48}
            minSize={30}
          >
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
          </Panel>

          <Separator className="group w-2 flex items-center justify-center">
            <div className="h-24 w-1 rounded-full bg-zinc-700 group-hover:bg-primary transition-all" />
          </Separator>

          <Panel
            defaultSize={52}
            minSize={30}
          >
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
          </Panel>
        </Group>
      </div>
    </div>
  );
}

export default ProblemPage;