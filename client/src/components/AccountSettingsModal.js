import React, { useState } from 'react';

const AccountSettingsModal = ({ onClose }) => {
    // Initialdata in a real this would come from a backend
    const [adminData, setAdminData] = useState({
        name: "Haitham ",
        position: "Senior Administrator",
        email: "haitham@smartscheduler.com",
        password: "••••••••",
        phone: "+966 555555587",
        assignedEmployees: [
            { id: "1", name: "Khalid" },
            { id: "2", name: "Ahmed" },
            { id: "3", name: "Ziad" },
            { id: "4", name: "Fahad" }
        ]
    });

    // States for editable fields
    const [email, setEmail] = useState(adminData.email);
    const [password, setPassword] = useState(adminData.password);
    const [phone, setPhone] = useState(adminData.phone);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    // Handle removing an employee
    const handleRemoveEmployee = (employeeId) => {
        setAdminData({
            ...adminData,
            assignedEmployees: adminData.assignedEmployees.filter(emp => emp.id !== employeeId)
        });
    };

    // Handle saving changes
    const handleSave = () => {
        setAdminData({
            ...adminData,
            email,
            password: isEditingPassword ? password : adminData.password,
            phone
        });
        setIsEditingPassword(false);
        // In a real send these changes to the backend
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-bgCard w-[450px] max-h-[80vh] rounded-lg shadow-lg overflow-hidden flex flex-col">
                {/* Modal Header with Close Button */}
                <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white">Account Settings</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors text-xl font-bold h-6 w-6 flex items-center justify-center"
                    >
                        ×
                    </button>
                </div>

                {/* Modal Content - Make scrollable */}
                <div className="p-4 overflow-y-auto flex-grow">
                    <div className="space-y-4">
                        {/* Administrator Info */}
                        <div>
                            <h4 className="text-white font-medium mb-2">Personal Information</h4>
                            <div className="space-y-3">
                                {/* Name (Not editable) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                    <div className="bg-inputBg border border-inputBorder rounded-md py-1.5 px-3 text-white">
                                        {adminData.name}
                                    </div>
                                </div>

                                {/* Position (Not editable) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Position</label>
                                    <div className="bg-inputBg border border-inputBorder rounded-md py-1.5 px-3 text-white">
                                        {adminData.position}
                                    </div>
                                </div>

                                {/* Email (Editable) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-inputBg border border-inputBorder rounded-md py-1.5 px-3 text-white"
                                    />
                                </div>

                                {/* Password (Editable) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                                    <div className="flex">
                                        {isEditingPassword ? (
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="flex-1 bg-inputBg border border-inputBorder rounded-md py-1.5 px-3 text-white"
                                            />
                                        ) : (
                                            <div className="flex-1 bg-inputBg border border-inputBorder rounded-md py-1.5 px-3 text-white">
                                                {adminData.password}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setIsEditingPassword(!isEditingPassword)}
                                            className="ml-2 px-3 bg-primary hover:bg-primaryHover rounded-md text-white"
                                        >
                                            {isEditingPassword ? "Cancel" : "Edit"}
                                        </button>
                                    </div>
                                </div>

                                {/* Phone (Editable) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-inputBg border border-inputBorder rounded-md py-1.5 px-3 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Assigned Employees */}
                        <div>
                            <h4 className="text-white font-medium mb-2">Assigned Employees</h4>
                            <div className="bg-bgMain rounded-md p-2 max-h-32 overflow-y-auto">
                                {adminData.assignedEmployees.length > 0 ? (
                                    <ul className="space-y-1">
                                        {adminData.assignedEmployees.map(employee => (
                                            <li key={employee.id} className="flex justify-between items-center">
                                                <span className="text-white">{employee.name}</span>
                                                <button
                                                    onClick={() => handleRemoveEmployee(employee.id)}
                                                    className="text-red-400 hover:text-red-300 transition-colors"
                                                >
                                                    <span className="text-xl">🗑️</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400 text-center py-2">No assigned employees</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end p-3 border-t border-gray-700 shrink-0">
                    <button
                        className="bg-gray-600 hover:bg-gray-700 px-3 py-1.5 rounded-md text-white mr-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-primary hover:bg-primaryHover px-3 py-1.5 rounded-md text-white"
                        onClick={handleSave}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountSettingsModal; 