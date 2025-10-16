import React, { useState } from 'react';
import CandidateManagement from './CandidateManagement';
import VoterManagement from './VoterManagement';
import VotingStats from './VotingStats';
import '../../styles/admin.css';

const AdminDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('stats');

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>🗳️ Admin Dashboard</h1>
                <button onClick={onLogout} className="btn-logout">
                    Logout
                </button>
            </header>

            <nav className="admin-nav">
                <button
                    className={activeTab === 'stats' ? 'active' : ''}
                    onClick={() => setActiveTab('stats')}
                >
                    📊 Voting Statistics
                </button>
                <button
                    className={activeTab === 'candidates' ? 'active' : ''}
                    onClick={() => setActiveTab('candidates')}
                >
                    👥 Manage Candidates
                </button>
                <button
                    className={activeTab === 'voters' ? 'active' : ''}
                    onClick={() => setActiveTab('voters')}
                >
                    🗳️ Manage Voters
                </button>
            </nav>

            <main className="admin-content">
                {activeTab === 'stats' && <VotingStats />}
                {activeTab === 'candidates' && <CandidateManagement />}
                {activeTab === 'voters' && <VoterManagement />}
            </main>
        </div>
    );
};

export default AdminDashboard;