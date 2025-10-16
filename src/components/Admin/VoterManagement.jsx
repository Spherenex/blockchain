import React, { useState, useEffect, useRef } from 'react';
import { addVoter, getVoters, deleteVoter, updateVoterStatus } from '../../services/firebase';
import { startCamera, stopCamera, captureFaceData } from '../../services/faceRecognition';
import { validateAadhaar, validateName } from '../../utils/validators';
import { exportToCSV, exportToJSON } from '../../utils/helpers';

const VoterManagement = () => {
    const [voters, setVoters] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [stream, setStream] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        aadhaar: '',
        faceData: null,
    });
    const [errors, setErrors] = useState({});
    const videoRef = useRef(null);

    useEffect(() => {
        loadVoters();
        return () => {
            if (stream) {
                stopCamera(stream);
            }
        };
    }, [stream]);

    const loadVoters = async () => {
        setLoading(true);
        try {
            const data = await getVoters();
            setVoters(data ? Object.values(data) : []);
        } catch (error) {
            console.error("Error loading voters:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartCamera = async () => {
        setCameraActive(true);
        await new Promise(resolve => setTimeout(resolve, 100));
        try {
            if (!videoRef.current) {
                alert("Video element not ready. Please try again.");
                setCameraActive(false);
                return;
            }
            const newStream = await startCamera(videoRef.current);
            setStream(newStream);
        } catch (error) {
            alert(`Failed to access camera: ${error.message}`);
            console.error(error);
            setCameraActive(false);
        }
    };

    const handleCaptureFace = async () => {
        try {
            if (!videoRef.current) {
                alert("Video element not ready. Please try again.");
                return;
            }
            const faceData = await captureFaceData(videoRef.current);
            setFormData({ ...formData, faceData });
            alert("Face captured successfully!");
            if (stream) {
                stopCamera(stream);
                setStream(null);
            }
            setCameraActive(false);
        } catch (error) {
            alert(`Failed to capture face. Please try again: ${error.message}`);
            console.error(error);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!validateName(formData.name)) newErrors.name = 'A valid name is required.';
        if (!validateAadhaar(formData.aadhaar)) newErrors.aadhaar = 'Aadhaar must be 12 digits.';
        if (!formData.faceData) newErrors.face = 'Face registration is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            await addVoter(formData);
            alert('Voter registered successfully!');
            setFormData({ name: '', aadhaar: '', faceData: null });
            setShowForm(false);
            loadVoters();
        } catch (error) {
            console.error("Error adding voter:", error);
            alert('Failed to register voter.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetVote = async (voterId) => {
        if (!window.confirm('Are you sure you want to reset the vote status for this voter?')) return;
        setLoading(true);
        try {
            await updateVoterStatus(voterId, 0);
            alert('Vote status reset successfully!');
            loadVoters();
        } catch (error) {
            console.error("Error resetting vote:", error);
            alert('Failed to reset vote status.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this voter?')) return;
        setLoading(true);
        try {
            await deleteVoter(id);
            alert('Voter deleted successfully!');
            loadVoters();
        } catch (error) {
            console.error("Error deleting voter:", error);
            alert('Failed to delete voter.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="management-section">
            <div className="section-header">
                <h2>Voter Management</h2>
                <div className="action-buttons">
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                        {showForm ? 'Cancel' : 'Register Voter'}
                    </button>
                    <button onClick={() => exportToCSV(voters, 'voters')} className="btn-export">Export CSV</button>
                    <button onClick={() => exportToJSON(voters, 'voters')} className="btn-export">Export JSON</button>
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter full name"
                            />
                            {errors.name && <span className="error">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label>Aadhaar Number</label>
                            <input
                                type="text"
                                value={formData.aadhaar}
                                onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                                placeholder="12-digit Aadhaar number"
                                maxLength="12"
                            />
                            {errors.aadhaar && <span className="error">{errors.aadhaar}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label>Face Registration</label>
                            <div className="biometric-capture">
                                <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                                    <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', borderRadius: '8px', display: cameraActive ? 'block' : 'none' }}></video>
                                    {!cameraActive ? (
                                        <button type="button" onClick={handleStartCamera} className="btn-capture">Start Camera</button>
                                    ) : (
                                        <button type="button" onClick={handleCaptureFace} className="btn-capture">Capture Face</button>
                                    )}
                                </div>
                                {formData.faceData && <span className="success">Face Registered</span>}
                                {errors.face && <span className="error">{errors.face}</span>}
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register Voter'}
                    </button>
                </form>
            )}

            <div className="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Aadhaar</th>
                            <th>Vote Status</th>
                            <th>Registered</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {voters.map((voter) => (
                            <tr key={voter.id}>
                                <td>{voter.id}</td>
                                <td>{voter.name}</td>
                                <td>{voter.aadhaar}</td>
                                <td>
                                    <span className={`status-badge ${voter.voteStatus === 0 ? 'pending' : 'voted'}`}>
                                        {voter.voteStatus === 0 ? 'Not Voted' : 'Voted'}
                                    </span>
                                </td>
                                <td>{new Date(voter.createdAt).toLocaleDateString()}</td>
                                <td>
                                    {voter.voteStatus === 1 && (
                                        <button onClick={() => handleResetVote(voter.id)} className="btn-reset" title="Reset Vote">Reset</button>
                                    )}
                                    <button onClick={() => handleDelete(voter.id)} className="btn-delete" title="Delete Voter">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {voters.length === 0 && <p className="no-data">No voters registered yet.</p>}
            </div>
        </div>
    );
};

export default VoterManagement;
