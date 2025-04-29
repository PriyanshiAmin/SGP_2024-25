import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, ChartData } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

// Define types for chart data
interface ChartItem {
  date: string;
  count: number;
  location?: string;
}

interface Stats {
  users: number;
  reports: number;
  volunteers: number;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  
  // Define state types
  const [stats, setStats] = useState<Stats>({
    users: 0,
    reports: 0,
    volunteers: 0,
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  
  // Chart data state with correct types
  const [chartData, setChartData] = useState<{
    users: ChartItem[];
    reports: ChartItem[];
    volunteers: ChartItem[];
  }>({
    users: [],
    reports: [],
    volunteers: [],
  });

  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Fetch stats
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    // Fetch chart data
    const fetchChartData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/chartdata', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        });
        setChartData(res.data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchStats();
    fetchChartData();
  }, [navigate, dateRange]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Line Chart: User Growth Over Time
  const lineChartData: ChartData<'line'> = {
    labels: chartData.users.map((data) => data.date),
    datasets: [
      {
        label: 'Users Over Time',
        data: chartData.users.map((data) => data.count),
        fill: false,
        borderColor: '#EF4444',
        tension: 0.1,
      },
    ],
  };

  // Bar Chart: Report Counts Over Time
  const barChartData: ChartData<'bar'> = {
    labels: chartData.reports.map((data) => data.date),
    datasets: [
      {
        label: 'Reports Over Time',
        data: chartData.reports.map((data) => data.count),
        backgroundColor: '#F87171',
      },
    ],
  };

  // Pie Chart: Volunteer Distribution
  const pieChartData: ChartData<'pie'> = {
    labels: chartData.volunteers.map((data) => data.location || 'Unknown'),
    datasets: [
      {
        label: 'Volunteer Distribution',
        data: chartData.volunteers.map((data) => data.count),
        backgroundColor: ['#EF4444', '#F87171', '#FB923C', '#F59E0B'],
      },
    ],
  };

  // Chart Options for Zoom & Pan
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return tooltipItem.raw + ' reports';
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy' as const,
        },
        zoom: {
          enabled: true,
          mode: 'xy' as const,
        },
      },
    },
  };

  // Filter Handler
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen bg-red-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg hidden md:block">
        <div className="p-6 font-bold text-red-600 text-2xl">Admin Panel</div>
        <nav className="mt-10">
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-red-100 hover:text-red-600">Dashboard</a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-red-100 hover:text-red-600">Reports</a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-red-100 hover:text-red-600">Users</a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-red-100 hover:text-red-600">Volunteers</a>
          <button 
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/admin/login');
            }}
            className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-red-100 hover:text-red-600"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-8">Welcome, Admin! 👋</h1>

        {/* Date Range Filter */}
        <div className="flex space-x-4 mb-8">
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateRangeChange}
            className="p-2 rounded-md border border-gray-300"
          />
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateRangeChange}
            className="p-2 rounded-md border border-gray-300"
          />
          <button
            onClick={() => setDateRange({...dateRange})}
            className="p-2 bg-red-600 text-white rounded-md"
          >
            Apply
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h2 className="text-2xl font-bold text-red-500">{stats.users}</h2>
            <p className="text-gray-500">Total Users</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h2 className="text-2xl font-bold text-red-500">{stats.reports}</h2>
            <p className="text-gray-500">Total Reports</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h2 className="text-2xl font-bold text-red-500">{stats.volunteers}</h2>
            <p className="text-gray-500">Total Volunteers</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">User Growth Over Time</h2>
            <div style={{ height: '300px' }}>
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Reports Over Time</h2>
            <div style={{ height: '300px' }}>
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 col-span-2">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Volunteer Distribution</h2>
            <div style={{ height: '300px' }}>
              <Pie data={pieChartData} />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            <li className="border-b pb-2 text-gray-600">User JohnDoe registered.</li>
            <li className="border-b pb-2 text-gray-600">New disaster reported: Earthquake in NYC.</li>
            <li className="pb-2 text-gray-600">Volunteer JaneDoe signed up to assist in rescue.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}