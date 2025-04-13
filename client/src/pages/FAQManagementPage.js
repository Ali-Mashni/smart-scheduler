// src/pages/FAQManagementPage.js
import React, { useContext, useState, useMemo } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import PrimaryButton from '../components/PrimaryButton';
import TextInput from '../components/TextInput';
import FAQItem from '../components/FAQItem';
import FAQForm from '../components/FAQForm';
import { FAQContext } from '../context/FAQContext';

export default function FAQManagementPage() {
  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useContext(FAQContext);
  const [search, setSearch] = useState('');
  const [selectedFAQId, setSelectedFAQId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [faqEdit, setFaqEdit] = useState({ question: '', answer: '' });
  const [isNewFAQ, setIsNewFAQ] = useState(false);

  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase())
    );
  }, [faqs, search]);

  const handleSelectFAQ = (faqId) => {
    setSelectedFAQId(faqId);
    setIsEditing(false);
    setIsNewFAQ(false);
    const faq = faqs.find((f) => f.id === faqId);
    if (faq) {
      setFaqEdit({ question: faq.question, answer: faq.answer });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFaqEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveFAQ = () => {
    if (!faqEdit.question.trim() || !faqEdit.answer.trim()) {
      alert('Please fill in both the question and answer.');
      return;
    }
    updateFAQ(selectedFAQId, { id: selectedFAQId, ...faqEdit });
    setIsEditing(false);
    setIsNewFAQ(false);
  };

  const handleDeleteFAQ = () => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      deleteFAQ(selectedFAQId);
      setSelectedFAQId(null);
      setIsEditing(false);
      setFaqEdit({ question: '', answer: '' });
      setIsNewFAQ(false);
    }
  };

  const handleAddNewFAQ = () => {
    const newId = Date.now();
    const newFAQ = { id: newId, question: '', answer: '' };
    addFAQ(newFAQ);
    setSelectedFAQId(newId);
    setFaqEdit({ question: '', answer: '' });
    setIsEditing(true);
    setIsNewFAQ(true);
  };

  const handleCancel = () => {
    if (isNewFAQ) {
      deleteFAQ(selectedFAQId);
      setSelectedFAQId(null);
      setFaqEdit({ question: '', answer: '' });
      setIsNewFAQ(false);
    }
    setIsEditing(false);
  };

  const selectedFAQ = faqs.find((faq) => faq.id === selectedFAQId);

  return (
    <div className="min-h-screen bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/manage-requests">Manage Requests</TopBarButton>
        <TopBarButton to="/faq-management" active>
          FAQ Management
        </TopBarButton>
        <TopBarButton to="/request-progress">Request Progress</TopBarButton>
        <TopBarButton to="/communication-dashboard">Communication</TopBarButton>
        <TopBarButton to="/customer-service">NewTicket</TopBarButton>
      </TopBar>

      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6">FAQ Management</h2>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar: Search field and FAQ list */}
          <div className="w-full md:w-1/3 bg-bgCard p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <TextInput
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <PrimaryButton onClick={handleAddNewFAQ} className="w-full px-4 py-2">
                Add New
              </PrimaryButton>
            </div>
            {filteredFAQs.length === 0 ? (
              <p className="text-gray-400">No FAQs found.</p>
            ) : (
              <ul className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <FAQItem
                    key={faq.id}
                    faq={faq}
                    isSelected={faq.id === selectedFAQId}
                    onSelect={handleSelectFAQ}
                  />
                ))}
              </ul>
            )}
          </div>
          {/* Main Panel: FAQ detail or form */}
          <div className="w-full md:w-2/3 bg-bgCard p-6 rounded-lg shadow-lg">
            {selectedFAQ ? (
              isEditing ? (
                <FAQForm 
                  faqEdit={faqEdit}
                  onChange={handleEditChange}
                  onSave={handleSaveFAQ}
                  onCancel={handleCancel}
                />
              ) : (
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    {selectedFAQ.question || 'No Question'}
                  </h3>
                  <p className="text-lg mb-6">
                    {selectedFAQ.answer || 'No Answer'}
                  </p>
                  <div className="flex gap-4">
                    <PrimaryButton onClick={() => setIsEditing(true)}>
                      Edit
                    </PrimaryButton>
                    <PrimaryButton onClick={handleDeleteFAQ}>
                      Delete
                    </PrimaryButton>
                  </div>
                </div>
              )
            ) : (
              <p className="text-gray-400 text-lg">
                Select an FAQ from the list to view its details.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
