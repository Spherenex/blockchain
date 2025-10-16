import React, { useState, useEffect, useRef } from 'react';
import { captureFaceData, compareFaces, startCamera, stopCamera } from '../../services/faceRecognition';
import { generateOTP, verifyOTP } from '../../services/otpService';
import { verifyFingerprint } from '../../services/firebase';
import '../../styles/auth.css';

const AuthenticationFlow = ({ voter, onAuthSuccess, onCancel }) => {
    const [step, setStep] = useState(1); // 1: Face, 2: Fingerprint, 3: OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otp, setOtp] = useState('');
    const [generatedOTP, setGeneratedOTP] = useState('');
    const [stream, setStream] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [fingerprintStatus, setFingerprintStatus] = useState('');
    const videoRef = useRef(null);

    useEffect(() => {
        return () => {
            if (stream) {
                stopCamera(stream);
            }
        };
    }, [stream]);

    const handleFaceAuth = async () => {
        setLoading(true);
        setError('');
        try {
            if (!videoRef.current) {
                setError("Video element not ready. Please try again.");
                setLoading(false);
                return;
            }
            const currentFaceData = await captureFaceData(videoRef.current);
            const isMatch = compareFaces(voter.faceData.descriptor, currentFaceData.descriptor);

            if (!isMatch) {
                setError("Face verification failed. Please try again.");
                setLoading(false);
                return;
            }
            if (stream) {
                stopCamera(stream);
                setStream(null);
            }
            setCameraActive(false);
            setStep(2);
        } catch (err) {
            setError(`Failed to capture face. Please ensure proper lighting. ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFingerprintAuth = async () => {
        setLoading(true);
        setError('');
        setFingerprintStatus('Initializing fingerprint scanner...');
        try {
            setFingerprintStatus('Please place your finger on the scanner...');
            // Send voter's Aadhaar number for verification
            const isMatch = await verifyFingerprint(voter.aadhaar);

            if (!isMatch) {
                setError('Fingerprint verification failed. The fingerprint does not match.');
                setFingerprintStatus('Verification Failed.');
                setLoading(false);
                return;
            }

            setFingerprintStatus('Fingerprint verified successfully!');
            // Generate OTP
            const newOTP = generateOTP();
            setGeneratedOTP(newOTP);
            setTimeout(() => {
                setFingerprintStatus('');
                setStep(3);
                setLoading(false);
            }, 1000);
        } catch (err) {
            console.error("Fingerprint verification error:", err);
            setError(`Fingerprint verification failed: ${err.message}`);
            setFingerprintStatus(`Error: ${err.message}`);
            setLoading(false);
        }
    };

    const handleOTPVerification = () => {
        setError('');
        if (!verifyOTP(otp, generatedOTP)) {
            setError("Invalid OTP. Please try again.");
            return;
        }
        onAuthSuccess();
    };

    const handleStartCamera = async () => {
        setCameraActive(true);
        setError('');
        await new Promise(resolve => setTimeout(resolve, 100));
        try {
            if (!videoRef.current) {
                setError("Video element not ready. Please try again.");
                setCameraActive(false);
                return;
            }
            const newStream = await startCamera(videoRef.current);
            setStream(newStream);
        } catch (err) {
            setError(`Failed to access camera: ${err.message}`);
            setCameraActive(false);
        }
    };

    // JSX for the component remains largely the same...
    return (
        <div className="auth-flow-container">
            <div className="auth-flow-card">
                {/* Progress Bar */}
                <div className="auth-progress">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Face</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Fingerprint</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">OTP</span>
                    </div>
                </div>

                <div className="auth-content">
                    {/* Step 1: Face Authentication */}
                    {step === 1 && (
                        <div className="auth-step">
                            <h2>Step 1: Face Authentication</h2>
                            <p>Please look at the camera for face verification.</p>
                            <div className="camera-container">
                                <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', maxWidth: '500px', borderRadius: '10px', border: '3px solid var(--primary-color)', display: cameraActive ? 'block' : 'none', margin: '0 auto' }}></video>
                                {!cameraActive ? (
                                    <button onClick={handleStartCamera} className="btn-primary">Start Camera</button>
                                ) : (
                                    <button onClick={handleFaceAuth} className="btn-primary" disabled={loading}>
                                        {loading ? 'Verifying...' : 'Verify Face'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Fingerprint Verification */}
                    {step === 2 && (
                        <div className="auth-step">
                            <h2>Step 2: Fingerprint Verification</h2>
                            <p>Place your finger on the sensor.</p>
                            <div className="fingerprint-animation">
                                <div className="fingerprint-icon"></div>
                            </div>
                            {fingerprintStatus && <div style={{ marginTop: '15px', marginBottom: '15px', color: '#2563eb', fontSize: '16px', fontWeight: '500' }}>{fingerprintStatus}</div>}
                            <button onClick={handleFingerprintAuth} className="btn-primary" disabled={loading}>
                                {loading ? 'Verifying...' : 'Scan Fingerprint'}
                            </button>
                        </div>
                    )}

                    {/* Step 3: OTP Verification */}
                    {step === 3 && (
                        <div className="auth-step">
                            <h2>Step 3: OTP Verification</h2>
                            <p>Your OTP has been generated. Please enter it below.</p>
                            <div className="otp-display">
                                <h3>Your OTP</h3>
                                <p className="otp-code">{generatedOTP}</p>
                            </div>
                            <div className="form-group">
                                <label>Enter OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength="6"
                                />
                            </div>
                            <button onClick={handleOTPVerification} className="btn-primary">Verify OTP & Proceed to Vote</button>
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}
                </div>

                <div className="auth-footer">
                    <button onClick={onCancel} className="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AuthenticationFlow;
