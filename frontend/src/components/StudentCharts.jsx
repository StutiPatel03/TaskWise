
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
)

const colors = [
  '#6366f1',
  '#f472b6',
  '#10b981',
  '#f59e0b',
  '#38bdf8',
  '#a78bfa',
  '#fb7185',
  '#14b8a6',
]

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
  },
}

const barOptions = {
  ...chartOptions,
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
    },
  },
}

function entriesOf(value) {
  if (Array.isArray(value)) {
    return value.map((item, index) => [
      String(item?.label ?? item?.name ?? item?.year ?? index + 1),
      Number(item?.value ?? item?.count ?? 0),
    ])
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).map(([key, item]) => [
      key,
      typeof item === 'number' ? item : Number(item?.value ?? item?.count ?? 0),
    ])
  }

  return []
}

function simpleBarData(value, label) {
  const entries = entriesOf(value)

  return {
    labels: entries.map(([key]) => key),
    datasets: [
      {
        label,
        data: entries.map(([, number]) => number),
        backgroundColor: '#6366f1',
        borderRadius: 6,
      },
    ],
  }
}

function groupedBarData(value) {
  if (!value || typeof value !== 'object') return null

  const rows = Array.isArray(value)
    ? value.map((item, index) => [
        String(item?.label ?? item?.year ?? item?.department ?? index + 1),
        item,
      ])
    : Object.entries(value)

  const usableRows = rows.filter(
    ([, item]) => item && typeof item === 'object' && !Array.isArray(item),
  )

  if (!usableRows.length) return null

  const keys = [
    ...new Set(usableRows.flatMap(([, item]) =>
      Object.keys(item).filter((key) => Number.isFinite(Number(item[key]))),
    )),
  ]

  if (!keys.length) return null

  return {
    labels: usableRows.map(([label]) => label),
    datasets: keys.map((key, index) => ({
      label: key.replaceAll('_', ' '),
      data: usableRows.map(([, item]) => {
        const number = Number(item[key])
        return Number.isFinite(number) ? number : null
      }),
      backgroundColor: colors[index % colors.length],
      borderRadius: 5,
    })),
  }
}

function ChartCard({ title, description, children }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5">
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      {description && (
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      )}
      <div className="mt-5 h-64">{children}</div>
    </section>
  )
}

function EmptyChart({ label = 'No data available for this chart.' }) {
  return (
    <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
      {label}
    </div>
  )
}

export default function StudentCharts({ analysis }) {
  if (!analysis) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-sm font-medium text-slate-700">
          Your charts will appear here
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Upload an Excel file to explore student performance.
        </p>
      </div>
    )
  }

  const data = {
  ...analysis,
  ...(analysis.academic_analytics || {}),
  }

  const departmentData = simpleBarData(
    data.department_averages,
    'Average marks',
  )

  const genderData = {
    labels: Object.keys(data.gender_distribution ?? {}),
    datasets: [
      {
        data: Object.values(data.gender_distribution ?? {}),
        backgroundColor: ['#6366f1', '#f472b6', '#34d399'],
        borderWidth: 0,
      },
    ],
  }

  const resultData = {
    labels: Object.keys(data.result_distribution ?? {}),
    datasets: [
      {
        data: Object.values(data.result_distribution ?? {}),
        backgroundColor: ['#10b981', '#f87171', '#94a3b8'],
        borderWidth: 0,
      },
    ],
  }

  const yearData = simpleBarData(
    data.year_distribution,
    'Number of students',
  )

  const yearPassData = simpleBarData(
    data.year_pass_rates,
    'Pass rate',
  )

  const attendanceData = simpleBarData(
    data.attendance_distribution,
    'Number of students',
  )

  const studyHoursData = simpleBarData(
    data.study_hours_distribution,
    'Number of students',
  )

  const backlogData = simpleBarData(
    data.backlog_distribution,
    'Number of students',
  )

  const subjectsByDepartment = groupedBarData(data.subject_by_department)
  const subjectsByYear = groupedBarData(data.subject_by_year)

  const studyHoursMarks = data.study_hours_vs_marks || {}

  const studyHoursMarksData = {
    labels: Object.keys(studyHoursMarks),
    datasets: [
      {
        label: 'Average final percentage',
        data: Object.values(studyHoursMarks).map(
          (item) => item.average_percentage ?? 0,
        ),
        backgroundColor: '#6366f1',
        borderRadius: 6,
      },
    ],
  }


  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Academic Performance
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Compare results across departments, subjects, and academic years.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard
          title="Average marks by department"
          description="Overall average percentage for each department."
        >
          {departmentData.labels.length ? (
            <Bar
              data={departmentData}
              options={{
                ...barOptions,
                plugins: { legend: { display: false } },
                scales: {
                  ...barOptions.scales,
                  y: { beginAtZero: true, max: 100 },
                },
              }}
            />
          ) : <EmptyChart />}
        </ChartCard>

        <ChartCard
          title="Subject performance by department"
          description="Compare subject averages across departments."
        >
          {subjectsByDepartment ? (
            <Bar data={subjectsByDepartment} options={barOptions} />
          ) : <EmptyChart label="Subject-by-department data is not available in the response." />}
        </ChartCard>

        <ChartCard
          title="Subject performance by academic year"
          description="Uses the dataset's Current_Year grouping."
        >
          {subjectsByYear ? (
            <Bar data={subjectsByYear} options={barOptions} />
          ) : <EmptyChart label="Subject-by-year data is not available in the response." />}
        </ChartCard>

        <ChartCard
          title="Student count by academic year"
          description="Number of students in each Current_Year group."
        >
          {yearData.labels.length ? (
            <Bar data={yearData} options={barOptions} />
          ) : <EmptyChart />}
        </ChartCard>

        <ChartCard
          title="Pass rate by academic year"
          description="Compare pass rates across Current_Year groups."
        >
          {yearPassData.labels.length ? (
            <Bar
              data={yearPassData}
              options={{
                ...barOptions,
                scales: {
                  ...barOptions.scales,
                  y: { beginAtZero: true, max: 100 },
                },
              }}
            />
          ) : <EmptyChart />}
        </ChartCard>

        <ChartCard title="Student result distribution">
          <Doughnut data={resultData} options={chartOptions} />
        </ChartCard>

        <ChartCard title="Gender distribution">
          <Doughnut data={genderData} options={chartOptions} />
        </ChartCard>
      </div>

      <div>
        <h3 className="text-base font-bold text-slate-900">
          Attendance and Study Patterns
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Explore attendance levels and study-hour patterns in the dataset.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Attendance distribution">
          {attendanceData.labels.length ? (
            <Bar data={attendanceData} options={barOptions} />
          ) : <EmptyChart />}
        </ChartCard>

        <ChartCard title="Study hours distribution">
          {studyHoursData.labels.length ? (
            <Bar data={studyHoursData} options={barOptions} />
          ) : <EmptyChart />}
        </ChartCard>
        <ChartCard
          title="Study hours vs final percentage"
          description="Compare average final marks across daily study-hour groups."
        >
          {studyHoursMarksData.labels.length ? (
            <Bar
              data={studyHoursMarksData}
              options={{
                ...barOptions,
                plugins: {
                  ...barOptions.plugins,
                  legend: { display: false },
                },
                scales: {
                  ...barOptions.scales,
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                      display: true,
                      text: 'Average final percentage',
                    },
                  },
                },
              }}
            />
          ) : (
            <EmptyChart label="Study-hour group data is not available." />
          )}
        </ChartCard>

        <ChartCard title="Previous backlogs distribution">
          {backlogData.labels.length ? (
            <Bar data={backlogData} options={barOptions} />
          ) : <EmptyChart />}
        </ChartCard>
      </div>
    </div>
  )
}
