import DataQuality from './components/DataQuality'
import AcademicAnalytics from './components/AcademicAnalytics'
import AIassistant from './components/AIassistant'
import StudentCharts from './components/StudentCharts'
import { useState, useEffect } from 'react'
import {
  GraduationCap,
  LayoutDashboard,
  Upload,
  Users,
  ChartColumn,
  MessageCircle,
  FileSpreadsheet,
  ArrowUpRight,
  Menu,
  X,
} from 'lucide-react'

const navigation = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Data Cleaning', icon: FileSpreadsheet },
  { label: 'Analytics', icon: ChartColumn },
  { label: 'AI Assistant', icon: MessageCircle },
]

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [analysis, setAnalysis] = useState(null)

  // Clear any previous dataset when the app first loads.
  useEffect(() => {
    fetch('http://localhost:5000/api/reset', {
      method: 'POST',
      credentials: 'include',
    }).catch((error) => {
      console.error('Could not reset the previous session:', error)
    })
  }, [])

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  setFileName(file.name)
  setError('')
  setAnalysis(null)
  setLoading(true)

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('http://localhost:5000/api/analyze', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || result.message || 'Analysis failed.')
    }

    setAnalysis(result)
  } catch (err) {
    setError(
      err.message === 'Failed to fetch'
        ? 'Cannot reach Flask. Check that the backend is running.'
        : err.message
    )
  } finally {
    setLoading(false)
    event.target.value = ''
  }
}

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {mobileMenu && (
        <button
          className="fixed inset-0 z-40 bg-slate-950/40 md:hidden"
          onClick={() => setMobileMenu(false)}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white p-5 transition-transform md:translate-x-0 ${
          mobileMenu ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-10 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
            <GraduationCap size={25} />
          </div>
          <div>
            <h1 className="font-bold tracking-tight">TaskWise</h1>
            <p className="text-xs text-slate-500">Insights made simple</p>
          </div>
          <button
            className="ml-auto md:hidden"
            onClick={() => setMobileMenu(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                setActivePage(label)
                setMobileMenu(false)
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                activePage === label
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-slate-900 p-4 text-white">
          <p className="text-sm font-semibold">Your data, understood.</p>
          <p className="mt-2 text-xs leading-5 text-slate-300">
            Upload student records to begin exploring insights.
          </p>
        </div>
      </aside>

      <main className="min-h-screen md:ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
              onClick={() => setMobileMenu(true)}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>
            <div>
              <p className="text-xs text-slate-500">Workspace / {activePage}</p>
              <h2 className="mt-1 text-lg font-semibold">{activePage}</h2>
            </div>
          </div>
          <div className="rounded-full bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">
            User Workspace
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-7 p-5 sm:p-8">
          {/* qwert */}
          {/* Shared upload section — available on every page */}
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-indigo-600">
                STUDENT PERFORMANCE PLATFORM
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Understand your students.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Clean your records, discover patterns, and ask questions
                about your student data in one place.
              </p>
            </div>

            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
              <Upload size={17} />
              Upload Excel
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </section>

          {fileName && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-800">
              Selected file: <strong>{fileName}</strong>
            </div>
          )}

          {loading && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
              Processing your student data...
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Overview page */}
          {activePage === 'Overview' && (
            <>
              {analysis && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="font-semibold text-slate-900">
                    Backend analysis response
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Temporary debugging section. We will remove it during final polish.
                  </p>
                  <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-4 text-xs text-green-300">
                    {JSON.stringify(analysis, null, 2)}
                  </pre>
                </section>
              )}

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    title: 'Total Students',
                    value: analysis ? analysis.summary.total_students : '—',
                    icon: Users,
                  },
                  {
                    title: 'Average Marks',
                    value: analysis
                      ? `${analysis.summary.average_percentage}%`
                      : '—',
                    icon: ChartColumn,
                  },
                  {
                    title: 'Invalid Values',
                    value: analysis
                      ? analysis.data_quality.invalid_values_found
                      : '—',
                    icon: FileSpreadsheet,
                  },
                  {
                    title: 'Insights Generated',
                    value: analysis
                      ? Object.keys(analysis.department_averages ?? {}).length +
                        Object.keys(analysis.gender_distribution ?? {}).length +
                        Object.keys(analysis.result_distribution ?? {}).length
                      : '—',
                    icon: MessageCircle,
                  },
                ].map(({ title, value, icon: Icon }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">{title}</span>
                      <span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                        <Icon size={19} />
                      </span>
                    </div>
                    <p className="mt-5 text-3xl font-bold text-slate-900">
                      {value}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                      <ArrowUpRight size={14} />
                      {analysis
                        ? 'Calculated from uploaded data'
                        : 'Upload data to see insights'}
                    </p>
                  </div>
                ))}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    <FileSpreadsheet size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Data quality at a glance
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      A quick check of your uploaded records.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      label: 'Missing cells',
                      value: analysis
                        ? analysis.data_quality.missing_cells_before_cleaning
                        : '—',
                    },
                    {
                      label: 'Duplicate records removed',
                      value: analysis
                        ? analysis.data_quality.exact_duplicates_removed
                        : '—',
                    },
                    {
                      label: 'Invalid values found',
                      value: analysis
                        ? analysis.data_quality.invalid_values_found
                        : '—',
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">{label}</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActivePage('Data Cleaning')}
                  className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Open detailed data quality report →
                </button>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-semibold text-slate-900">Ask your data</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Explore your student records with the AI Assistant.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    'How many students are there?',
                    'What is the female-to-male ratio?',
                    'Which department has the highest average marks?',
                  ].map((question) => (
                    <button
                      key={question}
                      onClick={() => setActivePage('AI Assistant')}
                      className="rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      {question}
                    </button>
                  ))}
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  Select a suggested question to open the AI Assistant.
                </p>
              </section>
            </>
          )}

          {/* Data Cleaning page */}
          {activePage === 'Data Cleaning' && (
            <DataQuality analysis={analysis} loading={loading} />
          )}

          {/* Analytics page */}
          {activePage === 'Analytics' && (
            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Student analytics
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Visual summaries of your uploaded student records.
                    </p>
                  </div>
                  <ChartColumn className="text-indigo-600" size={22} />
                </div>

                <StudentCharts analysis={analysis} />
              </section>

              <AcademicAnalytics analysis={analysis} />
            </div>
          )}

          {/* AI Assistant page */}
          {activePage === 'AI Assistant' && (
            <AIassistant analysis={analysis} />
          )}

          {/* qwert */}
        </div>
      </main>
    </div>
  )
}

export default App