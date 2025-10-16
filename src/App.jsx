import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import VoterLogin from './components/Voter/VoterLogin';
import AuthenticationFlow from './components/Voter/AuthenticationFlow';
import VoteCasting from './components/Voter/VoteCasting';
import VoteSuccess from './components/Voter/VoteSuccess';
import './styles/global.css';

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentVoter, setCurrentVoter] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [votedCandidate, setVotedCandidate] = useState(null);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  const handleVoterLogin = (voter) => {
    setCurrentVoter(voter);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleVoteSuccess = (candidate) => {
    setVotedCandidate(candidate);
  };

  const handleComplete = () => {
    setCurrentVoter(null);
    setIsAuthenticated(false);
    setVotedCandidate(null);
  };

  const handleCancelAuth = () => {
    setCurrentVoter(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app">
        <Navbar
          isAdmin={isAdminLoggedIn}
          onAdminLogout={handleAdminLogout}
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <div className="landing-page">
                <div className="landing-content">
                  <h1>🗳️ Blockchain Voting System</h1>
                  <p className="landing-subtitle">
                    Secure, Transparent, and Democratic
                  </p>
                  <div className="landing-features">
                    <div className="feature">
                      <span className="feature-icon">🔐</span>
                      <h3>Multi-Factor Authentication</h3>
                      <p>Face, Fingerprint & OTP verification</p>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">🔗</span>
                      <h3>Blockchain Security</h3>
                      <p>Immutable and transparent vote records</p>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">✓</span>
                      <h3>One Vote Policy</h3>
                      <p>Prevention of duplicate voting</p>
                    </div>
                  </div>
                  <div className="landing-actions">
                    <a href="/voter" className="btn-primary btn-large">
                      Voter Login
                    </a>
                    <a href="/admin" className="btn-secondary btn-large">
                      Admin Access
                    </a>
                  </div>
                </div>
              </div>
            } />

            <Route path="/admin" element={
              isAdminLoggedIn ? (
                <AdminDashboard onLogout={handleAdminLogout} />
              ) : (
                <AdminLogin onLoginSuccess={handleAdminLogin} />
              )
            } />

            <Route path="/voter" element={
              votedCandidate ? (
                <VoteSuccess
                  candidate={votedCandidate}
                  onComplete={handleComplete}
                />
              ) : isAuthenticated ? (
                <VoteCasting
                  voter={currentVoter}
                  onVoteSuccess={handleVoteSuccess}
                />
              ) : currentVoter ? (
                <AuthenticationFlow
                  voter={currentVoter}
                  onAuthSuccess={handleAuthSuccess}
                  onCancel={handleCancelAuth}
                />
              ) : (
                <VoterLogin onLoginSuccess={handleVoterLogin} />
              )
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;