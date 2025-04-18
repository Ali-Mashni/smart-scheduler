import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import TicketModal from '../components/TicketModal';
import AccountSettingsModal from '../components/AccountSettingsModal';
import StatisticsModal from '../components/StatisticsModal';

export default function AdminDashboard() {
    // Mock data for the dashboard
    const adminName = "Haitham Alzahrani";

    // Mock data for unresolved escalated requests 
    const unresolvedTickets = [
        {
            id: "#6493",
            avatar: "D",
            title: "Lost my Schedule",
            description: "Customer unable to see any scheduled tasks after update.",
            status: "Overdue by 3 days",
            statusColor: "red",
            timeLabel: "Customer responded 1h ago"
        },
        {
            id: "#6587",
            avatar: "K",
            title: "Can't access my calendar",
            description: "Calendar page stuck on loading indefinitely.",
            status: "Respond in 2h",
            statusColor: "blue",
            timeLabel: "Customer responded 3h ago"
        },
        {
            id: "#6721",
            avatar: "M",
            title: "Schedule not syncing",
            description: "Customer's schedule is not syncing between their devices.",
            status: "Overdue by 1 day",
            statusColor: "red",
            timeLabel: "Customer responded 5h ago"
        },
        {
            id: "#6845",
            avatar: "A",
            title: "Missing study sessions",
            description: "Customer reports that their study sessions are not showing in the calendar.",
            status: "Respond in 4h",
            statusColor: "blue",
            timeLabel: "Customer responded 30m ago"
        },
        {
            id: "#6901",
            avatar: "S",
            title: "Notification issues",
            description: "Customer is not receiving scheduled notifications for their events.",
            status: "Overdue by 2 days",
            statusColor: "red",
            timeLabel: "Customer responded 2h ago"
        },
    ];

    // Mock data for solved tickets
    const solvedTickets = [
        {
            id: "#6201",
            avatar: "J",
            title: "Account login issue",
            description: "Customer was unable to login due to password reset issues. Fixed by sending a new reset link.",
            status: "Solved",
            statusColor: "green",
            timeLabel: "Resolved 2d ago"
        },
        {
            id: "#6325",
            avatar: "L",
            title: "Task reminders not working",
            description: "Customer's notification settings were disabled. Helped them enable notifications.",
            status: "Solved",
            statusColor: "green",
            timeLabel: "Resolved 1d ago"
        },
        {
            id: "#6418",
            avatar: "R",
            title: "Calendar export failing",
            description: "Export feature was failing due to browser compatibility. Provided alternative method.",
            status: "Solved",
            statusColor: "green",
            timeLabel: "Resolved 4h ago"
        },
    ];

    // Statistics data
    const statisticsData = {
        newUsers: 586,
        activeUsers: "95%",
        closedRequests: "80%"
    };

    // track which category is selected
    const [activeCategory, setActiveCategory] = useState('unresolved');

    // active ticket list based on selected category
    const [escalatedRequests, setEscalatedRequests] = useState(unresolvedTickets);

    //  category change
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setSelectedTicket(null);

        if (category === 'unresolved') {
            setEscalatedRequests(unresolvedTickets);
        } else {
            setEscalatedRequests(solvedTickets);
        }
    };

    // Mock data for customer service staff
    const customerServiceStaff = [
        { id: "1", name: "Khalid", progress: 87 },
        { id: "2", name: "Ahmed", progress: 70 },
        { id: "3", name: "Ziad", progress: 92 },
        { id: "4", name: "Fahad", progress: 67 },
    ];

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
        // In a real app, you would implement actual logout logic here
        console.log('Logging out...');
        window.location.href = '/login';
    };

    // Handle resolving a ticket
    const handleResolveTicket = (ticketId) => {
        // Only apply this logic to unresolved tickets
        if (activeCategory === 'unresolved') {
            // Find the ticket being resolved
            const resolvedTicket = unresolvedTickets.find(ticket => ticket.id === ticketId);

            if (resolvedTicket) {
                // Create a new resolved ticket with updated status
                const newSolvedTicket = {
                    ...resolvedTicket,
                    status: "Solved",
                    statusColor: "green",
                    timeLabel: "Resolved just now"
                };

                // Add to solved tickets
                solvedTickets.unshift(newSolvedTicket);

                // Remove from unresolved and update display
                const updatedUnresolved = unresolvedTickets.filter(ticket => ticket.id !== ticketId);

                // Update state
                setEscalatedRequests(updatedUnresolved);
            }
        }
    };

    // Handle reassigning a ticket
    const handleReassignTicket = (ticketId, agentId, message) => {
        // In a real send this to the backend
        console.log(`Reassigning ticket ${ticketId} to agent ${agentId} with message: ${message}`);

        // Only remove from unresolved tickets
        if (activeCategory === 'unresolved') {
            const updatedRequests = escalatedRequests.filter(ticket => ticket.id !== ticketId);
            setEscalatedRequests(updatedRequests);
        }
    };

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

            <div className="flex flex-grow overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-[220px] border-r border-gray-700 flex flex-col">
                    {/* Main Navigation Icons */}
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

                    {/* Ticket Categories */}
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
                            Escalated but Solved
                            <span className="ml-2 text-xs px-1.5 py-0.5 bg-gray-700 rounded-md">{solvedTickets.length}</span>
                        </div>
                    </div>
                </div>

                {/* Central Panel (Escalated Requests) */}
                <div className="flex-grow overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold">
                            {activeCategory === 'unresolved' ? 'Unresolved Tickets' : 'Solved Tickets'}
                        </h1>
                        <div className="flex items-center text-sm">
                            <div className="flex bg-bgCard rounded-md mr-4 overflow-hidden">
                                <div className="bg-primary px-3 py-1.5">
                                    {activeCategory === 'unresolved' ? 'Open' : 'Closed'} ({escalatedRequests.length})
                                </div>
                            </div>
                            <div className="flex items-center text-gray-400">
                                Sort by: Newest
                                <span className="ml-1 text-xs">▼</span>
                            </div>
                        </div>
                    </div>

                    {/* Ticket List */}
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
                                <div className={`px-2 py-1 rounded text-xs mr-4 ${ticket.statusColor === 'red'
                                    ? 'bg-red-900 text-red-200'
                                    : ticket.statusColor === 'green'
                                        ? 'bg-green-900 text-green-200'
                                        : 'bg-blue-900 text-blue-200'
                                    }`}>
                                    {ticket.status}
                                </div>
                                <div className="text-sm text-gray-400">{ticket.id}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel (Website Stats and Customer Service) */}
                <div className="w-[280px] border-l border-gray-700 p-4 overflow-y-auto">
                    {/* Website Stats */}
                    <div
                        className="bg-bgCard rounded-md p-4 mb-6 cursor-pointer hover:bg-opacity-80 transition-all"
                        onClick={handleStatisticsClick}
                    >
                        <div className="text-sm font-medium mb-4 flex items-center justify-between">
                            <span>Website Statistics</span>
                            <span className="text-gray-400">❯</span>
                        </div>
                        <div className="flex justify-center items-center h-32 relative">
                            {/* Create overlapping circles for stats */}
                            <div className="absolute w-20 h-20 rounded-full flex items-center justify-center text-center text-xs border-4 border-indigo-700 bg-bgMain left-6 top-2">
                                <div>
                                    <div>{statisticsData.newUsers}</div>
                                    <div className="text-gray-400">New Users</div>
                                </div>
                            </div>
                            <div className="absolute w-32 h-32 rounded-full flex items-center justify-center text-center text-sm border-4 border-indigo-700 bg-indigo-700 right-2">
                                <div>
                                    <div className="text-lg font-bold">{statisticsData.activeUsers}</div>
                                    <div className="text-xs">Active Users</div>
                                </div>
                            </div>
                            <div className="absolute w-24 h-24 rounded-full flex items-center justify-center text-center text-xs border-4 border-purple-600 bg-bgMain bottom-0 left-12">
                                <div>
                                    <div>{statisticsData.closedRequests}</div>
                                    <div className="text-gray-400">Closed Requests</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <div className="text-sm font-medium mb-4">Customer Service</div>
                        {customerServiceStaff.map((staff) => (
                            <div key={staff.id} className="flex items-center justify-between mb-3">
                                <div className="text-sm">{staff.name}</div>
                                <div className="flex items-center">
                                    <div className="text-xs text-gray-400 mr-2">Progress: {staff.progress}%</div>
                                    <button className="text-gray-400 hover:text-white">
                                        <span className="text-xl">✉️</span>
                                    </button>
                                </div>
                            </div>
                        ))}
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