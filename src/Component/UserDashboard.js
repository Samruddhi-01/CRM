import React from "react";
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
  Legend
} from "recharts";

const UserDashboard = () => {
  const transactionData = [
    { name: "Jan", value: 100000 },
    { name: "Feb", value: 150000 },
    { name: "March", value: 180000 },
    { name: "April", value: 120000 },
    { name: "May", value: 140000 },
    { name: "June", value: 220000 }
  ];

  const bookingData = [
    { name: "Jan", Buyer: 200, Seller: 250 },
    { name: "Feb", Buyer: 300, Seller: 280 },
    { name: "March", Buyer: 320, Seller: 310 },
    { name: "April", Buyer: 100, Seller: 120 },
    { name: "May", Buyer: 210, Seller: 200 },
    { name: "June", Buyer: 450, Seller: 400 }
  ];

  const userData = [
    { name: "Buyer", value: 60 },
    { name: "Seller", value: 40 }
  ];

  const HistoryData = [
    { name: "Commercial Plot", value: 70 },
    { name: "Residential Plot", value: 30 }
  ];

  const COLORS = ["#0d2d62", "#D2042D"];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">LOGO</div>
        <ul>
          <li className="active">Dashboard</li>
          <li className="active">Users Creation</li>
          <li className="active">Advance Search</li>
          <li className="active">Data Creation</li>
          <li className="active">History</li>
          <li className="active">Transactions</li>
          <li className="active">Notifications</li>
        </ul>
      </div>

      {/* Main content */}
      <div className="main">
        {/* Top stats */}
        <div className="stats">
          <div className="card">Total Users <h3>10025</h3></div>
          <div className="card">Total Bookings <h3>893</h3></div>
          <div className="card">Total History <h3>354</h3></div>
          <div className="card">Total Revenue <h3>156300</h3></div>
        </div>

        {/* Charts */}
        <div className="charts">
          <div className="chart-card">
            <h4>Transactions</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={transactionData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#D2042D" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h4>Users</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={userData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={80}
                  label
                >
                  {userData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h4>History</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={HistoryData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={80}
                >
                  {HistoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h4>Bookings</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={bookingData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Buyer" fill="#D2042D" />
                <Bar dataKey="Seller" fill="#0d2d62" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
