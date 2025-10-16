// import React, { useState, useEffect } from 'react';
// import { getVotingStats } from '../../services/firebase';
// import { verifyBlockchainIntegrity } from '../../services/blockchain';
// import { exportToCSV, exportToJSON, formatDate, formatTime } from '../../utils/helpers';

// const VotingStats = () => {
//     const [stats, setStats] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [blockchainValid, setBlockchainValid] = useState(true);

//     useEffect(() => {
//         loadStats();
//         const interval = setInterval(loadStats, 5000); // Refresh every 5 seconds
//         return () => clearInterval(interval);
//     }, []);

//     const loadStats = async () => {
//         try {
//             const data = await getVotingStats();
//             setStats(data);
//             setBlockchainValid(verifyBlockchainIntegrity());
//         } catch (error) {
//             console.error('Error loading stats:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return <div className="loading">Loading statistics...</div>;
//     if (!stats) return <div className="error">Failed to load statistics</div>;

//     const votePercentage = stats.totalVoters > 0
//         ? ((stats.totalVotesCast / stats.totalVoters) * 100).toFixed(1)
//         : 0;

//     return (
//         <div className="voting-stats">
//             <div className="stats-header">
//                 <h2>Live Voting Statistics</h2>
//                 <div className="blockchain-status">
//                     {blockchainValid ? (
//                         <span className="status-valid">✓ Blockchain Valid</span>
//                     ) : (
//                         <span className="status-invalid">✗ Blockchain Compromised</span>
//                     )}
//                 </div>
//             </div>

//             <div className="stats-overview">
//                 <div className="stat-card">
//                     <h3>Total Voters</h3>
//                     <p className="stat-number">{stats.totalVoters}</p>
//                 </div>
//                 <div className="stat-card">
//                     <h3>Votes Cast</h3>
//                     <p className="stat-number">{stats.totalVotesCast}</p>
//                 </div>
//                 <div className="stat-card">
//                     <h3>Remaining</h3>
//                     <p className="stat-number">{stats.remainingVotes}</p>
//                 </div>
//                 <div className="stat-card">
//                     <h3>Turnout</h3>
//                     <p className="stat-number">{votePercentage}%</p>
//                 </div>
//             </div>

//             <div className="candidate-results">
//                 <h3>Candidate Wise Results</h3>
//                 <div className="results-grid">
//                     {stats.candidates.map(candidate => {
//                         const votePerc = stats.totalVotesCast > 0
//                             ? ((candidate.votes / stats.totalVotesCast) * 100).toFixed(1)
//                             : 0;

//                         return (
//                             <div key={candidate.id} className="candidate-result-card">
//                                 <div className="candidate-info">
//                                     <h4>{candidate.name}</h4>
//                                     <p className="candidate-detail">ID: {candidate.id}</p>
//                                     <p className="candidate-detail">{candidate.education}</p>
//                                 </div>
//                                 <div className="vote-info">
//                                     <p className="vote-count">{candidate.votes || 0} votes</p>
//                                     <div className="progress-bar">
//                                         <div
//                                             className="progress-fill"
//                                             style={{ width: `${votePerc}%` }}
//                                         ></div>
//                                     </div>
//                                     <p className="vote-percentage">{votePerc}%</p>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             <div className="recent-votes">
//                 <h3>Recent Votes (Blockchain Records)</h3>
//                 <button
//                     onClick={() => exportToCSV(stats.votes, 'vote_records')}
//                     className="btn-export"
//                 >
//                     Export Records
//                 </button>
//                 <div className="votes-table">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Vote ID</th>
//                                 <th>Timestamp</th>
//                                 <th>Block Hash</th>
//                                 <th>Candidate ID</th>
//                                 <th>Verified</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {stats.votes.slice(-20).reverse().map(vote => (
//                                 <tr key={vote.id}>
//                                     <td>{vote.id}</td>
//                                     <td>
//                                         {formatDate(vote.timestamp)}<br />
//                                         <small>{formatTime(vote.timestamp)}</small>
//                                     </td>
//                                     <td className="hash-cell">{vote.blockHash.substring(0, 16)}...</td>
//                                     <td>{vote.candidateId}</td>
//                                     <td><span className="verified">✓</span></td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     {stats.votes.length === 0 && (
//                         <p className="no-data">No votes recorded yet</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default VotingStats;



















// import React, { useState, useEffect } from 'react';
// import { getVotingStats } from '../../services/firebase';
// import { verifyBlockchainIntegrity } from '../../services/blockchain';
// import { exportToCSV, exportToJSON, formatDate, formatTime } from '../../utils/helpers';

// const VotingStats = () => {
//     const [stats, setStats] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [blockchainValid, setBlockchainValid] = useState(true);

//     useEffect(() => {
//         loadStats();
//         const interval = setInterval(loadStats, 5000); // Refresh every 5 seconds
//         return () => clearInterval(interval);
//     }, []);

//     const loadStats = async () => {
//         try {
//             const data = await getVotingStats();
//             setStats(data);
//             setBlockchainValid(verifyBlockchainIntegrity());
//         } catch (error) {
//             console.error('Error loading stats:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return <div className="loading">Loading statistics...</div>;
//     if (!stats) return <div className="error">Failed to load statistics</div>;

//     const votePercentage = stats.totalVoters > 0
//         ? ((stats.totalVotesCast / stats.totalVoters) * 100).toFixed(1)
//         : 0;

//     return (
//         <div className="voting-stats">
//             <div className="stats-header">
//                 <h2>Live Voting Statistics</h2>
//                 <div className="blockchain-status">
//                     {blockchainValid ? (
//                         <span className="status-valid">✓ Blockchain Valid</span>
//                     ) : (
//                         <span className="status-invalid">✗ Blockchain Compromised</span>
//                     )}
//                 </div>
//             </div>

//             {/* Declare Winner Button */}
//             <button 
//               onClick={() => {
//                 // Find candidate with maximum votes
//                 if (stats.totalVotesCast === 0) {
//                   alert("No votes have been cast yet!");
//                   return;
//                 }

//                 const winner = [...stats.candidates].sort((a, b) => b.votes - a.votes)[0];

//                 // Create winner announcement element
//                 const winnerDiv = document.createElement('div');
//                 winnerDiv.innerHTML = `
//                   <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; 
//                       box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin: 20px auto; max-width: 600px; text-align: center;">
//                     <h2 style="color: #28a745; font-size: 24px; margin-bottom: 15px;">🏆 Election Winner Declared! 🏆</h2>
//                     <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 15px;">
//                       <div style="background-color: #28a745; color: white; width: 80px; height: 80px; 
//                           border-radius: 50%; display: flex; align-items: center; justify-content: center; 
//                           font-size: 40px; font-weight: bold; margin-right: 15px;">
//                         ${winner.votes}
//                       </div>
//                       <div style="text-align: left;">
//                         <h3 style="font-size: 28px; margin: 0; color: #212529;">${winner.name}</h3>
//                         <p style="margin: 5px 0; color: #6c757d;">${winner.education}</p>
//                         <p style="margin: 5px 0; color: #6c757d;">ID: ${winner.id}</p>
//                       </div>
//                     </div>
//                     <div style="background-color: #e9f7ef; padding: 10px; border-radius: 6px;">
//                       <p style="font-size: 18px; margin: 0;">Won with ${winner.votes} votes 
//                          (${((winner.votes / stats.totalVotesCast) * 100).toFixed(1)}% of total votes)</p>
//                     </div>
//                   </div>
//                 `;

//                 // Append to document body
//                 document.body.appendChild(winnerDiv);

//                 // Also update blockchain status to indicate election is complete
//                 const winnerData = {
//                   winner: winner.name,
//                   votes: winner.votes,
//                   percentage: ((winner.votes / stats.totalVotesCast) * 100).toFixed(1),
//                   timestamp: new Date().toISOString()
//                 };

//                 // Here you would typically update your backend
//                 console.log('Winner declared:', winnerData);

//                 // Optional: Export winner data
//                 exportToJSON(winnerData, 'election_result');
//               }}
//               style={{
//                 backgroundColor: '#dc3545',
//                 color: 'white',
//                 padding: '12px 24px',
//                 border: 'none',
//                 borderRadius: '6px',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 cursor: 'pointer',
//                 margin: '20px auto',
//                 display: 'block',
//                 boxShadow: '0 4px 6px rgba(220, 53, 69, 0.2)',
//                 transition: 'all 0.3s ease',
//                 position: 'relative',
//                 overflow: 'hidden',
//               }}
//               onMouseOver={(e) => {
//                 e.currentTarget.style.backgroundColor = '#c82333';
//                 e.currentTarget.style.transform = 'translateY(-2px)';
//                 e.currentTarget.style.boxShadow = '0 6px 8px rgba(220, 53, 69, 0.3)';
//               }}
//               onMouseOut={(e) => {
//                 e.currentTarget.style.backgroundColor = '#dc3545';
//                 e.currentTarget.style.transform = 'translateY(0)';
//                 e.currentTarget.style.boxShadow = '0 4px 6px rgba(220, 53, 69, 0.2)';
//               }}
//             >
//               🏆 Declare Winner
//             </button>

//             <div className="stats-overview">
//                 <div className="stat-card">
//                     <h3>Total Voters</h3>
//                     <p className="stat-number">{stats.totalVoters}</p>
//                 </div>
//                 <div className="stat-card">
//                     <h3>Votes Cast</h3>
//                     <p className="stat-number">{stats.totalVotesCast}</p>
//                 </div>
//                 <div className="stat-card">
//                     <h3>Remaining</h3>
//                     <p className="stat-number">{stats.remainingVotes}</p>
//                 </div>
//                 <div className="stat-card">
//                     <h3>Turnout</h3>
//                     <p className="stat-number">{votePercentage}%</p>
//                 </div>
//             </div>

//             <div className="candidate-results">
//                 <h3>Candidate Wise Results</h3>
//                 <div className="results-grid">
//                     {stats.candidates.map(candidate => {
//                         const votePerc = stats.totalVotesCast > 0
//                             ? ((candidate.votes / stats.totalVotesCast) * 100).toFixed(1)
//                             : 0;

//                         return (
//                             <div key={candidate.id} className="candidate-result-card">
//                                 <div className="candidate-info">
//                                     <h4>{candidate.name}</h4>
//                                     <p className="candidate-detail">ID: {candidate.id}</p>
//                                     <p className="candidate-detail">{candidate.education}</p>
//                                 </div>
//                                 <div className="vote-info">
//                                     <p className="vote-count">{candidate.votes || 0} votes</p>
//                                     <div className="progress-bar">
//                                         <div
//                                             className="progress-fill"
//                                             style={{ width: `${votePerc}%` }}
//                                         ></div>
//                                     </div>
//                                     <p className="vote-percentage">{votePerc}%</p>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             <div className="recent-votes">
//                 <h3>Recent Votes (Blockchain Records)</h3>
//                 <button
//                     onClick={() => exportToCSV(stats.votes, 'vote_records')}
//                     className="btn-export"
//                 >
//                     Export Records
//                 </button>
//                 <div className="votes-table">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Vote ID</th>
//                                 <th>Timestamp</th>
//                                 <th>Block Hash</th>
//                                 <th>Candidate ID</th>
//                                 <th>Verified</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {stats.votes.slice(-20).reverse().map(vote => (
//                                 <tr key={vote.id}>
//                                     <td>{vote.id}</td>
//                                     <td>
//                                         {formatDate(vote.timestamp)}<br />
//                                         <small>{formatTime(vote.timestamp)}</small>
//                                     </td>
//                                     <td className="hash-cell">{vote.blockHash.substring(0, 16)}...</td>
//                                     <td>{vote.candidateId}</td>
//                                     <td><span className="verified">✓</span></td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     {stats.votes.length === 0 && (
//                         <p className="no-data">No votes recorded yet</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default VotingStats;












import React, { useState, useEffect } from 'react';
import { getVotingStats } from '../../services/firebase';
import { verifyBlockchainIntegrity } from '../../services/blockchain';
import { exportToCSV, exportToJSON, formatDate, formatTime } from '../../utils/helpers';

const VotingStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [blockchainValid, setBlockchainValid] = useState(true);
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [winner, setWinner] = useState(null);

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

    const declareWinner = () => {
        if (stats.totalVotesCast === 0) {
            alert("No votes have been cast yet!");
            return;
        }

        const winnerCandidate = [...stats.candidates].sort((a, b) => b.votes - a.votes)[0];
        const winnerData = {
            ...winnerCandidate,
            percentage: ((winnerCandidate.votes / stats.totalVotesCast) * 100).toFixed(1),
            timestamp: new Date().toISOString()
        };

        setWinner(winnerData);
        setShowWinnerModal(true);

        // Here you would typically update your backend
        console.log('Winner declared:', winnerData);

        // Optional: Export winner data
        exportToJSON(winnerData, 'election_result');
    };

    if (loading) return <div className="loading">Loading statistics...</div>;
    if (!stats) return <div className="error">Failed to load statistics</div>;

    const votePercentage = stats.totalVoters > 0
        ? ((stats.totalVotesCast / stats.totalVoters) * 100).toFixed(1)
        : 0;

    return (
        <div className="voting-stats">
            {/* Winner Modal Popup */}
            {showWinnerModal && winner && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        padding: '30px',
                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                        maxWidth: '500px',
                        width: '90%',
                        position: 'relative',
                        animation: 'modalFadeIn 0.3s ease-out'
                    }}>
                        <button
                            onClick={() => setShowWinnerModal(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                padding: '5px 10px',
                            }}
                        >
                            ✕
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{
                                color: '#28a745',
                                fontSize: '28px',
                                margin: '0 0 20px 0',
                                borderBottom: '2px solid #e9f7ef',
                                paddingBottom: '15px'
                            }}>
                                🏆 Election Winner Declared! 🏆
                            </h2>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: '30px 0'
                            }}>
                                <div style={{
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    width: '90px',
                                    height: '90px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '42px',
                                    fontWeight: 'bold',
                                    marginRight: '20px',
                                    boxShadow: '0 3px 10px rgba(40, 167, 69, 0.3)'
                                }}>
                                    {winner.votes}
                                </div>

                                <div style={{ textAlign: 'left' }}>
                                    <h3 style={{
                                        fontSize: '32px',
                                        margin: '0 0 5px 0',
                                        color: '#212529',
                                        fontWeight: 'bold'
                                    }}>
                                        {winner.name}
                                    </h3>
                                    <p style={{ margin: '5px 0', color: '#6c757d' }}>{winner.education}</p>
                                    <p style={{ margin: '5px 0', color: '#6c757d' }}>ID: {winner.id}</p>
                                </div>
                            </div>

                            <div style={{
                                backgroundColor: '#e9f7ef',
                                padding: '15px',
                                borderRadius: '6px',
                                marginTop: '20px'
                            }}>
                                <p style={{ fontSize: '20px', margin: '0', fontWeight: '500' }}>
                                    Won with <b>{winner.votes}</b> votes
                                    (<b>{winner.percentage}%</b> of total votes)
                                </p>
                            </div>

                            <p style={{
                                fontSize: '14px',
                                color: '#6c757d',
                                marginTop: '25px',
                                borderTop: '1px solid #e9ecef',
                                paddingTop: '15px'
                            }}>
                                Election results verified by blockchain at {new Date().toLocaleString()}
                            </p>

                            <button
                                onClick={() => setShowWinnerModal(false)}
                                style={{
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    border: 'none',
                                    marginTop: '15px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Declare Winner Button */}
            <button
                onClick={declareWinner}
                style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    margin: '20px auto',
                    display: 'block',
                    boxShadow: '0 4px 6px rgba(220, 53, 69, 0.2)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#c82333';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 8px rgba(220, 53, 69, 0.3)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc3545';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(220, 53, 69, 0.2)';
                }}
            >
                🏆 Declare Winner
            </button>

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

            {/* Add some CSS for the modal animation */}
            <style jsx>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default VotingStats;