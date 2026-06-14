import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const getUserSubmissions = async (username) => {
  const response = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
  const data = await response.json();
  if (data.status !== 'OK') throw new Error('Failed to fetch submissions');
  return data.result;
};

const analyzeProblemTags = (submissions) => {
  const tagCount = {};
  submissions.forEach((sub) => {
    if (sub.verdict === 'OK') {
      sub.problem.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    }
  });
  return Object.entries(tagCount).map(([name, value]) => ({ name, value }));
};

const analyzeProblemRatings = (submissions) => {
  const ratingCount = {};
  const seen = new Set();

  submissions.forEach((sub) => {
    if (
      sub.verdict === 'OK' &&
      sub.problem.rating &&
      !seen.has(`${sub.problem.contestId}-${sub.problem.index}`)
    ) {
      ratingCount[sub.problem.rating] = (ratingCount[sub.problem.rating] || 0) + 1;
      seen.add(`${sub.problem.contestId}-${sub.problem.index}`);
    }
  });

  return ratingCount;
};

function UserProblemStats({ handle }) {
  const [tagStats, setTagStats] = useState([]);
  const [ratingStats, setRatingStats] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!handle) return;

    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const submissions = await getUserSubmissions(handle);
        setTagStats(analyzeProblemTags(submissions));
        setRatingStats(analyzeProblemRatings(submissions));
      } catch (err) {
        setError('Invalid handle or failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [handle]);

  if (!handle) return null;

  const ratingArray = Object.entries(ratingStats)
    .map(([rating, count]) => ({ rating, count }))
    .sort((a, b) => parseInt(a.rating) - parseInt(b.rating));

  return (
    <div id='ProblemSolved' style={{ 
      padding: '32px', 
      borderTop: '1px solid #eee', 
      marginTop: '60px',
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <h2 style={{ 
        marginBottom: '30px', 
        textAlign: 'center',
        fontSize: '1.8rem',
        fontWeight: '700'
      }}>
        User Problem Stats
      </h2>

      {loading && <p style={{ textAlign: 'center', margin: '30px 0' }}>Loading stats...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center', margin: '30px 0' }}>{error}</p>}

      {tagStats.length > 0 && (
        <div style={{ 
          marginBottom: '60px',
          padding: '20px',
          border: '1px solid #eee',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{ 
            marginBottom: '25px', 
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            Tag Distribution
          </h3>
          <ResponsiveContainer width="100%" height={450} debounce={1}>
            <PieChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
              <Pie 
                data={tagStats} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="40%" 
                outerRadius={130} 
                innerRadius={60}
                paddingAngle={2}
                labelLine={false}
                animationDuration={1500}
                animationBegin={200}
              >
                {tagStats.map((entry, index) => (
                  <Cell 
                    key={entry.name} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="#0d1117" 
                    strokeWidth={1} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} problems`, name]}
                contentStyle={{ 
                  backgroundColor: '#0d1117', 
                  border: '1px solid #30363d', 
                  borderRadius: '8px',
                  padding: '10px'
                }}
                itemStyle={{ color: '#c9d1d9' }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ 
                  paddingTop: '50px',
                  marginTop: '20px',
                  fontSize: '12px',
                  lineHeight: '20px'
                }}
                iconSize={10}
                iconType="circle"
                formatter={(value) => <span style={{ padding: '0 5px' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {ratingArray.length > 0 && (
        <div style={{ 
          marginBottom: '60px',
          padding: '20px',
          border: '1px solid #eee',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{ 
            marginBottom: '25px', 
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            Rating Breakdown
          </h3>

          {/* Rating Boxes */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '15px', 
            marginBottom: '35px', 
            justifyContent: 'center',
            padding: '10px'
          }}>
            {ratingArray.map(({ rating, count }) => (
              <div
                key={rating}
                style={{
                  padding: '15px 20px',
                  border: '1px solid #30363d',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  backgroundColor: '#161b22',
                  color: '#c9d1d9',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  minWidth: '80px',
                  textAlign: 'center'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {rating}: {count}
              </div>
            ))}
          </div>

          {/* Rating Bar Chart */}
          <ResponsiveContainer width="100%" height={450} debounce={1}>
            <BarChart data={ratingArray} margin={{ top: 20, right: 30, bottom: 30, left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="rating" 
                label={{ 
                  value: 'Problem Rating', 
                  position: 'insideBottom', 
                  offset: -10,
                  style: { textAnchor: 'middle', fontSize: '14px', fill: '#666' }
                }}
                tick={{ fontSize: 12 }}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                allowDecimals={false} 
                label={{ 
                  value: 'Problems Solved', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: '14px', fill: '#666' }
                }}
                tick={{ fontSize: 12 }}
                padding={{ top: 20, bottom: 20 }}
              />
              <Tooltip 
                formatter={(value) => [`${value} problems`, 'Solved']}
                labelFormatter={(rating) => `Rating: ${rating}`}
                contentStyle={{ 
                  backgroundColor: '#0d1117', 
                  border: '1px solid #30363d', 
                  borderRadius: '8px',
                  padding: '10px'
                }}
                itemStyle={{ color: '#c9d1d9' }}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '14px'
                }}
              />
              <Bar 
                dataKey="count" 
                name="Problems Solved" 
                fill="#58a6ff" 
                radius={[6, 6, 0, 0]} 
                animationDuration={1500}
                animationBegin={200}
                barSize={30}
              >
                {ratingArray.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${210 + index * 15}, 100%, 65%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default UserProblemStats;
