import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  Eye, 
  Edit3, 
  X, 
  Calendar, 
  Clock, 
  Laptop, 
  HardDrive, 
  Activity, 
  FileText, 
  ArrowLeft,
  ChevronRight,
  Shield,
  KeyRound,
  ExternalLink,
  Sparkles,
  Globe,
  LogOut
} from 'lucide-react';
import { AdminUserLog, AuthUser } from '../types';
import { INITIAL_ADMIN_USERS_A_TO_Z } from '../data/adminUserData';
import { UserProfileIndicator } from './UserProfileIndicator';

interface AdminDashboardViewProps {
  currentUser: AuthUser | null;
  onExitAdmin: () => void;
  onLogout: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  onExitAdmin,
  onLogout,
}) => {
  const effectiveUser: AuthUser = currentUser || {
    id: 'admin-super-01',
    name: 'Prof. Dr. Tariq Al-Mansoor',
    email: 'tariq.almansoor@alazhar.edu.eg',
    role: 'Super Admin',
    institution: 'Executive Academic Council & Governance Committee',
    createdAt: '2024-08-15T08:00:00Z',
    permissionTier: 'Super Admin Tier 1',
    isAdmin: true
  };

  const [usersList, setUsersList] = useState<AdminUserLog[]>(INITIAL_ADMIN_USERS_A_TO_Z);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'a-z' | 'z-a' | 'events-high' | 'login-recent'>('a-z');
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<AdminUserLog | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Compute filtered & sorted users
  const filteredUsers = useMemo(() => {
    let result = usersList.filter(user => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.ipAddress.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q) ||
        user.permissionTier.toLowerCase().includes(q);

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesTier = tierFilter === 'all' || user.permissionTier.includes(tierFilter);
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesTier && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortOrder === 'a-z') return a.name.localeCompare(b.name);
      if (sortOrder === 'z-a') return b.name.localeCompare(a.name);
      if (sortOrder === 'events-high') return b.analyticalEventsCount - a.analyticalEventsCount;
      if (sortOrder === 'login-recent') return b.lastLogin.localeCompare(a.lastLogin);
      return 0;
    });

    return result;
  }, [usersList, searchQuery, roleFilter, tierFilter, statusFilter, sortOrder]);

  // Aggregate Metrics
  const totalScholars = usersList.length;
  const activeRolesCount = usersList.reduce((acc, u) => acc + u.activeAbstractsCount, 0);
  const totalEventsLogged = usersList.reduce((acc, u) => acc + u.analyticalEventsCount, 0);
  const verifiedTiersCount = usersList.filter(u => u.status === 'Active').length;

  const showFeedback = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus as any } : u));
    showFeedback(`User status updated to ${nextStatus}.`);
    if (selectedUserForDetail && selectedUserForDetail.id === userId) {
      setSelectedUserForDetail(prev => prev ? { ...prev, status: nextStatus as any } : null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID,Name,Email,Role,Permission Tier,Active Abstracts,Assigned Reviews,Status,Last Login,IP Address,Quota,Analytical Events'];
    const rows = filteredUsers.map(u => 
      `"${u.id}","${u.name}","${u.email}","${u.role}","${u.permissionTier}",${u.activeAbstractsCount},${u.assignedReviewsCount},"${u.status}","${u.lastLogin}","${u.ipAddress}","${u.storageQuotaUsed}",${u.analyticalEventsCount}`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `academic_admin_users_a_to_z_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showFeedback('Exported A-to-Z User Registry CSV successfully.');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner & Exit Button */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-700/80 relative overflow-visible z-30">
        {/* Glow backdrop aura (clipped to rounded-2xl container to avoid horizontal/vertical page scrolling) */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ADMIN CONTROL CENTER</span>
              </span>
              <span className="text-xs font-mono text-slate-300">
                AUDIT REGISTRY // COMPLETE A TO Z
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif tracking-tight text-white">
              Granular User &amp; Permission Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Real-time audit directory for academic registrations, active abstract roles, permission tiers, login timestamps, device sessions, and event metrics.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center shrink-0 flex-wrap">
            <button
              id="btn-export-admin-csv"
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {/* Clean Secondary Utility Group: Return Action + User Profile Indicator & Pop-up + Direct Log Out */}
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <button
                id="btn-exit-admin-view"
                onClick={onExitAdmin}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
                title="Return to Scholar & Symposium View"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Program Register</span>
              </button>

              <UserProfileIndicator
                currentUser={effectiveUser}
                onLogout={onLogout}
                onToggleAdminView={onExitAdmin}
                isAdminActive={true}
                idPrefix="admin"
              />
            </div>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-700/80">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>Total Scholars (A–Z)</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {totalScholars} Accounts
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Active Abstract Roles</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {activeRolesCount} Submissions
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified Status Tiers</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {verifiedTiersCount} / {totalScholars} Active
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Analytical Event Stream</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {totalEventsLogged.toLocaleString()} Events
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionSuccessMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-white/80 dark:border-slate-800 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          
          {/* Search */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="admin-search-users"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, IP, role or tier..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Role Filter */}
          <div className="lg:col-span-3">
            <select
              id="admin-filter-role"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:border-amber-500"
            >
              <option value="all">All Academic Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Program Chair">Program Chair</option>
              <option value="Senior Scholar">Senior Scholar</option>
              <option value="Peer Reviewer">Peer Reviewer</option>
              <option value="Guest Author">Guest Author</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <select
              id="admin-filter-status"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:border-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending Verification">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Sort */}
          <div className="lg:col-span-3">
            <select
              id="admin-sort-order"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:border-amber-500"
            >
              <option value="a-z">Sort: Name (A to Z)</option>
              <option value="z-a">Sort: Name (Z to A)</option>
              <option value="events-high">Sort: Analytical Events (Highest)</option>
              <option value="login-recent">Sort: Most Recent Login</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scholars Directory & Permissions Matrix Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-bold font-serif text-slate-950 dark:text-white">
            Scholars Directory &amp; Permissions Matrix
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-950 dark:bg-sky-950 dark:text-sky-200 border border-sky-300 dark:border-sky-800">
            {filteredUsers.length} Standalone Accounts
          </span>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          Click any card box for deep audit telemetry and granular permission tuning
        </div>
      </div>

      {/* Vertically Stacked Standalone Card Box Containers with Spacious Gap Margins */}
      <div className="space-y-4" id="admin-scholars-box-container-list">
        {filteredUsers.map((user) => {
          const isSuperAdmin = user.role === 'Super Admin';
          const isChair = user.role === 'Program Chair';
          const isReviewer = user.role === 'Peer Reviewer';
          const isGuest = user.role === 'Guest Author';
          const isSuspended = user.status === 'Suspended';
          const isPending = user.status === 'Pending Verification';

          // Role Badge with Low-Opacity Background and Deep Saturated Legible Text
          let roleTagClasses = 'bg-sky-500/10 text-sky-950 dark:text-sky-100 border-sky-500/40';
          if (isSuperAdmin) {
            roleTagClasses = 'bg-amber-500/15 text-amber-950 dark:text-amber-100 border-amber-500/40';
          } else if (isChair) {
            roleTagClasses = 'bg-indigo-500/15 text-indigo-950 dark:text-indigo-100 border-indigo-500/40';
          } else if (isReviewer) {
            roleTagClasses = 'bg-teal-500/15 text-teal-950 dark:text-teal-100 border-teal-500/40';
          } else if (isGuest) {
            roleTagClasses = 'bg-purple-500/15 text-purple-950 dark:text-purple-100 border-purple-500/40';
          }

          // Status Badge with Ultra-Light Mint Background and Bold Dark Emerald-Green Font
          let statusBadgeClasses = 'bg-emerald-50 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-100 border-emerald-300 dark:border-emerald-700';
          let statusDotColor = 'bg-emerald-600 dark:bg-emerald-400';
          if (isPending) {
            statusBadgeClasses = 'bg-amber-50 text-amber-950 dark:bg-amber-950/80 dark:text-amber-100 border-amber-300 dark:border-amber-700';
            statusDotColor = 'bg-amber-600 dark:bg-amber-400';
          } else if (isSuspended) {
            statusBadgeClasses = 'bg-rose-50 text-rose-950 dark:bg-rose-950/80 dark:text-rose-100 border-rose-300 dark:border-rose-700';
            statusDotColor = 'bg-rose-600 dark:bg-rose-400';
          }

          return (
            <div 
              key={user.id}
              id={`admin-user-card-${user.id}`}
              onClick={() => setSelectedUserForDetail(user)}
              className={`p-5 rounded-[12px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-[1.5px] border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-sky-400 dark:hover:border-sky-500 transition-all cursor-pointer group relative overflow-hidden ${
                isSuspended ? 'opacity-80 bg-slate-50/90 dark:bg-slate-950/60' : ''
              }`}
              style={{ borderRadius: '12px' }}
            >
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                
                {/* 1. Scholar / Account Column Block */}
                <div className="flex items-center gap-3.5 min-w-[250px] xl:max-w-[300px]">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm shrink-0 shadow-xs border-2 border-white dark:border-slate-800 ${
                    isSuperAdmin 
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white' 
                      : isChair 
                      ? 'bg-gradient-to-tr from-sky-600 to-indigo-600 text-white' 
                      : isReviewer
                      ? 'bg-gradient-to-tr from-teal-600 to-emerald-600 text-white'
                      : 'bg-gradient-to-tr from-slate-600 to-slate-800 text-white'
                  }`}>
                    {user.name.split(' ').filter(p => !p.includes('.')).map(p => p[0]).slice(0, 2).join('') || 'SC'}
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    <div className="font-extrabold text-base text-slate-950 dark:text-white flex items-center gap-1.5 truncate">
                      <span className="truncate">{user.name}</span>
                      {isSuperAdmin && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-black bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 shrink-0">
                          ROOT
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-mono truncate">
                      {user.email}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>Reg: {user.registrationDate}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Role & Permission Column Block */}
                <div className="space-y-1.5 min-w-[190px]">
                  <div className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Assigned Role
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${roleTagClasses}`}>
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>{user.role}</span>
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{user.permissionTier}</span>
                  </div>
                </div>

                {/* 3. Activity Metrics Block (Abstracts / Reviews) Mini-Subframe */}
                <div className="p-3 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 flex items-center justify-around gap-4 min-w-[170px]">
                  <div className="text-center">
                    <div className="text-base font-black text-slate-950 dark:text-white">
                      {user.activeAbstractsCount}
                    </div>
                    <div className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Abstracts
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-300 dark:bg-slate-600" />
                  <div className="text-center">
                    <div className="text-base font-black text-sky-950 dark:text-sky-300">
                      {user.assignedReviewsCount}
                    </div>
                    <div className="text-[10px] font-extrabold text-sky-800 dark:text-sky-400 uppercase tracking-wider">
                      Reviews
                    </div>
                  </div>
                </div>

                {/* 4. Session Analytics Block */}
                <div className="space-y-1 min-w-[200px] text-xs">
                  <div className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Last Login &amp; Session
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-900 dark:text-slate-100">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{user.lastLogin}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    <Laptop className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate max-w-[170px]">{user.deviceSession}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400">
                    <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{user.ipAddress}</span>
                  </div>
                </div>

                {/* 5. Storage & Status Badges */}
                <div className="space-y-2 min-w-[170px]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Storage Quota</span>
                    <span className="font-mono text-[11px] font-black text-slate-800 dark:text-slate-200">{user.storageQuotaUsed}</span>
                  </div>
                  
                  {/* Clean Storage Progress Line */}
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-500 to-teal-500 rounded-full"
                      style={{ width: `${Math.min(95, Math.max(15, parseInt(user.storageQuotaUsed) * 2))}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    {/* High-Contrast Lifecycle Status Pill (Ultra-light mint background + bold dark emerald string) */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-2xs border ${statusBadgeClasses}`}>
                      <span className={`w-2 h-2 rounded-full ${statusDotColor}`} />
                      <span>{user.status}</span>
                    </span>

                    {/* Analytical Events Tag */}
                    <span className="text-[11px] font-bold font-mono text-slate-600 dark:text-slate-400">
                      {user.analyticalEventsCount} Evt
                    </span>
                  </div>
                </div>

                {/* 6. Action Controls */}
                <div 
                  className="flex items-center gap-2 pt-3 xl:pt-0 border-t xl:border-t-0 border-slate-200/80 dark:border-slate-800 justify-end shrink-0"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    id={`btn-inspect-user-${user.id}`}
                    title="Inspect Granular Audit Log"
                    onClick={() => setSelectedUserForDetail(user)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-sky-950 text-slate-800 hover:text-sky-700 dark:text-slate-200 dark:hover:text-sky-300 font-extrabold text-xs flex items-center gap-1.5 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  <button
                    id={`btn-status-toggle-${user.id}`}
                    title={isSuspended ? 'Reactivate Account Access' : 'Suspend Account Access'}
                    onClick={() => handleToggleUserStatus(user.id, user.status)}
                    className={`px-3 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer border active:scale-95 ${
                      isSuspended 
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100 border-emerald-300' 
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-100 border-rose-300'
                    }`}
                  >
                    {isSuspended ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Reactivate</span>
                      </>
                    ) : (
                      <>
                        <Ban className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        <span>Suspend</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Granular User Details Drawer / Modal */}
      {selectedUserForDetail && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedUserForDetail(null)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[24px] p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-slate-700/80 my-auto text-slate-900 dark:text-white transition-all overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                  {selectedUserForDetail.name.split(' ').filter(p => !p.includes('.')).map(p => p[0]).slice(0, 2).join('') || 'SC'}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white">
                    {selectedUserForDetail.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {selectedUserForDetail.email} • ID: {selectedUserForDetail.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserForDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="overflow-y-auto space-y-4 py-4 pr-1 text-xs">
              {/* Permission & Status Group */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Assigned Role</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedUserForDetail.role}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Permission Tier</span>
                  <div className="font-mono text-sky-600 dark:text-sky-400 font-semibold mt-0.5">
                    {selectedUserForDetail.permissionTier}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Account Status</span>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {selectedUserForDetail.status}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Registration Date</span>
                  <div className="font-mono text-slate-600 dark:text-slate-400 mt-0.5">
                    {selectedUserForDetail.registrationDate}
                  </div>
                </div>
              </div>

              {/* Security & Audit Telemetry */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Security &amp; Device Telemetry</span>
                </h4>
                <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Active Timestamp:</span>
                    <span className="text-slate-800 dark:text-slate-200">{selectedUserForDetail.lastLogin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">IP &amp; Geolocation:</span>
                    <span className="text-slate-800 dark:text-slate-200">{selectedUserForDetail.ipAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Client Agent / Device:</span>
                    <span className="text-slate-800 dark:text-slate-200">{selectedUserForDetail.deviceSession}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cloud Storage Quota:</span>
                    <span className="text-slate-800 dark:text-slate-200">{selectedUserForDetail.storageQuotaUsed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Analytical Events Logged:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedUserForDetail.analyticalEventsCount} Actions</span>
                  </div>
                </div>
              </div>

              {/* Abstract & Editorial Duties */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-500" />
                  <span>Editorial &amp; Submission Workload</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-sky-50/50 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900/40">
                  <div className="text-center p-2 rounded-lg bg-white/70 dark:bg-slate-800/70">
                    <div className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedUserForDetail.activeAbstractsCount}
                    </div>
                    <div className="text-[10px] text-slate-500">Active Abstracts Authored</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/70 dark:bg-slate-800/70">
                    <div className="text-base font-bold text-sky-600 dark:text-sky-400">
                      {selectedUserForDetail.assignedReviewsCount}
                    </div>
                    <div className="text-[10px] text-slate-500">Peer Reviews Assigned</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-4 pt-3.5 flex items-center justify-between gap-3 border-t border-slate-200/80 dark:border-slate-800 text-xs">
              <button
                onClick={() => {
                  handleToggleUserStatus(selectedUserForDetail.id, selectedUserForDetail.status);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer transition-colors"
              >
                {selectedUserForDetail.status === 'Active' ? 'Suspend Access' : 'Reactivate Access'}
              </button>

              <button
                onClick={() => {
                  showFeedback(`Impersonating session for ${selectedUserForDetail.name}`);
                  setSelectedUserForDetail(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white font-semibold cursor-pointer transition-colors"
              >
                Launch Audit Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
