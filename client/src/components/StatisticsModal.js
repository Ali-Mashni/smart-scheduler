import React from 'react';

const StatisticsModal = ({ onClose, statistics }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-bgCard w-[700px] rounded-lg shadow-lg overflow-hidden">
                {/* Modal Header with Close Button */}
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white">Detailed Statistics</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors text-xl font-bold h-6 w-6 flex items-center justify-center"
                    >
                        ×
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* New Users Section */}
                        <div className="bg-bgMain p-5 rounded-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-700 text-white mr-3">
                                    <span className="text-xl font-bold">+</span>
                                </div>
                                <div>
                                    <h4 className="text-white text-lg font-semibold">New Users</h4>
                                    <p className="text-gray-400 text-sm">Last 30 days</p>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-3">{statistics.newUsers}</div>
                            <div className="h-2 bg-gray-700 rounded-full mb-3">
                                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Previous: 418</span>
                                <span className="text-green-400">+40.2%</span>
                            </div>
                        </div>

                        {/* Active Users Section */}
                        <div className="bg-bgMain p-5 rounded-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-700 text-white mr-3">
                                    <span className="text-xl font-bold">👥</span>
                                </div>
                                <div>
                                    <h4 className="text-white text-lg font-semibold">Active Users</h4>
                                    <p className="text-gray-400 text-sm">Current engagement rate</p>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-3">{statistics.activeUsers}</div>
                            <div className="h-2 bg-gray-700 rounded-full mb-3">
                                <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '95%' }}></div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Previous: 92%</span>
                                <span className="text-green-400">+3.2%</span>
                            </div>
                        </div>

                        {/* Closed Requests Section */}
                        <div className="bg-bgMain p-5 rounded-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-700 text-white mr-3">
                                    <span className="text-xl font-bold">✓</span>
                                </div>
                                <div>
                                    <h4 className="text-white text-lg font-semibold">Closed Requests</h4>
                                    <p className="text-gray-400 text-sm">Resolution rate</p>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-3">{statistics.closedRequests}</div>
                            <div className="h-2 bg-gray-700 rounded-full mb-3">
                                <div className="h-2 bg-purple-600 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Previous: 76%</span>
                                <span className="text-green-400">+5.3%</span>
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