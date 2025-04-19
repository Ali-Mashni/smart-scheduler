import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  academic: '#211C84',
  exercise: '#4D55CC',
  personal: '#7A73D1',
  other: '#B5A8D5',
};

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ActivityBreakdownChart() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [data, setData] = useState([]);

  const formatDate = (date) => {
    const offset = date.getTimezoneOffset();
    const corrected = new Date(date.getTime() - offset * 60 * 1000);
    return corrected.toISOString().slice(0, 10);
  };

  const getWeekDates = () => {
    const now = new Date();
    now.setDate(now.getDate() + weekOffset * 7);
    const day = now.getDay();
    const diff = now.getDate() - day;
    const sunday = new Date(now.setDate(diff));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('activities')) || [];
    const weekDates = getWeekDates();

    const summary = weekDates.map((date) => {
      const dateStr = formatDate(date);
      const dayLabel = days[date.getDay()];
      const filtered = stored.filter((a) => {
        if (!a.startTime || !a.endTime) return false;

        const isPerm =
          a.isPermanent &&
          a.selectedDays?.includes(date.toLocaleDateString('en-US', { weekday: 'long' }));

        const isTemp = !a.isPermanent && formatDate(new Date(a.selectedDate)) === dateStr;

        return isPerm || isTemp;
      });

      const totals = { academic: 0, exercise: 0, personal: 0, other: 0 };
      filtered.forEach((act) => {
        const start = parseInt(act.startTime.split(':')[0]);
        const end = parseInt(act.endTime.split(':')[0]);
        const hours = Math.max(0, end - start);
        if (totals[act.activityType] !== undefined) {
          totals[act.activityType] += hours;
        }
      });

      return { day: dayLabel, ...totals };
    });

    setData(summary);
  }, [weekOffset]);

  return (
    <div className="bg-bgCard p-4 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setWeekOffset(weekOffset - 1)}
          className="bg-primaryHover px-3 py-1 rounded"
        >
          ← Previous Week
        </button>
        <h2 className="text-lg font-semibold">Activity Type Breakdown</h2>
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="bg-primaryHover px-3 py-1 rounded"
        >
          Next Week →
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="day" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Bar dataKey="academic" stackId="a" fill={COLORS.academic} />
          <Bar dataKey="exercise" stackId="a" fill={COLORS.exercise} />
          <Bar dataKey="personal" stackId="a" fill={COLORS.personal} />
          <Bar dataKey="other" stackId="a" fill={COLORS.other} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
