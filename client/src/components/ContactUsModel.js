import React, { useState } from 'react';

const ContactUsModel = ({ onClose }) => {
   
    // Handle Sending Message
    const handleSend = () => {
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-bgCard w-[450px] max-h-[80vh] rounded-lg shadow-lg overflow-hidden flex flex-col">
                {/* Modal Header with Close Button */}
                <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white">Contact Us</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors text-xl font-bold h-6 w-6 flex items-center justify-center"
                    >
                        ×
                    </button>
                </div>

                {/* Modal Content - Make scrollable */}
                <div className="p-4 overflow-y-auto flex-grow">
                    <div className="space-y-4 ">
                        {/* Administrator Info */}
                        <div>
                            <h4 className="text-white font-medium mb-2">Write Message</h4>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex">
                                                <textarea
                                                className="resize-none h-40 w-full bg-inputBg border border-inputBorder rounded-md py-1.5 px-3 text-white"
                                                ></textarea>
                                    </div>
                                </div>
                                
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
                        onClick={handleSend}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactUsModel; 