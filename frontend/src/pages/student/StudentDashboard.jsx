import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import axios from 'axios';

const API_BASE = "http://localhost:8080/api/internships";

// --- The Main Dashboard Component ---
const StudentDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('recommended'); // recommended, applied, all
  
  // This new state controls the modal
  const [selectedInternship, setSelectedInternship] = useState(null); 
  
  const [recommendations, setRecommendations] = useState([]);
  const [allInternships, setAllInternships] = useState([]);
  const [appliedInternships, setAppliedInternships] = useState([]);
  
  const [loading, setLoading] = useState(true);

  // --- 1. All Helper Components are defined INSIDE the main component ---

  // --- The Details Modal ---
  const InternshipModal = ({ internship, onClose, onApply, isApplied }) => (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={onClose} 
    >
      <div 
        className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-lg w-full border border-gray-700 m-4"
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className="text-3xl font-bold text-yellow-400 mb-3">{internship.program}</h2>
        <p className="text-xl text-gray-300 mb-4">{internship.organization}</p>
        
        <div className="text-gray-400 space-y-2 mb-6">
          <p><strong>Location:</strong> {internship.location}</p>
          <p><strong>Stipend:</strong> {internship.stipend || 'N/A'}</p>
          <p><strong>Skills:</strong> {internship.skills.join(', ')}</p>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-5 rounded-lg"
          >
            Close
          </button>
          
          {isApplied ? (
            <span className="font-semibold text-green-500 py-2 px-5">✓ Already Applied</span>
          ) : (
            <button
              onClick={() => onApply(internship._id)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-5 rounded-lg"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // --- The Internship Card ---
  const InternshipCard = ({ internship, onViewDetails, isApplied }) => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg transition-transform hover:scale-[1.02]">
      <h3 className="text-xl font-semibold text-yellow-400 mb-2">{internship.program}</h3>
      <p className="text-gray-300 mb-3">{internship.organization}</p>
      
      <div className="text-sm text-gray-400 mb-4">
        <p><strong>Location:</strong> {internship.location}</p>
      </div>
      
      <button
        onClick={() => onViewDetails(internship)}
        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
      >
        {isApplied ? "View Details" : "View & Apply"}
      </button>
    </div>
  );

  // --- The "Empty" Message ---
  const EmptyState = ({ message }) => (
    <div className="text-center p-10 bg-gray-800 rounded-lg border border-gray-700 col-span-full">
      <p className="text-gray-400">{message}</p>
    </div>
  );

  // --- The Tab Button ---
  const TabButton = ({ tabName, label }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`py-2 px-5 font-semibold transition-colors
          ${isActive 
            ? 'border-b-2 border-yellow-400 text-yellow-400' 
            : 'text-gray-400 hover:text-white'
          }`}
      >
        {label}
      </button>
    );
  };

  // --- 2. Data Fetching and Handling ---

  useEffect(() => {
    if (!user || !token) return;

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [recs, all, applied] = await Promise.all([
          axios.post(
            `${API_BASE}/recommendations`,
            { userId: user.id },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(`${API_BASE}/list`),
          axios.get(
            `${API_BASE}/applied`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ]);
        
        setRecommendations(recs.data);
        setAllInternships(all.data);
        setAppliedInternships(applied.data);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, [user, token]);

  const handleApply = async (internshipId) => {
    try {
      await axios.post(
        `${API_BASE}/${internshipId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh the "applied" list in the background
      const res = await axios.get(
        `${API_BASE}/applied`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppliedInternships(res.data);
      
      alert('Application successful!');
      setSelectedInternship(null); // Close the modal
      
    } catch (err) {
      console.error("Error applying:", err);
      alert(err.response?.data?.message || 'Error applying');
    }
  };

  const appliedIds = appliedInternships.map(i => i._id);

  // --- 3. The JSX to Render ---
  return (
    <div> 
      <h1 className="text-4xl font-bold mb-8">
        Welcome {user?.email || "Student"} 👋
      </h1>
      
      {/* --- Tab Navigation (This will work now) --- */}
      <div className="flex space-x-6 border-b border-gray-700 mb-8">
        <TabButton tabName="recommended" label="Recommended" />
        <TabButton tabName="applied" label="Applied" />
        <TabButton tabName="all" label="All Internships" />
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Recommended Tab */}
          {activeTab === 'recommended' && (
            recommendations.length > 0 ? (
              recommendations.map((internship) => (
                <InternshipCard 
                  key={internship._id}
                  internship={internship}
                  onViewDetails={setSelectedInternship} // Opens modal
                  isApplied={appliedIds.includes(internship._id)}
                />
              ))
            ) : <EmptyState message="No recommendations found yet." />
          )}

          {/* Applied Tab */}
          {activeTab === 'applied' && (
            appliedInternships.length > 0 ? (
              appliedInternships.map((internship) => (
                <InternshipCard 
                  key={internship._id}
                  internship={internship}
                  onViewDetails={setSelectedInternship} // Opens modal
                  isApplied={true}
                />
              ))
            ) : <EmptyState message="You haven't applied to any internships yet." />
          )}

          {/* All Internships Tab */}
          {activeTab === 'all' && (
            allInternships.length > 0 ? (
              allInternships.filter(i => i.status === 'approved').map((internship) => (
                <InternshipCard 
                  key={internship._id}
                  internship={internship}
                  onViewDetails={setSelectedInternship} // Opens modal
                  isApplied={appliedIds.includes(internship._id)}
                />
              ))
            ) : <EmptyState message="No internships are available." />
          )}
        </div>
      )}

      {/* --- Render The Modal --- */}
      {selectedInternship && (
        <InternshipModal
          internship={selectedInternship}
          onClose={() => setSelectedInternship(null)}
          onApply={handleApply}
          isApplied={appliedIds.includes(selectedInternship._id)}
        />
      )}
    </div>
  );
};

export default StudentDashboard;