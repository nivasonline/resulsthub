import { useOutletContext } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Topbar from '../components/dashboard/Topbar';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import Badge from '../components/ui/Badge';
import { useFetch } from '../hooks/useFetch';
import { analyticsService } from '../services/analyticsService';

const PIE_COLORS = ['#6366f1', '#22d3ee', '#fbbf24', '#34d399', '#f43f5e', '#818cf8'];

const CHART_TOOLTIP_STYLE = {
  background: '#121729',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  fontSize: 12,
  color: '#e8eaf7',
};

export default function AdminAnalytics() {
  const { openMobileSidebar } = useOutletContext();

  const { data: deptStats, loading: deptLoading, error: deptError } = useFetch(
    () => analyticsService.getDepartmentStats(),
    []
  );
  const { data: semStats, loading: semLoading, error: semError } = useFetch(
    () => analyticsService.getSemesterStats(),
    []
  );
  const { data: toppers, loading: toppersLoading } = useFetch(
    () => analyticsService.getToppers({ limit: 8 }),
    []
  );

  const loading = deptLoading || semLoading;
  const error = deptError || semError;

  return (
    <>
      <Topbar
        title="Analytics"
        subtitle="Department and semester-wide performance breakdown"
        onOpenMobile={openMobileSidebar}
      />

      <div className="p-5 lg:p-8 flex-1">
        {loading && <Loader label="Crunching the numbers…" />}
        {error && <ErrorState description={error} />}

        {!loading && !error && (
          <div className="grid lg:grid-cols-2 gap-5 mb-5">
            <Card className="p-6">
              <h3 className="font-display font-semibold text-mist-100 mb-5">
                Students by Department
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={deptStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="department" tick={{ fill: '#a3addb', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#a3addb', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="studentCount" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="font-display font-semibold text-mist-100 mb-5">
                Students by Semester
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={semStats}
                    dataKey="studentCount"
                    nameKey="semester"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label={(entry) => `Sem ${entry.semester}`}
                    labelLine={false}
                  >
                    {(semStats || []).map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        <Card className="p-6">
          <h3 className="font-display font-semibold text-mist-100 mb-4">Topper List</h3>
          {toppersLoading ? (
            <Loader label="Loading toppers…" />
          ) : toppers && toppers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-3 py-2 font-medium text-mist-300">Rank</th>
                    <th className="text-left px-3 py-2 font-medium text-mist-300">Name</th>
                    <th className="text-left px-3 py-2 font-medium text-mist-300">Department</th>
                    <th className="text-left px-3 py-2 font-medium text-mist-300">Semester</th>
                    <th className="text-left px-3 py-2 font-medium text-mist-300">SGPA</th>
                  </tr>
                </thead>
                <tbody>
                  {toppers.map((s, idx) => (
                    <tr key={s.id} className="border-b border-white/5 last:border-0">
                      <td className="px-3 py-2.5 text-mist-400">#{idx + 1}</td>
                      <td className="px-3 py-2.5 text-mist-100">{s.name}</td>
                      <td className="px-3 py-2.5 text-mist-300">{s.department}</td>
                      <td className="px-3 py-2.5 text-mist-300">{s.semester}</td>
                      <td className="px-3 py-2.5">
                        <Badge variant="info">{s.sgpa}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-mist-400 py-6 text-center">No published results yet.</p>
          )}
        </Card>
      </div>
    </>
  );
}
