// src/pages/admin/AdminDashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CountUp from 'react-countup';
import {
  PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis,
  ResponsiveContainer, Legend, BarChart, Bar, LineChart, Line
} from 'recharts';
import {
  PeopleAlt, VerifiedUser, WorkspacePremium, PersonOff,
  Today, CalendarViewWeek, CalendarMonth, EmojiEvents, MilitaryTech
} from '@mui/icons-material';
import { fetchPlatformAnalytics } from '../../redux/slices/adminAnalyticsSlice';
import '../../assets/css/AdminDashboard.css';

const COLORS = ['#0057D9', '#34A853', '#EA4335', '#FFBB28', '#00C49F', '#8884d8'];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector((state) => state.adminAnalytics);

  useEffect(() => {
    dispatch(fetchPlatformAnalytics());
  }, [dispatch]);

  if (loading) return <div className="admin-loading-spinner">Loading...</div>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (!data) return null;

  const templateData = Object.entries(data.resumesByTemplate || {}).map(([key, value]) => ({ name: key, value }));
  const donutData = [{ name: 'Downloads', value: data.totalDownloads }, { name: 'Resumes', value: data.totalResumes }];

  const sparkToday = [{ x: 1, y: 4 }, { x: 2, y: 8 }, { x: 3, y: 5 }, { x: 4, y: data.resumesToday }];
  const sparkWeek = [{ x: 1, y: 20 }, { x: 2, y: 45 }, { x: 3, y: 65 }, { x: 4, y: data.resumesThisWeek }];
  const sparkMonth = [{ x: 1, y: 100 }, { x: 2, y: 300 }, { x: 3, y: 420 }, { x: 4, y: data.resumesThisMonth }];

  const userCards = [
    { label: 'Total Users', value: data.totalUsers, color: '#0057D9', icon: <PeopleAlt /> },
    { label: 'Active Users', value: data.activeUsers, color: '#34A853', icon: <VerifiedUser /> },
    { label: 'Free Users', value: data.freeUsers, color: '#8884d8', icon: <PersonOff /> },
    { label: 'Premium Users', value: data.premiumUsers, color: '#FFBB28', icon: <WorkspacePremium /> },
  ];

  const resumeCards = [
    { label: 'Resumes Today', value: data.resumesToday, color: '#E91E63', icon: <Today />, trend: sparkToday },
    { label: 'This Week', value: data.resumesThisWeek, color: '#9C27B0', icon: <CalendarViewWeek />, trend: sparkWeek },
    { label: 'This Month', value: data.resumesThisMonth, color: '#00ACC1', icon: <CalendarMonth />, trend: sparkMonth },
  ];

  return (
    <div className="admin-dashboard">
      <h2 className="admin-dashboard-title">Platform Analytics</h2>

      <div className="admin-stats-grid">
        {userCards.map((card, idx) => (
          <div className="admin-stat-card" style={{ borderLeft: `6px solid ${card.color}` }} key={idx}>
            <div className="admin-stat-icon" style={{ color: card.color }}>{card.icon}</div>
            <div>
              <div className="admin-stat-label">{card.label}</div>
              <div className="admin-stat-value"><CountUp end={card.value} duration={1.5} separator="," /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-stats-grid admin-trend-row">
        {resumeCards.map((card, idx) => (
          <div className="admin-stat-card" style={{ borderLeft: `6px solid ${card.color}` }} key={idx}>
            <div className="admin-stat-icon" style={{ color: card.color }}>{card.icon}</div>
            <div className="admin-stat-info-block">
              <div className="admin-stat-label">{card.label}</div>
              <div className="admin-stat-info-row">
                <div className="admin-stat-value"><CountUp end={card.value} duration={1.5} separator="," /></div>
                <ResponsiveContainer width={60} height={30}>
                  <LineChart data={card.trend}><Line type="monotone" dataKey="y" stroke={card.color} strokeWidth={2} dot={false} /></LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-chart-section">
        <div className="admin-chart-card glassy">
          <h4>Downloads vs Resumes</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={donutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label>
                {donutData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-chart-card glassy">
          <h4>Resumes by Template</h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={templateData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
              <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 11, fill: '#333' }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" stroke="#0057D9" fill="#E1E2EF" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-chart-card admin-full-width glassy">
          <h4>Resume Creation Trends</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { name: 'Today', value: data.resumesToday },
                { name: 'This Week', value: data.resumesThisWeek },
                { name: 'This Month', value: data.resumesThisMonth },
              ]}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="value" fill="#0A66FF" radius={[6, 6, 6, 6]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-top-templates">
        <h4>Top Resume Templates</h4>
        <div className="admin-template-grid">
          {data.topTemplates?.map((template, idx) => {
            const badgeIcon =
              idx === 0 ? <EmojiEvents sx={{ color: '#FFD700', fontSize: 60 }} /> :
                idx === 1 ? <MilitaryTech sx={{ color: '#C0C0C0', fontSize: 60 }} /> :
                  <WorkspacePremium sx={{ color: '#CD7F32', fontSize: 60 }} />;

            return (
              <div className={`admin-template-entry ${idx === 0 ? 'winner' : ''}`} key={idx}>
                <div className="admin-template-rank">{badgeIcon}</div>
                <div className="admin-template-name">{template}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
