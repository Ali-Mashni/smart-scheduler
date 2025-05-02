import React, { useState, useEffect } from 'react';
import api from '../api';

const AccountSettingsModal = ({ onClose }) => {
    // State for admin data
    const [adminData, setAdminData] = useState({
        name: "",
        position: "Administrator",
        email: "",
        password: "••••••••",
        phone: ""
    });

    // States for editable fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Fetch admin data when component mounts
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const res = await api.get('/api/auth/me');
                if (res.data.success) {
                    const userData = res.data.data;
                    setAdminData({
                        name: `${userData.firstName} ${userData.lastName}`,
                        position: userData.role === 'admin' ? 'Administrator' : 'Staff',
                        email: userData.email,
                        password: '••••••••',
                        phone: userData.phone || ''
                    });
                    setEmail(userData.email);
                    setPhone(userData.phone || '');
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching admin data:', err);
                setError('Failed to load admin data');
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    // Handle saving changes
    const handleSave = async () => {
        try {
            setSaveSuccess(false);
            const updateData = {
                email,
                phone
            };

            // Only include password if it was changed
            if (isEditingPassword && password) {
                updateData.password = password;
            }

            const res = await api.put('/api/admin/settings', updateData);

            if (res.data.success) {
                setAdminData({
                    ...adminData,
                    email,
                    password: isEditingPassword ? '••••••••' : adminData.password,
                    phone
                });
                setIsEditingPassword(false);
                setSaveSuccess(true);

                // Show success message briefly
                setTimeout(() => {
                    setSaveSuccess(false);
                }, 3000);
            }
        } catch (err) {
            console.error('Error updating admin settings:', err);
            setError('Failed to update settings');
            setTimeout(() => {
                setError(null);
            }, 3000);
        }
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
                    {loading ? (
                        <div className="text-center py-4">
                            <p className="text-gray-400">Loading account information...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-4">
                            <p className="text-red-400">{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {saveSuccess && (
                                <div className="bg-green-900 text-green-200 p-2 rounded text-center mb-3">
                                    Settings updated successfully!
                                </div>
                            )}

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
                                                    placeholder="Enter new password"
                                                />
                                            ) : (
                                                <div className="flex-1 bg-inputBg border border-inputBorder rounded-md py-1.5 px-3 text-white">
                                                    {adminData.password}
                                                </div>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setIsEditingPassword(!isEditingPassword);
                                                    if (isEditingPassword) {
                                                        setPassword('');
                                                    }
                                                }}
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
                        </div>
                    )}
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
                        disabled={loading}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountSettingsModal; 