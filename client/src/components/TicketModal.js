import React, { useState } from 'react';

const TicketModal = ({ ticket, onClose, onResolve, onReassign, customerServiceAgents }) => {
    const [isReassignView, setIsReassignView] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [message, setMessage] = useState('');

    // Check if ticket solved
    const isSolved = ticket.status === 'Solved';

    // Toggle reassign view
    const handleReassignClick = () => {
        setIsReassignView(true);
    };

    // Handle  send reassignment 
    const handleSendReassignment = () => {
        if (selectedAgent) {
            onReassign(ticket.id, selectedAgent, message);
            onClose();
        }
    };

    // Reset state and close 
    const handleClose = () => {
        setIsReassignView(false);
        setSelectedAgent('');
        setMessage('');
        onClose();
    };

    // Handle resolve action
    const handleResolve = () => {
        onResolve(ticket.id);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-bgCard w-[500px] rounded-lg shadow-lg overflow-hidden">
                {/* Modal Header with Close Button */}
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white">{ticket.title}</h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Content */}
                {isReassignView ? (
                    // Reassign View 
                    <div className="p-6">
                        <h4 className="text-white font-medium mb-4">Reassign Ticket to Employee</h4>

                        <div className="space-y-3 mb-6">
                            {customerServiceAgents.map((agent) => (
                                <div key={agent.id} className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        id={`agent-${agent.id}`}
                                        name="agent"
                                        value={agent.id}
                                        checked={selectedAgent === agent.id}
                                        onChange={() => setSelectedAgent(agent.id)}
                                        className="h-4 w-4 text-primary"
                                    />
                                    <label htmlFor={`agent-${agent.id}`} className="text-white">
                                        {agent.name} <span className="text-xs text-gray-400">(Progress: {agent.progress}%)</span>
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows="4"
                                className="w-full bg-inputBg border border-inputBorder rounded-md py-2 px-3 text-sm text-white"
                                placeholder="Add instructions for the employee..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                ) : (
                    // Details View 
                    <div className="p-6">
                        <p className="text-gray-300 mb-6">
                            {ticket.description || "No description provided."}
                        </p>
                        <div className="flex justify-between mb-2">
                            <div className="text-sm">
                                <span className="text-gray-400">Ticket ID: </span>
                                <span className="text-white">{ticket.id}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-gray-400">Status: </span>
                                <span className={`${ticket.statusColor === 'red'
                                    ? 'text-red-400'
                                    : ticket.statusColor === 'green'
                                        ? 'text-green-400'
                                        : 'text-blue-400'
                                    }`}>
                                    {ticket.status}
                                </span>
                            </div>
                        </div>
                        <div className="text-sm mb-6">
                            <span className="text-gray-400">
                                {isSolved ? 'Resolution time: ' : 'Customer responded: '}
                            </span>
                            <span className="text-white">{ticket.timeLabel}</span>
                        </div>
                    </div>
                )}

                {/* Modal Footer */}
                <div className="flex justify-between p-4 border-t border-gray-700">
                    {isReassignView ? (
                        // Reassign View Buttons
                        <>
                            <button
                                className="text-gray-400 hover:text-white"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                className={`bg-primary hover:bg-primaryHover px-4 py-2 rounded-md text-white ${!selectedAgent ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                onClick={handleSendReassignment}
                                disabled={!selectedAgent}
                            >
                                Send
                            </button>
                        </>
                    ) : (
                        // Details View Buttons
                        <>
                            {isSolved ? (
                                // Solved ticket just needs a close button
                                <button
                                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-white mx-auto"
                                    onClick={handleClose}
                                >
                                    Close
                                </button>
                            ) : (
                                // Unresolved ticket has resolve and reassign 
                                <>
                                    <button
                                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white"
                                        onClick={handleResolve}
                                    >
                                        Resolve
                                    </button>
                                    <button
                                        className="bg-primary hover:bg-primaryHover px-4 py-2 rounded-md text-white"
                                        onClick={handleReassignClick}
                                    >
                                        Reassign
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketModal; 