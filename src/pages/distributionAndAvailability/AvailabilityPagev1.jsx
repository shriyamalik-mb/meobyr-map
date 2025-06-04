import { useState } from 'react';
import AvailabilityMapDash from '../../components/distributionAndAvailability/AvailabilityMapDash.jsx';

export default function AvailabilityPagev1() {
  const [date, setDate] = useState('');

  return (
    <div className="min-h-screen flex flex-col p-6 space-y-4 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-800">Availability Map</h1>
      <div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded-md shadow-sm w-48"
        />
      </div>
      <div className="flex-1 relative rounded-md overflow-hidden shadow">
        <AvailabilityMapDash selectedDate={date} />
      </div>
    </div>
  );
}
