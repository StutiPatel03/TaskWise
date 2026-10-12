export default function DataQuality({ analysis, loading }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Analyzing data quality...
        </p>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Data Quality Report
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Upload an Excel or CSV file to review missing values,
          duplicate records, and invalid data.
        </p>
      </div>
    )
  }

  const quality = analysis.data_quality

  const metrics = [
    {
      label: 'Missing cells',
      value: quality.missing_cells_before_cleaning ?? 0,
      description: 'Missing values detected before cleaning',
    },
    {
      label: 'Duplicate records removed',
      value: quality.exact_duplicates_removed ?? 0,
      description: 'Exact duplicate rows removed',
    },
    {
      label: 'Invalid values found',
      value: quality.invalid_values_found ?? 0,
      description: 'Invalid entries identified during validation',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">
          Data Quality Report
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Review the quality of your uploaded student records.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">
              {metric.label}
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {metric.value}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {metric.description}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h4 className="font-semibold text-slate-900">
          Processing summary
        </h4>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your spreadsheet has been processed by the backend.
          The metrics above describe missing cells, exact duplicates,
          and invalid values identified during processing.
        </p>
      </div>
    </div>
  )
}
