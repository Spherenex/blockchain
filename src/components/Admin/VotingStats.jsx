import React, { useState, useEffect } from 'react';
import { getVotingStats } from '../../services/firebase';
import { verifyBlockchainIntegrity } from '../../services/blockchain';
import { exportToCSV, exportToJSON, formatDate, formatTime } from '../../utils/helpers';

const VotingStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [blockchainValid, setBlockchainValid] = useState(true);

    useEffect(() => {
        loadStats();
        const interval = setInterval(loadStats, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const loadStats = async () => {
        try {
            const data = await getVotingStats();
            setStats(data);
            setBlockchainValid(verifyBlockchainIntegrity());
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading statistics...</div>;
    if (!stats) return <div className="error">Failed to load statistics</div>;

    const votePercentage = stats.totalVoters > 0
        ? ((stats.totalVotesCast / stats.totalVoters) * 100).toFixed(1)
        : 0;

    return (
        <div className="voting-stats">
            <div className="stats-header">
                <h2>Live Voting Statistics</h2>
                <div className="blockchain-status">
                    {blockchainValid ? (
                        <span className="status-valid">✓ Blockchain Valid</span>
                    ) : (
                        <span className="status-invalid">✗ Blockchain Compromised</span>
                    )}
                </div>
            </div>

            <div className="stats-overview">
                <div className="stat-card">
                    <h3>Total Voters</h3>
                    <p className="stat-number">{stats.totalVoters}</p>
                </div>
                <div className="stat-card">
                    <h3>Votes Cast</h3>
                    <p className="stat-number">{stats.totalVotesCast}</p>
                </div>
                <div className="stat-card">
                    <h3>Remaining</h3>
                    <p className="stat-number">{stats.remainingVotes}</p>
                </div>
                <div className="stat-card">
                    <h3>Turnout</h3>
                    <p className="stat-number">{votePercentage}%</p>
                </div>
            </div>

            <div className="candidate-results">
                <h3>Candidate Wise Results</h3>
                <div className="results-grid">
                    {stats.candidates.map(candidate => {
                        const votePerc = stats.totalVotesCast > 0
                            ? ((candidate.votes / stats.totalVotesCast) * 100).toFixed(1)
                            : 0;

                        return (
                            <div key={candidate.id} className="candidate-result-card">
                                <div className="candidate-info">
                                    <h4>{candidate.name}</h4>
                                    <p className="candidate-detail">ID: {candidate.id}</p>
                                    <p className="candidate-detail">{candidate.education}</p>
                                </div>
                                <div className="vote-info">
                                    <p className="vote-count">{candidate.votes || 0} votes</p>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${votePerc}%` }}
                                        ></div>
                                    </div>
                                    <p className="vote-percentage">{votePerc}%</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="recent-votes">
                <h3>Recent Votes (Blockchain Records)</h3>
                <button
                    onClick={() => exportToCSV(stats.votes, 'vote_records')}
                    className="btn-export"
                >
                    Export Records
                </button>
                <div className="votes-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Vote ID</th>
                                <th>Timestamp</th>
                                <th>Block Hash</th>
                                <th>Candidate ID</th>
                                <th>Verified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.votes.slice(-20).reverse().map(vote => (
                                <tr key={vote.id}>
                                    <td>{vote.id}</td>
                                    <td>
                                        {formatDate(vote.timestamp)}<br />
                                        <small>{formatTime(vote.timestamp)}</small>
                                    </td>
                                    <td className="hash-cell">{vote.blockHash.substring(0, 16)}...</td>
                                    <td>{vote.candidateId}</td>
                                    <td><span className="verified">✓</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {stats.votes.length === 0 && (
                        <p className="no-data">No votes recorded yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VotingStats;