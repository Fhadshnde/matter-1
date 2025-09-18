import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center justify-between text-right shadow-sm">
      <div className="flex flex-col">
        <span className="text-gray-400 text-xs mb-1">{title}</span>
        <p className="text-xl font-semibold mb-1">{value}</p>
      </div>
      <div className="bg-gray-100 p-2.5 rounded-full text-xl text-red-500">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;