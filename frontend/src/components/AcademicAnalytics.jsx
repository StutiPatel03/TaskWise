export default function AcademicAnalytics({ analysis }) {
  if (!analysis) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Academic Insights
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Upload a student dataset to explore academic performance
          across subjects, departments, and academic years.
        </p>
      </div>
    )
  }

  const analytics = analysis.analysis ?? analysis
  const summary = analytics.summary ?? {}
  const academic = analysis?.academic_analytics || analysis || {}
  
  const insights = [
    {
      title: 'Overall Average',
      value:
        summary.average_percentage != null
          ? `${Number(summary.average_percentage).toFixed(2)}%`
          : '—',
      description: 'Average student percentage across the dataset',
    },
    {
      title: 'Total Students',
      value: summary.total_students ?? '—',
      description: 'Student records included in the analysis',
    },
    {
      title: 'Departments Analysed',
      value: Object.keys(analytics.department_averages ?? {}).length,
      description: 'Departments represented in the dataset',
    },
    {
      title: 'Academic Years',
      value: Object.keys(academic.year_distribution ?? {}).length,
      description: 'Academic-year groups represented in the dataset',
    },
  ]

  


  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-slate-900">
          Academic Insights
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          A quick overview of student performance and dataset coverage.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {insights.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">{item.title}</p>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {item.value}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
