import Card from '../ui/Card';

const ACCENTS = {
  indigo: 'bg-indigo-500/15 text-indigo-300',
  cyan: 'bg-cyan-400/15 text-cyan-300',
  amber: 'bg-amber-400/15 text-amber-300',
  emerald: 'bg-emerald-400/15 text-emerald-300',
  rose: 'bg-rose-500/15 text-rose-300',
};

export default function StatCard({ label, value, icon: Icon, accent = 'indigo', trend }) {
  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${ACCENTS[accent]}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend.startsWith('-') ? 'text-rose-400' : 'text-emerald-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-display font-semibold text-mist-100">{value}</p>
      <p className="text-sm text-mist-400 mt-1">{label}</p>
    </Card>
  );
}
