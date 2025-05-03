import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import TicketModal from '../components/TicketModal';
import AccountSettingsModal from '../components/AccountSettingsModal';
import StatisticsModal from '../components/StatisticsModal';
import api from '../api';

export default function AdminDashboard() {
    // State for user data
    const [adminName, setAdminName] = useState("Admin");
    const [unresolvedTickets, setUnresolvedTickets] = useState([]);
    const [solvedTickets, setSolvedTickets] = useState([]);
    const [customerServiceStaff, setCustomerServiceStaff] = useState([]);
    const [statisticsData, setStatisticsData] = useState({
        totalUsers: 0,
        totalRequests: 0,
        resolvedRequests: 0,
        solvedRate: "0%"
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // track which category is selected
    const [activeCategory, setActiveCategory] = useState('unresolved');

    // active ticket list based on selected category
    const [escalatedRequests, setEscalatedRequests] = useState([]);

    // Fetch admin user data
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                fetchUserData(decoded.id);
            } catch (err) {
                console.error('Error decoding token:', err);
                setError('Session expired. Please login again.');
            }
        }
    }, []);

    // Fetch user data
    const fetchUserData = async (userId) => {
        try {
            const res = await api.get(`/api/auth/user/${userId}`);
            if (res.data.success) {
                setAdminName(`${res.data.data.firstName} ${res.data.data.lastName}`);
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    };

    // Fetch all data
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch escalated tickets
                const escalatedRes = await api.get('/api/admin/tickets/escalated');
                setUnresolvedTickets(escalatedRes.data.data);

                // Fetch resolved tickets
                const resolvedRes = await api.get('/api/admin/tickets/resolved');
                setSolvedTickets(resolvedRes.data.data);

                // Fetch support staff
                const staffRes = await api.get('/api/admin/support-staff');
                setCustomerServiceStaff(staffRes.data.data);

                // Fetch statistics
                const statsRes = await api.get('/api/admin/statistics');
                setStatisticsData(statsRes.data.data);

                // Set initial active category
                setEscalatedRequests(escalatedRes.data.data);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try refreshing the page.');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    //  category change
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setSelectedTicket(null);

        // Get the current tickets based on category
        const ticketsToDisplay = category === 'unresolved' ? unresolvedTickets : solvedTickets;
        setEscalatedRequests(ticketsToDisplay);
    };

    // modal State
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);

    // Handle opening a ticket modal
    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
    };

    // Handle closing the modal
    const handleCloseModal = () => {
        setSelectedTicket(null);
    };

    // Handle opening settings modal
    const handleSettingsClick = () => {
        setIsSettingsModalOpen(true);
    };

    // Handle closing settings modal
    const handleCloseSettings = () => {
        setIsSettingsModalOpen(false);
    };

    // Handle opening statistics modal
    const handleStatisticsClick = () => {
        setIsStatisticsModalOpen(true);
    };

    // Handle closing statistics modal
    const handleCloseStatistics = () => {
        setIsStatisticsModalOpen(false);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    // Handle resolving a ticket
    const handleResolveTicket = async (ticketId) => {
        try {
            // Only apply this logic to unresolved tickets
            if (activeCategory === 'unresolved') {
                // Extract the actual MongoDB ID if it's in the format "#id"
                const actualId = ticketId.startsWith('#') ? ticketId.substring(1) : ticketId;

                // Call API to resolve the ticket
                const res = await api.put(`/api/admin/tickets/${actualId}/resolve`);

                if (res.data.success) {
                    // Find the resolved ticket before removing it
                    const resolvedTicket = unresolvedTickets.find(ticket =>
                        ticket._id === actualId || ticket.id === ticketId
                    );

                    // Remove the ticket from unresolved tickets (exclude the resolved ticket)
                    const updatedUnresolved = unresolvedTickets.filter(ticket =>
                        !(ticket._id === actualId || ticket.id === ticketId)
                    );

                    // Update the unresolved tickets state
                    setUnresolvedTickets(updatedUnresolved);

                    if (resolvedTicket) {
                        // Create a new resolved ticket with updated status
                        const newSolvedTicket = {
                            ...resolvedTicket,
                            status: "Solved",
                            statusColor: "green",
                            timeLabel: "Resolved just now"
                        };

                        // Add to solved tickets
                        setSolvedTickets(prev => [newSolvedTicket, ...prev]);
                    }

                    // Update the displayed escalated requests
                    setEscalatedRequests(updatedUnresolved);

                    // Close the modal
                    setSelectedTicket(null);
                }
            }
        } catch (err) {
            console.error('Error resolving ticket:', err);
            alert('Failed to resolve ticket. Please try again.');
        }
    };

    // Handle reassigning a ticket
    const handleReassignTicket = async (ticketId, agentId, message) => {
        try {
            // Extract the actual MongoDB ID if it's in the format "#id"
            const actualId = ticketId.startsWith('#') ? ticketId.substring(1) : ticketId;

            // Call API to reassign the ticket
            const res = await api.put(`/api/admin/tickets/${actualId}/reassign`, {
                agentId,
                message
            });

            if (res.data.success) {
                // If in unresolved category, update the display
                if (activeCategory === 'unresolved') {
                    // Find the ticket and update its assignment
                    const updatedTickets = unresolvedTickets.map(ticket => {
                        if (ticket._id === actualId || ticket.id === ticketId) {
                            // Find the agent name
                            const agent = customerServiceStaff.find(a => a.id === agentId);
                            return {
                                ...ticket,
                                assignedAgent: agentId,
                                timeLabel: `Reassigned to ${agent ? agent.name : 'agent'} just now`
                            };
                        }
                        return ticket;
                    });

                    setUnresolvedTickets(updatedTickets);
                    setEscalatedRequests(updatedTickets);
                }

                // Close the modal
                setSelectedTicket(null);
            }
        } catch (err) {
            console.error('Error reassigning ticket:', err);
            alert('Failed to reassign ticket. Please try again.');
        }
    };

    // Show loading indicator
    if (loading) {
        return (
            <div className="min-h-screen bg-bgMain text-white flex flex-col items-center justify-center">
                <div className="text-xl">Loading dashboard data...</div>
            </div>
        );
    }

    // Show error message
    if (error) {
        return (
            <div className="min-h-screen bg-bgMain text-white flex flex-col items-center justify-center">
                <div className="text-xl text-red-500 mb-4">{error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-primary hover:bg-opacity-80 px-4 py-2 rounded-md"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bgMain text-white flex flex-col">
            <TopBar>
                <TopBarButton to="/admin" active>Dashboard</TopBarButton>
                <div className="ml-auto flex items-center mr-4">
                    <span className="text-sm mr-2">Welcome, {adminName}</span>
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                        {adminName.charAt(0)}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md text-sm"
                    >
                        Logout
                    </button>
                </div>
            </TopBar>

            {/* ✅ Responsive wrapping layout */}
            <div className="flex flex-grow flex-wrap md:flex-nowrap overflow-auto">
                {/* Left Sidebar */}
                <div className="w-full md:w-[220px] border-r border-gray-700 flex flex-col">
                    <div className="flex flex-col items-center py-4 border-b border-gray-700">
                        <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center mb-3 cursor-pointer">
                            <span className="text-xl font-bold">✉️</span>
                        </div>
                        <div
                            className="w-10 h-10 bg-bgCard rounded-md flex items-center justify-center cursor-pointer hover:bg-opacity-80"
                            onClick={handleSettingsClick}
                        >
                            <span className="text-xl font-bold">⚙️</span>
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto px-4 py-4">
                        <div className="text-xs uppercase text-gray-400 mb-3">Ticket Categories</div>
                        <div
                            className={`mb-2 text-sm rounded-md p-2.5 cursor-pointer ${activeCategory === 'unresolved' ? 'bg-primary' : 'bg-bgCard'}`}
                            onClick={() => handleCategoryChange('unresolved')}
                        >
                            Escalated
                            <span className="ml-2 text-xs px-1.5 py-0.5 bg-gray-700 rounded-md">{unresolvedTickets.length}</span>
                        </div>
                        <div
                            className={`mb-2 text-sm rounded-md p-2.5 cursor-pointer ${activeCategory === 'solved' ? 'bg-primary' : 'bg-bgCard'}`}
                            onClick={() => handleCategoryChange('solved')}
                        >
                            Solved Tickets
                            <span className="ml-2 text-xs px-1.5 py-0.5 bg-gray-700 rounded-md">{solvedTickets.length}</span>
                        </div>
                    </div>
                </div>

                {/* Central Panel */}
                <div className="flex-grow min-w-[300px] overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold">
                            {activeCategory === 'unresolved' ? 'Unresolved Tickets' : 'Solved Tickets'}
                        </h1>
                        <div className="flex items-center text-sm">
                            <div className="flex bg-bgCard rounded-md overflow-hidden">
                                <div className="bg-primary px-3 py-1.5">
                                    {activeCategory === 'unresolved' ? 'Open' : 'Closed'} ({escalatedRequests.length})
                                </div>
                            </div>
                        </div>
                    </div>

                    {escalatedRequests.length === 0 ? (
                        <div className="flex items-center justify-center h-40 bg-bgCard rounded-md p-4">
                            <p className="text-gray-400">No {activeCategory === 'unresolved' ? 'open' : 'resolved'} tickets found.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {escalatedRequests.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="flex items-center bg-bgCard rounded-md p-4 cursor-pointer hover:bg-opacity-80"
                                    onClick={() => handleTicketClick(ticket)}
                                >
                                    <div className="mr-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className="mr-4 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                        {ticket.avatar}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-medium">{ticket.title}</div>
                                        <div className="text-xs text-gray-400">{ticket.timeLabel}</div>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs mr-4 ${ticket.statusColor === 'red' ? 'bg-red-900 text-red-200'
                                        : ticket.statusColor === 'green' ? 'bg-green-900 text-green-200'
                                            : 'bg-blue-900 text-blue-200'
                                        }`}>
                                        {ticket.status}
                                    </div>
                                    <div className="text-sm text-gray-400">{ticket.id}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="w-full md:w-[280px] border-l border-gray-700 p-4 overflow-y-auto">
                    <div
                        className="bg-bgCard rounded-md p-4 mb-6 cursor-pointer hover:bg-opacity-80 transition-all"
                        onClick={handleStatisticsClick}
                    >
                        <div className="text-sm font-medium mb-4 flex items-center justify-between">
                            <span>Website Statistics</span>
                            <span className="text-gray-400">❯</span>
                        </div>
                        <div className="flex justify-center items-center h-32 relative">
                            <div className="absolute w-20 h-20 rounded-full flex items-center justify-center text-center text-xs border-4 border-indigo-700 bg-bgMain left-6 top-2">
                                <div>
                                    <div>{statisticsData.totalUsers || 0}</div>
                                    <div className="text-gray-400">Total Users</div>
                                </div>
                            </div>
                            <div className="absolute w-32 h-32 rounded-full flex items-center justify-center text-center text-sm border-4 border-indigo-700 bg-indigo-700 right-2">
                                <div>
                                    <div className="text-lg font-bold">{statisticsData.totalRequests || 0}</div>
                                    <div className="text-xs">Total Tickets</div>
                                </div>
                            </div>
                            <div className="absolute w-24 h-24 rounded-full flex items-center justify-center text-center text-xs border-4 border-green-600 bg-bgMain bottom-0 left-12">
                                <div>
                                    <div>{statisticsData.solvedRate || "0%"}</div>
                                    <div className="text-gray-400">Solved Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="text-sm font-medium mb-4">Customer Service</div>
                        {customerServiceStaff.length === 0 ? (
                            <div className="text-gray-400 text-sm">No support staff found.</div>
                        ) : (
                            customerServiceStaff.map((staff) => (
                                <div key={staff.id} className="flex items-center justify-between mb-3">
                                    <div className="text-sm">{staff.name}</div>
                                    <div className="flex items-center">
                                        <div className="text-xs text-gray-400 mr-2">
                                            Progress: {staff.ticketsAssigned > 0
                                                ? Math.round((staff.ticketsHandled / staff.ticketsAssigned) * 100)
                                                : 0}%
                                        </div>
                                        <button className="text-gray-400 hover:text-white">
                                            <span className="text-xl">✉️</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Ticket Modal */}
            {selectedTicket && (
                <TicketModal
                    ticket={selectedTicket}
                    onClose={handleCloseModal}
                    onResolve={handleResolveTicket}
                    onReassign={handleReassignTicket}
                    customerServiceAgents={customerServiceStaff}
                />
            )}

            {/* Account Settings Modal */}
            {isSettingsModalOpen && (
                <AccountSettingsModal onClose={handleCloseSettings} />
            )}

            {/* Statistics Modal */}
            {isStatisticsModalOpen && (
                <StatisticsModal
                    statistics={statisticsData}
                    onClose={handleCloseStatistics}
                />
            )}
        </div>
    );
} 