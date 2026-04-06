import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { 
  LayoutDashboard, CheckCircle, Clock, Users, ArrowUpRight, AlertTriangle, 
  Activity, Zap, Info, Database, Send, Radio, FileDown
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const MainPart = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalUsers: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/dashboard-stats`);
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const generatePDF = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/all-tasks-report`);
      const tasks = res.data;

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Task Management Report", 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

      const tableData = tasks.map((task, index) => [
        index + 1,
        task.userId?.name || "N/A",
        task.task,
        task.priority || "Medium",
        task.status,
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"
      ]);

      doc.autoTable({
        head: [['#', 'Staff Name', 'Task description', 'Priority', 'Status', 'Due Date']],
        body: tableData,
        startY: 35,
        theme: 'striped',
        headStyles: { fillStyle: '#004838', textColor: [255, 255, 255] },
        alternateRowStyles: { fillStyle: '#EBEDE8' }
      });

      doc.save(`TaskPerformanceReport_${new Date().toDateString()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const chartData = [
    { name: "Pending", value: stats.pendingTasks, color: "#F43F5E" },
    { name: "In Progress", value: stats.inProgressTasks, color: "#F59E0B" },
    { name: "Completed", value: stats.completedTasks, color: "#10B981" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#EBEDE8]">
        <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-[#004838]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#E2FB6C] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Inventory", value: stats.totalTasks, label: "All Tasks", icon: <LayoutDashboard size={24} />, color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
    { title: "Operational", value: stats.completedTasks, label: "Completed", icon: <CheckCircle size={24} />, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50" },
    { title: "Needs Attention", value: stats.pendingTasks, label: "Pending", icon: <AlertTriangle size={24} />, color: "from-orange-500 to-rose-500", bg: "bg-orange-50" },
    { title: "Workforce", value: stats.totalUsers, label: "Active Users", icon: <Users size={24} />, color: "from-[#004838] to-[#073127]", bg: "bg-[#004838]/10" },
    { title: "Active Flow", value: stats.inProgressTasks, label: "In Progress", icon: <Activity size={24} />, color: "from-amber-400 to-orange-500", bg: "bg-amber-50" },
    { title: "Risk Factor", value: stats.overdueTasks, label: "Overdue", icon: <AlertTriangle size={24} />, color: "from-red-600 to-red-800", bg: "bg-red-50" },
  ];

  return (
    <div className="p-8 md:p-12 space-y-10 animate-in fade-in zoom-in-95 duration-700 pb-20">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="w-12 h-1 bg-[#004838] rounded-full"></span>
                <span className="text-[10px] uppercase font-black text-[#004838] tracking-[.4em]">Executive Overview</span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                Control <span className="bg-gradient-to-r from-[#004838] to-[#073127] bg-clip-text text-transparent underline decoration-[#E2FB6C]/60">Center</span>
            </h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
            <button 
                onClick={generatePDF}
                className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-3xl shadow-sm text-[10px] font-black uppercase tracking-widest text-[#004838] hover:bg-[#E2FB6C]/10 hover:border-[#E2FB6C] transition-all group"
            >
                <FileDown size={14} className="group-hover:scale-110 transition-transform" />
                Export PDF Report
            </button>
            <div className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Health</p>
                    <p className="text-sm font-black text-[#004838]">All Synchronized</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#E2FB6C]/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#004838] animate-pulse"></div>
                </div>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="group relative bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 hover:border-[#E2FB6C] hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${card.bg} rounded-bl-full translate-x-12 -translate-y-12 transition-transform duration-700 group-hover:translate-x-4 group-hover:-translate-y-4`}></div>
            
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center text-[#004838] group-hover:rotate-12 transition-transform shadow-inner`}>
                    {card.icon}
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Monitoring</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{card.title}</h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-gray-900 tracking-tighter">{card.value}</p>
                    <p className={`text-xs font-bold uppercase tracking-widest ${card.title.includes('Risk') ? 'text-red-500' : 'text-[#004838]'}`}>• {card.label}</p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${card.color} rounded-full`} style={{ width: `${(card.value / (stats.totalTasks || 1)) * 100}%` }}></div>
                </div>
                <button className="text-[10px] font-black uppercase text-gray-400 hover:text-[#004838] transition-colors"><ArrowUpRight size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-2xl font-black text-gray-800 tracking-tight">Workload Analysis</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Status distribution</p>
                </div>
            </div>

            <div className="h-[300px] w-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 700 }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 700 }}
                    />
                    <Tooltip 
                        cursor={{ fill: '#F9FAFB' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-[#004838] p-4 rounded-2xl shadow-xl text-white border border-[#E2FB6C]/20">
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">{payload[0].payload.name}</p>
                                        <p className="text-xl font-black">{payload[0].value} <span className="text-[10px] font-medium opacity-50 uppercase tracking-widest">Tasks</span></p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar 
                        dataKey="value" 
                        radius={[12, 12, 12, 12]} 
                        barSize={60}
                    >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Insights & Activity */}
        <div className="space-y-10">
            <div className="bg-gradient-to-br from-[#004838] to-[#073127] p-10 rounded-[3rem] text-white overflow-hidden relative shadow-2xl">
                <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                    <span className="p-2 bg-white/10 rounded-xl text-lg">💡</span> 
                    Smart Insights
                </h3>
                <div className="space-y-6 relative z-10">
                    <div className="p-6 bg-white/5 rounded-[1.5rem] border border-white/5 backdrop-blur-md">
                        <p className="text-sm text-white/90 leading-relaxed">
                            Currently, <span className="font-black text-[#E2FB6C]">{stats.completedTasks} tasks</span> have been successfully deployed. Your team is performing <span className="font-black text-[#A8FF78]">optimized</span> this week.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/10 rounded-2xl">
                            <p className="text-[10px] font-black uppercase text-white/50 mb-1">Efficiency Node</p>
                            <p className="text-xl font-black">Active</p>
                        </div>
                        <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black uppercase text-white/50 mb-1">System Health</p>
                            <p className="text-xl font-black">Stable</p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#E2FB6C] rounded-full blur-[100px] opacity-10"></div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-gray-800">System Activity</h3>
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Online
                    </span>
                </div>
                <div className="space-y-6">
                    {[
                        { label: "Database Core", status: "Synchronized", icon: <Database size={16}/> },
                        { label: "Deployment Node", status: "Active", icon: <Send size={16}/> },
                        { label: "Real-time Stream", status: "Buffering", icon: <Radio size={16}/> }
                    ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#004838] group-hover:bg-[#E2FB6C]/20 transition-colors">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-700">{item.label}</p>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.status}</p>
                                </div>
                            </div>
                            <ArrowUpRight size={14} className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MainPart;