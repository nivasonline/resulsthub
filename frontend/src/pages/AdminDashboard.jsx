import { useOutletContext } from 'react-router-dom';
import { Users, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import Topbar from '../components/dashboard/Topbar';
import StatCard from '../components/dashboard/StatCard';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import Badge from '../components/ui/Badge';
import { useFetch } from '../hooks/useFetch';
import { analyticsService } from '../services/analyticsService';

export default function AdminDashboard() {
  const { openMobileSidebar } = useOutletContext();

  const { data: overview, loading: overviewLoading, error: overviewError, refetch } = useFetch(
    () => analyticsService.getOverview(),
    []
  );

  const { data: toppers, loading: toppersLoading } = useFetch(
    () => analyticsService.getToppers({ limit: 5 }),
    []
  );

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="Overview of results and student records"
        onOpenMobile={openMobileSidebar}
      />

      <div className="p-5 lg:p-8 flex-1">
        {overviewLoading && <Loader label="Loading overview…" />}
        {overviewError && <ErrorState description={overviewError} onRetry={refetch} />}

        {overview && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Students"
                value={overview.totalStudents.toLocaleString()}
                icon={Users}
                accent="indigo"
              />
              <StatCard
                label="Published Results"
                value={overview.publishedResults.toLocaleString()}
                icon={CheckCircle2}
                accent="emerald"
              />
              <StatCard
                label="Pending Results"
                value={overview.pendingResults.toLocaleString()}
                icon={Clock}
                accent="amber"
              />
              <StatCard
                label="Pass Percentage"
                value={`${overview.passPercentage}%`}
                icon={TrendingUp}
                accent="cyan"
              />
            </div>

            <Card className="p-6">
              <h3 className="font-display font-semibold text-mist-100 mb-4">Top Performers</h3>
              {toppersLoading ? (
                <Loader label="Loading toppers…" />
              ) : toppers && toppers.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {toppers.map((student, idx) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors"
                    >
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                          idx === 0
                            ? 'bg-amber-400/20 text-amber-300'
                            : 'bg-white/5 text-mist-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-mist-100 truncate">{student.name}</p>
                        <p className="text-xs text-mist-400">
                          {student.department} · Sem {student.semester}
                        </p>
                      </div>
                      <Badge variant="info">SGPA {student.sgpa}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-mist-400 py-6 text-center">
                  No published results yet.
                </p>
              )}
            </Card>
          </>
        )}
      </div>
    </>
  );
}
