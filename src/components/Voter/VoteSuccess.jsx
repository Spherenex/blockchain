import React from 'react';

const VoteSuccess = ({ candidate, onComplete }) => {
    return (
        <div className="vote-success-container">
            <div className="vote-success-card">
                <div className="success-icon">✓</div>
                <h2>Vote Cast Successfully!</h2>
                <p className="success-message">
                    Your vote has been recorded securely on the blockchain
                </p>

                <div className="vote-details">
                    <h3>Vote Summary</h3>
                    <p><strong>Voted for:</strong> {candidate.name}</p>
                    <p><strong>Candidate ID:</strong> {candidate.id}</p>
                    <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
                </div>

                <div className="success-info">
                    <p>✓ Vote recorded on blockchain</p>
                    <p>✓ Transaction is immutable</p>
                    <p>✓ Your identity remains confidential</p>
                    <p>✓ Vote status updated</p>
                </div>

                <button onClick={onComplete} className="btn-primary">
                    Complete
                </button>
            </div>
        </div>
    );
};

export default VoteSuccess;