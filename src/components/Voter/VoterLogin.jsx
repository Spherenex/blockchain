import React, { useState } from 'react';
import { getVoterByAadhaar } from '../../services/firebase';
import { validateAadhaar } from '../../utils/validators';
import '../../styles/voter.css';

const VoterLogin = ({ onLoginSuccess }) => {
    const [aadhaar, setAadhaar] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateAadhaar(aadhaar)) {
            setError('Please enter a valid 12-digit Aadhaar number');
            return;
        }

        setLoading(true);
        try {
            const voter = await getVoterByAadhaar(aadhaar);

            if (!voter) {
                setError('Voter not found. Please contact admin for registration.');
                setLoading(false);
                return;
            }

            if (voter.voteStatus === 1) {
                setError('You have already cast your vote. Thank you for participating!');
                setLoading(false);
                return;
            }

            onLoginSuccess(voter);
        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="voter-login-container">
            <div className="voter-login-card">
                <div className="voter-login-header">
                    <h2>🗳️ Voter Login</h2>
                    <p>Enter your Aadhaar number to begin authentication</p>
                </div>

                <form onSubmit={handleLogin} className="voter-login-form">
                    <div className="form-group">
                        <label>Aadhaar Number</label>
                        <input
                            type="text"
                            value={aadhaar}
                            onChange={(e) => setAadhaar(e.target.value)}
                            placeholder="Enter 12-digit Aadhaar"
                            maxLength="12"
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Verifying...' : 'Continue'}
                    </button>
                </form>

                <div className="voter-info">
                    <h3>Authentication Process:</h3>
                    <ol>
                        <li>Enter Aadhaar Number</li>
                        <li>Face Recognition</li>
                        <li>Fingerprint Verification</li>
                        <li>OTP Verification</li>
                        <li>Cast Your Vote</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default VoterLogin;