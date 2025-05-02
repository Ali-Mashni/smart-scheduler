import React from 'react';

const StatisticsModal = ({ onClose, statistics }) => {
    // Calculate percentage for progress bar width
    const solvedRateNumber = parseInt(statistics.solvedRate || '0', 10);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-bgCard w-[700px] rounded-lg shadow-lg overflow-hidden">
                {/* Modal Header with Close Button */}
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white">System Statistics</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors text-xl font-bold h-6 w-6 flex items-center justify-center"
                    >
                        ×
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Total Users Section */}
                        <div className="bg-bgMain p-5 rounded-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-700 text-white mr-3">
                                    <span className="text-xl font-bold">👥</span>
                                </div>
                                <div>
                                    <h4 className="text-white text-lg font-semibold">Total Users</h4>
                                    <p className="text-gray-400 text-sm">All registered users</p>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-3">{statistics.totalUsers || 0}</div>
                        </div>

                        {/* Total Requests Section */}
                        <div className="bg-bgMain p-5 rounded-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-700 text-white mr-3">
                                    <span className="text-xl font-bold">📋</span>
                                </div>
                                <div>
                                    <h4 className="text-white text-lg font-semibold">Total Support Requests</h4>
                                    <p className="text-gray-400 text-sm">All-time total tickets</p>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-3">{statistics.totalRequests || 0}</div>
                            <div className="text-sm text-gray-400">
                                Resolved tickets: {statistics.resolvedRequests || 0}
                            </div>
                        </div>

                        {/* Solved Request Rate Section */}
                        <div className="bg-bgMain p-5 rounded-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-700 text-white mr-3">
                                    <span className="text-xl font-bold">✓</span>
                                </div>
                                <div>
                                    <h4 className="text-white text-lg font-semibold">Solved Request Rate</h4>
                                    <p className="text-gray-400 text-sm">Percentage of resolved tickets</p>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-3">{statistics.solvedRate || '0%'}</div>
                            <div className="h-2 bg-gray-700 rounded-full mb-3">
                                <div
                                    className="h-2 bg-green-600 rounded-full"
                                    style={{ width: `${solvedRateNumber}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end p-4 border-t border-gray-700">
                    <button
                        className="bg-primary hover:bg-primaryHover px-4 py-2 rounded-md text-white"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatisticsModal; 