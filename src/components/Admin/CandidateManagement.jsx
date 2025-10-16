import React, { useState, useEffect } from 'react';
import {
    addCandidate,
    getCandidates,
    deleteCandidate,
    resetCandidateVotes
} from '../../services/firebase';
import {
    validateAadhaar,
    validatePhone,
    validateName,
    validateDate,
    validateEducation
} from '../../utils/validators';
import { exportToCSV, exportToJSON } from '../../utils/helpers';

const CandidateManagement = () => {
    const [candidates, setCandidates] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        aadhaar: '',
        phone: '',
        dob: '',
        education: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        setLoading(true);
        try {
            const data = await getCandidates();
            setCandidates(Object.values(data));
        } catch (error) {
            console.error('Error loading candidates:', error);
            alert('Failed to load candidates');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!validateName(formData.name)) {
            newErrors.name = 'Valid name required (min 2 characters)';
        }
        if (!validateAadhaar(formData.aadhaar)) {
            newErrors.aadhaar = 'Aadhaar must be 12 digits';
        }
        if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Phone must be 10 digits';
        }
        if (!validateDate(formData.dob)) {
            newErrors.dob = 'Valid date of birth required';
        }
        if (!validateEducation(formData.education)) {
            newErrors.education = 'Education qualification required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            await addCandidate(formData);
            alert('Candidate registered successfully!');
            setFormData({ name: '', aadhaar: '', phone: '', dob: '', education: '' });
            setShowForm(false);
            loadCandidates();
        } catch (error) {
            console.error('Error adding candidate:', error);
            alert('Failed to register candidate');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this candidate?')) return;

        setLoading(true);
        try {
            await deleteCandidate(id);
            alert('Candidate deleted successfully!');
            loadCandidates();
        } catch (error) {
            console.error('Error deleting candidate:', error);
            alert('Failed to delete candidate');
        } finally {
            setLoading(false);
        }
    };

    const handleResetVotes = async (id) => {
        if (!window.confirm('Reset vote count for this candidate?')) return;

        setLoading(true);
        try {
            await resetCandidateVotes(id);
            alert('Vote count reset successfully!');
            loadCandidates();
        } catch (error) {
            console.error('Error resetting votes:', error);
            alert('Failed to reset votes');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="management-section">
            <div className="section-header">
                <h2>Candidate Management</h2>
                <div className="action-buttons">
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                        {showForm ? 'Cancel' : '+ Add Candidate'}
                    </button>
                    <button onClick={() => exportToCSV(candidates, 'candidates')} className="btn-export">
                        Export CSV
                    </button>
                    <button onClick={() => exportToJSON(candidates, 'candidates')} className="btn-export">
                        Export JSON
                    </button>
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter full name"
                            />
                            {errors.name && <span className="error">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label>Aadhaar Number *</label>
                            <input
                                type="text"
                                value={formData.aadhaar}
                                onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                                placeholder="12-digit Aadhaar"
                                maxLength="12"
                            />
                            {errors.aadhaar && <span className="error">{errors.aadhaar}</span>}
                        </div>

                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="10-digit phone"
                                maxLength="10"
                            />
                            {errors.phone && <span className="error">{errors.phone}</span>}
                        </div>

                        <div className="form-group">
                            <label>Date of Birth *</label>
                            <input
                                type="date"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                            {errors.dob && <span className="error">{errors.dob}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label>Education Qualification *</label>
                            <input
                                type="text"
                                value={formData.education}
                                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                placeholder="e.g., Bachelor's in Political Science"
                            />
                            {errors.education && <span className="error">{errors.education}</span>}
                        </div>
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register Candidate'}
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
                            <th>Phone</th>
                            <th>DOB</th>
                            <th>Education</th>
                            <th>Votes</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map(candidate => (
                            <tr key={candidate.id}>
                                <td>{candidate.id}</td>
                                <td>{candidate.name}</td>
                                <td>{candidate.aadhaar}</td>
                                <td>{candidate.phone}</td>
                                <td>{new Date(candidate.dob).toLocaleDateString()}</td>
                                <td>{candidate.education}</td>
                                <td><strong>{candidate.votes || 0}</strong></td>
                                <td>
                                    <button
                                        onClick={() => handleResetVotes(candidate.id)}
                                        className="btn-reset"
                                        title="Reset votes"
                                    >
                                        🔄
                                    </button>
                                    <button
                                        onClick={() => handleDelete(candidate.id)}
                                        className="btn-delete"
                                        title="Delete candidate"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {candidates.length === 0 && (
                    <p className="no-data">No candidates registered yet</p>
                )}
            </div>
        </div>
    );
};

export default CandidateManagement;