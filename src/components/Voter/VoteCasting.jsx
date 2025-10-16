import React, { useState, useEffect } from 'react';
import { getCandidates, castVote } from '../../services/firebase';
import { createVoteBlock } from '../../services/blockchain';

const VoteCasting = ({ voter, onVoteSuccess }) => {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        try {
            const data = await getCandidates();
            setCandidates(Object.values(data));
        } catch (error) {
            setError('Failed to load candidates');
            console.error(error);
        }
    };

    const handleVote = async () => {
        if (!selectedCandidate) {
            setError('Please select a candidate');
            return;
        }

        if (!window.confirm(`Confirm vote for ${selectedCandidate.name}?`)) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Create blockchain block for vote
            const voteData = {
                voterId: voter.id,
                candidateId: selectedCandidate.id,
                timestamp: new Date().toISOString()
            };

            const blockchainData = createVoteBlock(voteData);

            // Record vote in Firebase
            await castVote(voter.id, selectedCandidate.id, blockchainData);

            onVoteSuccess(selectedCandidate);
        } catch (error) {
            setError('Failed to cast vote. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="vote-casting-container">
            <div className="vote-casting-card">
                <div className="vote-header">
                    <h2>🗳️ Cast Your Vote</h2>
                    <p>Voter: {voter.name}</p>
                    <p className="vote-instruction">Select your preferred candidate and confirm</p>
                </div>

                <div className="candidates-list">
                    {candidates.map(candidate => (
                        <div
                            key={candidate.id}
                            className={`candidate-card ${selectedCandidate?.id === candidate.id ? 'selected' : ''}`}
                            onClick={() => setSelectedCandidate(candidate)}
                        >
                            <div className="candidate-info">
                                <h3>{candidate.name}</h3>
                                <p><strong>ID:</strong> {candidate.id}</p>
                                <p><strong>Phone:</strong> {candidate.phone}</p>
                                <p><strong>Education:</strong> {candidate.education}</p>
                            </div>
                            <div className="selection-indicator">
                                {selectedCandidate?.id === candidate.id && '✓'}
                            </div>
                        </div>
                    ))}
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="vote-actions">
                    <button
                        onClick={handleVote}
                        className="btn-primary btn-vote"
                        disabled={loading || !selectedCandidate}
                    >
                        {loading ? 'Casting Vote...' : 'Confirm & Cast Vote'}
                    </button>
                </div>

                <div className="vote-footer">
                    <p>⚠️ Once submitted, your vote cannot be changed</p>
                    <p>✓ Your vote is recorded on blockchain for transparency</p>
                </div>
            </div>
        </div>
    );
};

export default VoteCasting;