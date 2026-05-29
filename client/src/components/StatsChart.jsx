import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const CATEGORY_LABELS = {
  EQUIVALENCIA: 'Equiv.',
  FUTURE_VALUE: 'Val. Futuro',
  PRESENT_VALUE: 'Val. Presente',
  PAYMENT: 'Cuota R',
  PERIODS: 'Periodos n',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-gray-300 font-medium">{CATEGORY_LABELS[label] || label}</p>
      <p className="text-primary font-bold">{payload[0].value}% aciertos</p>
      <p className="text-gray-500 text-xs">{payload[0].payload.total} intentos</p>
    </div>
  );
};

export default function StatsChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
        Aún no hay intentos registrados
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    name: CATEGORY_LABELS[d.category] || d.category,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A3045" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="accuracy" radius={[6, 6, 0, 0]} maxBarSize={56}>
          {chartData.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.accuracy >= 70 ? '#00C48C' : entry.accuracy >= 40 ? '#F5A623' : '#ef4444'}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
