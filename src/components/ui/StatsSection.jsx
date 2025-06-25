import React, { useState, useEffect } from "react";
import { Users, FileText, MapPin, AlertTriangle } from "lucide-react";
import { GenderMale, GenderFemale } from "phosphor-react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const StatsSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const BASE_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "https://voter-backend-y6hw.onrender.com";

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/voters/stats`);
        // const response = await axios.get(`${BASE_URL}/api/voters/stats`, {
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDAxOGFkYzY3ZjI5Y2NjMzU0ZDQ3MyIsImlhdCI6MTc0OTAzMTA5MywiZXhwIjoxNzQ5MDc0MjkzfQ.4y2FO2IrA2P7Aampgmttmb3Bz3gGi9tPgx9iveNC8zw`,
        //   },
        // });
        setStats(response.data.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getVariantStyles = (variant) => {
    const variants = {
      primary: {
        bg: "bg-gradient-to-br from-emerald-600 to-emerald-700",
        text: "text-white",
        subText: "text-emerald-100",
        iconBg: "bg-white/20",
        iconText: "text-white",
        border: "border-emerald-500/30",
        glow: "shadow-emerald-500/20",
        accent: "bg-white/10",
      },
      light: {
        bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
        text: "text-emerald-900",
        subText: "text-emerald-600",
        iconBg: "bg-emerald-500",
        iconText: "text-white",
        border: "border-emerald-200",
        glow: "shadow-emerald-200/40",
        accent: "bg-emerald-200/50",
      },
      medium: {
        bg: "bg-gradient-to-br from-emerald-400 to-emerald-500",
        text: "text-white",
        subText: "text-emerald-50",
        iconBg: "bg-white/20",
        iconText: "text-white",
        border: "border-emerald-300/50",
        glow: "shadow-emerald-400/25",
        accent: "bg-white/15",
      },
      accent: {
        bg: "bg-gradient-to-br from-emerald-200 to-emerald-300",
        text: "text-emerald-900",
        subText: "text-emerald-700",
        iconBg: "bg-emerald-600",
        iconText: "text-white",
        border: "border-emerald-300",
        glow: "shadow-emerald-300/30",
        accent: "bg-emerald-400/30",
      },
    };
    return variants[variant];
  };

  const BackgroundPattern = ({ pattern, variant }) => {
    const baseColor =
      variant === "primary" || variant === "medium" ? "white" : "emerald-600";
    const opacity =
      variant === "primary" || variant === "medium"
        ? "opacity-5"
        : "opacity-10";

    return (
      <div className="absolute inset-0 overflow-hidden">
        {pattern === "dots" && (
          <>
            <div
              className={`absolute top-4 right-4 w-2 h-2 bg-${baseColor} ${opacity} rounded-full`}
            />
            <div
              className={`absolute top-8 right-8 w-1 h-1 bg-${baseColor} ${opacity} rounded-full`}
            />
            <div
              className={`absolute bottom-8 left-6 w-1.5 h-1.5 bg-${baseColor} ${opacity} rounded-full`}
            />
          </>
        )}
        {pattern === "waves" && (
          <div
            className={`absolute -bottom-2 -right-4 w-16 h-16 bg-${baseColor} ${opacity} rounded-full blur-2xl`}
          />
        )}
        {pattern === "grid" && (
          <div
            className={`absolute top-2 right-2 w-6 h-6 border border-${baseColor} ${opacity} opacity-30`}
          />
        )}
        {pattern === "radial" && (
          <div
            className={`absolute top-2 right-2 w-12 h-12 bg-gradient-radial from-${baseColor}/10 to-transparent rounded-full`}
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-y-emerald-300 border-x-emerald-500 mx-auto"></div>
        <p className="mt-4">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <AlertTriangle className="h-8 w-8 mx-auto" />
        <p className="mt-4">{error}</p>
      </div>
    );
  }

  const summaryStats = [
    {
      name: "Total Voters",
      value: stats?.totalVoters || 0,
      icon: Users,
      variant: "primary",
      bgPattern: "dots",
    },
    {
      name: "Male Voters",
      value:
        stats?.genderDistribution.find((g) => g._id === "Male")?.count || 0,
      icon: GenderMale,
      variant: "light",
      bgPattern: "waves",
    },
    {
      name: "Female Voters",
      value:
        stats?.genderDistribution.find((g) => g._id === "Female")?.count || 0,
      icon: GenderFemale,
      variant: "light",
      bgPattern: "grid",
    },
    {
      name: "Average Age",
      value: Math.round(stats?.ageStatistics.averageAge) || 0,
      icon: FileText,
      variant: "accent",
      bgPattern: "radial",
    },
  ];

  const genderChartData = {
    labels: stats?.genderDistribution.map((g) => g._id) || [],
    datasets: [
      {
        data: stats?.genderDistribution.map((g) => g.count) || [],
        backgroundColor: ["#059669", "#34D399", "#A7F3D0"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const ageChartData = {
    labels:
      stats?.ageGroupDistribution.map((g) => {
        if (g._id === Infinity) return "65+";
        if (g._id === 18) return "18-24";
        return `${g._id}-${g._id + 9}`;
      }) || [],
    datasets: [
      {
        label: "Voters by Age Group",
        data: stats?.ageGroupDistribution.map((g) => g.count) || [],
        backgroundColor: "#059669",
        borderColor: "#047857",
        borderWidth: 1,
      },
    ],
  };

  const districtChartData = {
    labels:
      stats?.geographicalDistribution.district.slice(0, 5).map((d) => d._id) ||
      [],
    datasets: [
      {
        label: "Voters by District",
        data:
          stats?.geographicalDistribution.district
            .slice(0, 5)
            .map((d) => d.count) || [],
        backgroundColor: "#34D399",
        borderColor: "#10B981",
        borderWidth: 1,
      },
    ],
  };

  const missingDataChartData = {
    labels: [
      "House No",
      "Address Line 1",
      "Address Line 2",
      "Mobile Number",
      "Caste",
    ],
    datasets: [
      {
        label: "Missing Data (%)",
        data: [
          stats?.missingDataPercentages.houseNo || 0,
          stats?.missingDataPercentages.addressLine1 || 0,
          stats?.missingDataPercentages.addressLine2 || 0,
          stats?.missingDataPercentages.mobileNumber || 0,
          stats?.missingDataPercentages.caste || 0,
        ],
        backgroundColor: [
          "#EF4444",
          "#F59E0B",
          "#10B981",
          "#3B82F6",
          "#8B5CF6",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, index) => {
          const Icon = stat.icon;
          const isHovered = hoveredCard === index;
          const styles = getVariantStyles(stat.variant);

          return (
            <div
              key={stat.name}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${
                  isHovered
                    ? "border-emerald-400 scale-102"
                    : "border-transparent"
                }`}
              />
              <div
                className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                  isHovered ? `shadow-xl ${styles.glow}` : "shadow-md"
                }`}
              />
              <div
                className={`${
                  styles.bg
                } relative rounded-2xl p-6 border border-white/10 transform transition-all duration-300 ${
                  isHovered ? "scale-102" : "scale-100"
                } overflow-hidden`}
              >
                <BackgroundPattern
                  pattern={stat.bgPattern}
                  variant={stat.variant}
                />
                {isHovered && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-b from-white/5 to-transparent rotate-12 blur-lg opacity-50"
                      style={{
                        clipPath: "polygon(45% 0%, 55% 0%, 70% 100%, 30% 100%)",
                      }}
                    />
                  </div>
                )}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex flex-col space-y-3">
                    <div
                      className={`${
                        styles.iconBg
                      } w-12 h-12 rounded-xl flex items-center justify-center transform transition-all duration-300 ${
                        isHovered ? "scale-110 rotate-6" : "scale-100"
                      } backdrop-blur-sm`}
                    >
                      <Icon className={`h-6 w-6 ${styles.iconText}`} />
                    </div>
                    <p
                      className={`text-xl font-medium ${styles.subText} leading-tight`}
                    >
                      {stat.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-4xl font-bold ${
                        styles.text
                      } leading-none transform transition-all duration-300 ${
                        isHovered ? "scale-105" : "scale-100"
                      }`}
                    >
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 ${
                    styles.accent
                  } transition-all duration-300 ${
                    isHovered ? "scale-x-100" : "scale-x-0"
                  } origin-left`}
                />
                {isHovered && (
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-2 h-2 ${styles.accent} rounded-full animate-pulse`}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Gender Distribution
          </h2>
          <div className="h-64">
            <Doughnut
              data={genderChartData}
              options={{
                plugins: {
                  legend: { position: "bottom" },
                  tooltip: { backgroundColor: "#059669" },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Age Distribution
          </h2>
          <div className="h-64">
            <Bar
              data={ageChartData}
              options={{
                plugins: {
                  legend: { display: false },
                  tooltip: { backgroundColor: "#059669" },
                },
                scales: {
                  y: { beginAtZero: true },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        {/* District Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top 5 Districts
          </h2>
          <div className="h-64">
            <Bar
              data={districtChartData}
              options={{
                plugins: {
                  legend: { display: false },
                  tooltip: { backgroundColor: "#34D399" },
                },
                scales: {
                  y: { beginAtZero: true },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        {/* Missing Data */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Missing Data Percentages
          </h2>
          <div className="h-64">
            <Doughnut
              data={missingDataChartData}
              options={{
                plugins: {
                  legend: { position: "bottom" },
                  tooltip: { backgroundColor: "#10B981" },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Additional Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Minimum Age</p>
            <p className="text-2xl font-bold text-emerald-600">
              {stats?.ageStatistics.minAge || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Maximum Age</p>
            <p className="text-2xl font-bold text-emerald-600">
              {stats?.ageStatistics.maxAge || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Standard Deviation of Age</p>
            <p className="text-2xl font-bold text-emerald-600">
              {stats?.ageStatistics.stdDevAge?.toFixed(2) || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Top Assembly Constituency</p>
            <p className="text-2xl font-bold text-emerald-600">
              {stats?.geographicalDistribution.assemblyConstituency[0]?._id ||
                "N/A"}{" "}
              (
              {stats?.geographicalDistribution.assemblyConstituency[0]?.count ||
                0}
              )
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;

// import React, { useState } from 'react';
// import { Users, FileText } from 'lucide-react';
// import { GenderMale, GenderFemale } from 'phosphor-react';

// const StatsSection = ({ voters }) => {
//   const [hoveredCard, setHoveredCard] = useState(null);

//   const stats = [
//     {
//       name: 'Total Voters',
//       value: voters.length,
//       icon: Users,
//       variant: 'primary',
//       bgPattern: 'dots'
//     },
//     {
//       name: 'Male Voters',
//       value: voters.filter(v => v.gender === 'Male').length,
//       icon: GenderMale,
//       variant: 'light',
//       bgPattern: 'waves'
//     },
//     {
//       name: 'Female Voters',
//       value: voters.filter(v => v.gender === 'Female').length,
//       icon: GenderFemale,
//       variant: 'light',
//       bgPattern: 'grid'
//     },
//     {
//       name: 'Average Age',
//       value: Math.round(voters.reduce((sum, v) => sum + v.age, 0) / voters.length) || 0,
//       icon: FileText,
//       variant: 'accent',
//       bgPattern: 'radial'
//     }
//   ];

//   const getVariantStyles = (variant) => {
//     const variants = {
//       primary: {
//         bg: 'bg-gradient-to-br from-emerald-600 to-emerald-700',
//         text: 'text-white',
//         subText: 'text-emerald-100',
//         iconBg: 'bg-white/20',
//         iconText: 'text-white',
//         border: 'border-emerald-500/30',
//         glow: 'shadow-emerald-500/20',
//         accent: 'bg-white/10'
//       },
//       light: {
//         bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
//         text: 'text-emerald-900',
//         subText: 'text-emerald-600',
//         iconBg: 'bg-emerald-500',
//         iconText: 'text-white',
//         border: 'border-emerald-200',
//         glow: 'shadow-emerald-200/40',
//         accent: 'bg-emerald-200/50'
//       },
//       medium: {
//         bg: 'bg-gradient-to-br from-emerald-400 to-emerald-500',
//         text: 'text-white',
//         subText: 'text-emerald-50',
//         iconBg: 'bg-white/20',
//         iconText: 'text-white',
//         border: 'border-emerald-300/50',
//         glow: 'shadow-emerald-400/25',
//         accent: 'bg-white/15'
//       },
//       accent: {
//         bg: 'bg-gradient-to-br from-emerald-200 to-emerald-300',
//         text: 'text-emerald-900',
//         subText: 'text-emerald-700',
//         iconBg: 'bg-emerald-600',
//         iconText: 'text-white',
//         border: 'border-emerald-300',
//         glow: 'shadow-emerald-300/30',
//         accent: 'bg-emerald-400/30'
//       }
//     };
//     return variants[variant];
//   };

//   const BackgroundPattern = ({ pattern, variant }) => {
//     const baseColor = variant === 'primary' || variant === 'medium' ? 'white' : 'emerald-600';
//     const opacity = variant === 'primary' || variant === 'medium' ? 'opacity-5' : 'opacity-10';

//     return (
//       <div className="absolute inset-0 overflow-hidden">
//         {pattern === 'dots' && (
//           <>
//             <div className={`absolute top-4 right-4 w-2 h-2 bg-${baseColor} ${opacity} rounded-full`} />
//             <div className={`absolute top-8 right-8 w-1 h-1 bg-${baseColor} ${opacity} rounded-full`} />
//             <div className={`absolute bottom-8 left-6 w-1.5 h-1.5 bg-${baseColor} ${opacity} rounded-full`} />
//           </>
//         )}
//         {pattern === 'waves' && (
//           <div className={`absolute -bottom-2 -right-4 w-16 h-16 bg-${baseColor} ${opacity} rounded-full blur-2xl`} />
//         )}
//         {pattern === 'grid' && (
//           <div className={`absolute top-2 right-2 w-6 h-6 border border-${baseColor} ${opacity} opacity-30`} />
//         )}
//         {pattern === 'radial' && (
//           <div className={`absolute top-2 right-2 w-12 h-12 bg-gradient-radial from-${baseColor}/10 to-transparent rounded-full`} />
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       {stats.map((stat, index) => {
//         const Icon = stat.icon;
//         const isHovered = hoveredCard === index;
//         const styles = getVariantStyles(stat.variant);

//         return (
//           <div
//             key={stat.name}
//             className="relative group cursor-pointer"
//             onMouseEnter={() => setHoveredCard(index)}
//             onMouseLeave={() => setHoveredCard(null)}
//           >
//             <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${isHovered ? 'border-emerald-400 scale-102' : 'border-transparent'}`} />
//             <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${isHovered ? `shadow-xl ${styles.glow}` : 'shadow-md'}`} />

//             <div className={`${styles.bg} relative rounded-2xl p-6 border border-white/10 transform transition-all duration-300 ${isHovered ? 'scale-102' : 'scale-100'} overflow-hidden`}>
//               <BackgroundPattern pattern={stat.bgPattern} variant={stat.variant} />

//               {isHovered && (
//                 <div className="absolute inset-0 overflow-hidden pointer-events-none">
//                   <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-b from-white/5 to-transparent rotate-12 blur-lg opacity-50"
//                        style={{ clipPath: 'polygon(45% 0%, 55% 0%, 70% 100%, 30% 100%)' }} />
//                 </div>
//               )}

//               <div className="relative z-10 flex items-center justify-between">
//                 <div className="flex flex-col space-y-3">
//                   <div className={`${styles.iconBg} w-12 h-12 rounded-xl flex items-center justify-center transform transition-all duration-300 ${isHovered ? 'scale-110 rotate-6' : 'scale-100'} backdrop-blur-sm`}>
//                     <Icon className={`h-6 w-6 ${styles.iconText}`} />
//                   </div>
//                   <p className={`text-xl font-medium ${styles.subText} leading-tight`}>{stat.name}</p>
//                 </div>

//                 <div className="text-right">
//                   <p className={`text-4xl font-bold ${styles.text} leading-none transform transition-all duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}>
//                     {stat.value.toLocaleString()}
//                   </p>
//                 </div>
//               </div>

//               <div className={`absolute bottom-0 left-0 right-0 h-1 ${styles.accent} transition-all duration-300 ${isHovered ? 'scale-x-100' : 'scale-x-0'} origin-left`} />

//               {isHovered && (
//                 <div className="absolute top-4 right-4">
//                   <div className={`w-2 h-2 ${styles.accent} rounded-full animate-pulse`} />
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default StatsSection;
