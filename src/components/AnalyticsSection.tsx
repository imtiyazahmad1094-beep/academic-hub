import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  Layers, 
  Globe, 
  FileText, 
  Users, 
  CheckCircle2 
} from 'lucide-react';
import { AcademicAbstract, AcademicProgram } from '../types';
import { TranslationDict } from '../utils/translations';
import { MetricSummaryBoxes } from './MetricSummaryBoxes';

interface AnalyticsSectionProps {
  programs: AcademicProgram[];
  abstracts: AcademicAbstract[];
  t: TranslationDict;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  programs,
  abstracts,
  t,
}) => {
  // Mode distribution
  const onlineCount = programs.filter(p => p.mode === 'Online').length;
  const offlineCount = programs.filter(p => p.mode === 'Offline').length;

  const modeData = [
    { name: 'Online Mode', value: onlineCount, color: '#0ea5e9' },
    { name: 'Offline / On-Site', value: offlineCount, color: '#f59e0b' }
  ];

  // Abstract Status distribution
  const statusCounts: Record<string, number> = {};
  abstracts.forEach(a => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });

  const statusData = Object.keys(statusCounts).map(status => ({
    name: status,
    count: statusCounts[status]
  }));

  // Topic distribution
  const topicCounts: Record<string, number> = {};
  programs.forEach(p => {
    p.themes?.forEach(theme => {
      topicCounts[theme] = (topicCounts[theme] || 0) + 1;
    });
  });

  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic, count]) => ({ topic, count }));

  // Word count average
  const totalWords = abstracts.reduce((acc, a) => acc + (a.wordCount || 0), 0);
  const avgWordCount = abstracts.length > 0 ? Math.round(totalWords / abstracts.length) : 0;

  // Accepted rate
  const acceptedCount = abstracts.filter(a => a.status === 'Accepted').length;
  const acceptanceRate = abstracts.length > 0 ? Math.round((acceptedCount / abstracts.length) * 100) : 0;

  // Mock monthly trajectory
  const monthlyData = [
    { month: 'Jun', events: 2, abstracts: 4 },
    { month: 'Jul', events: 3, abstracts: 7 },
    { month: 'Aug', events: 5, abstracts: 12 },
    { month: 'Sep', events: programs.length, abstracts: abstracts.length },
    { month: 'Oct', events: 6, abstracts: 15 },
    { month: 'Nov', events: 4, abstracts: 10 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div 
        className="section-box-glass section-box-analytics p-6 sm:p-7 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)] relative overflow-hidden"
        style={{ borderRadius: '12px' }}
      >
        {/* Ambient Purple Glow */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 text-xs font-bold mb-2 border border-purple-500/30">
              <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
              <span>Real-Time Academic Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white neon-glow-purple">
              {t.analytics}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
              Deep dive into program modalities, abstract peer review progression, and domain metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span 
              className="px-3 py-1.5 bg-purple-500/10 text-purple-800 dark:text-purple-300 text-xs font-bold border border-purple-500/30 shadow-2xs"
              style={{ borderRadius: '10px' }}
            >
              Live Index
            </span>
          </div>
        </div>
      </div>

      {/* Glowing Glassmorphic Metric Summary Boxes */}
      <MetricSummaryBoxes programs={programs} abstracts={abstracts} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Modality Donut Chart */}
        <div 
          className="lg:col-span-4 section-box-glass p-6 border-[1.5px] border-purple-500/40 shadow-[0_0_14px_rgba(168,85,247,0.14)] flex flex-col justify-between"
          style={{ borderRadius: '12px' }}
        >
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Modality Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Online Virtual vs. On-Site Physical Venues
            </p>
          </div>

          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {modeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-around text-xs font-bold pt-2 border-t border-purple-500/20">
            <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400">
              <span className="w-3 h-3 rounded-full bg-sky-500" />
              <span>Online ({onlineCount})</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Offline ({offlineCount})</span>
            </div>
          </div>
        </div>

        {/* Abstract Status Bar Chart */}
        <div 
          className="lg:col-span-8 section-box-glass p-6 border-[1.5px] border-purple-500/40 shadow-[0_0_14px_rgba(168,85,247,0.14)] flex flex-col justify-between"
          style={{ borderRadius: '12px' }}
        >
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Abstract Peer Review Pipeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Current lifecycle status across all submitted academic works
            </p>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Activity Volume */}
        <div 
          className="lg:col-span-12 section-box-glass p-6 border-[1.5px] border-purple-500/40 shadow-[0_0_14px_rgba(168,85,247,0.14)]"
          style={{ borderRadius: '12px' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Academic Event &amp; Submission Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monthly symposium and abstract submissions curve
              </p>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAbstracts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="abstracts" stroke="#a855f7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAbstracts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
