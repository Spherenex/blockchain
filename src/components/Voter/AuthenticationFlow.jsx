// import React, { useState, useEffect, useRef } from 'react';
// import { captureFaceData, compareFaces, startCamera, stopCamera } from '../../services/faceRecognition';
// import { generateOTP, verifyOTP } from '../../services/otpService';
// import '../../styles/auth.css';

// const AuthenticationFlow = ({ voter, onAuthSuccess, onCancel }) => {
//   const [step, setStep] = useState(1); // 1: Face, 2: OTP
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [otp, setOtp] = useState('');
//   const [generatedOTP, setGeneratedOTP] = useState('');
//   const [stream, setStream] = useState(null);
//   const [cameraActive, setCameraActive] = useState(false);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       if (stream) {
//         stopCamera(stream);
//       }
//     };
//   }, [stream]);

//   const handleFaceAuth = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       if (!videoRef.current) {
//         setError("Video element not ready. Please try again.");
//         setLoading(false);
//         return;
//       }

//       const currentFaceData = await captureFaceData(videoRef.current);
//       const isMatch = compareFaces(voter.faceData.descriptor, currentFaceData.descriptor);

//       if (!isMatch) {
//         setError("Face verification failed. Please try again.");
//         setLoading(false);
//         return;
//       }

//       if (stream) {
//         stopCamera(stream);
//         setStream(null);
//       }
//       setCameraActive(false);

//       // Generate OTP after successful face verification
//       const newOTP = generateOTP();
//       setGeneratedOTP(newOTP);
//       setStep(2); // Proceed to OTP step

//     } catch (err) {
//       setError(`Failed to capture face. Please ensure proper lighting. ${err.message}`);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOTPVerification = () => {
//     setError('');
//     if (!verifyOTP(otp, generatedOTP)) {
//       setError("Invalid OTP. Please try again.");
//       return;
//     }
//     onAuthSuccess();
//   };

//   const handleStartCamera = async () => {
//     setCameraActive(true);
//     setError('');
//     await new Promise(resolve => setTimeout(resolve, 100)); 
//     try {
//       if (!videoRef.current) {
//         setError("Video element not ready. Please try again.");
//         setCameraActive(false);
//         return;
//       }
//       const newStream = await startCamera(videoRef.current);
//       setStream(newStream);
//     } catch (err) {
//       setError(`Failed to access camera: ${err.message}`);
//       setCameraActive(false);
//     }
//   };

//   return (
//     <div className="auth-flow-container">
//       <div className="auth-flow-card">
//         {/* Progress Bar */}
//         <div className="auth-progress">
//           <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
//             <span className="step-number">1</span>
//             <span className="step-label">Face</span>
//           </div>
//           <div className="progress-line"></div>
//           <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
//             <span className="step-number">2</span>
//             <span className="step-label">OTP</span>
//           </div>
//         </div>

//         <div className="auth-content">
//           {/* Step 1: Face Authentication */}
//           {step === 1 && (
//             <div className="auth-step">
//               <h2>Step 1: Face Authentication</h2>
//               <p>Please look at the camera for face verification.</p>
//               <div className="camera-container">
//                 <video
//                   ref={videoRef}
//                   autoPlay
//                   muted
//                   playsInline
//                   style={{
//                     width: '100%',
//                     maxWidth: '500px',
//                     borderRadius: '10px',
//                     border: '3px solid var(--primary-color)',
//                     display: cameraActive ? 'block' : 'none',
//                     margin: '0 auto',
//                   }}
//                 />
//                 {!cameraActive ? (
//                   <button onClick={handleStartCamera} className="btn-primary">
//                     Start Camera
//                   </button>
//                 ) : (
//                   <button onClick={handleFaceAuth} className="btn-primary" disabled={loading}>
//                     {loading ? 'Verifying...' : 'Verify Face'}
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Step 2: OTP Verification */}
//           {step === 2 && (
//             <div className="auth-step">
//               <h2>Step 2: OTP Verification</h2>
//               <p>Your OTP has been generated. Please enter it below.</p>
//                <div className="otp-display">
//                 <h3>Your OTP</h3>
//                 <p className="otp-code">{generatedOTP}</p>
//               </div>
//               <div className="form-group">
//                 <label>Enter OTP</label>
//                 <input
//                   type="text"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   placeholder="Enter 6-digit OTP"
//                   maxLength="6"
//                 />
//               </div>
//               <button onClick={handleOTPVerification} className="btn-primary">
//                 Verify OTP & Proceed to Vote
//               </button>
//             </div>
//           )}

//           {error && <div className="error-message">{error}</div>}
//         </div>

//         <div className="auth-footer">
//           <button onClick={onCancel} className="btn-secondary">
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthenticationFlow;



// import React, { useState, useEffect, useRef } from 'react';
// import { captureFaceData, compareFaces, startCamera, stopCamera } from '../../services/faceRecognition';
// import { generateOTP, verifyOTP } from '../../services/otpService';
// import { verifyVoterFingerprint } from '../../services/firebase'; // Assuming this function exists
// import '../../styles/auth.css';

// const AuthenticationFlow = ({ voter, onAuthSuccess, onCancel }) => {
//     const [step, setStep] = useState(1); // 1: Face, 2: OTP, 3: Fingerprint
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [otp, setOtp] = useState('');
//     const [generatedOTP, setGeneratedOTP] = useState('');
//     const [stream, setStream] = useState(null);
//     const [cameraActive, setCameraActive] = useState(false);
//     const [fingerprintStatus, setFingerprintStatus] = useState('');
//     const videoRef = useRef(null);

//     useEffect(() => {
//         // Automatically start the camera for the face step
//         handleStartCamera();
//         return () => {
//             if (stream) {
//                 stopCamera(stream);
//             }
//         };
//     }, []);

//     const handleStartCamera = async () => {
//         setCameraActive(true);
//         setError('');
//         await new Promise(resolve => setTimeout(resolve, 100)); // Allow UI to update
//         try {
//             if (!videoRef.current) {
//                 setError("Video element not ready.");
//                 setCameraActive(false);
//                 return;
//             }
//             const newStream = await startCamera(videoRef.current);
//             setStream(newStream);
//         } catch (err) {
//             setError(`Failed to access camera: ${err.message}`);
//             setCameraActive(false);
//         }
//     };

//     const handleFaceAuth = async () => {
//         setLoading(true);
//         setError('');
//         try {
//             const currentFaceData = await captureFaceData(videoRef.current);
//             const isMatch = compareFaces(voter.faceData.descriptor, currentFaceData.descriptor);

//             if (!isMatch) {
//                 setError("Face verification failed. Please try again.");
//                 setLoading(false);
//                 return;
//             }

//             // Stop camera and proceed
//             if (stream) {
//                 stopCamera(stream);
//                 setStream(null);
//             }
//             setCameraActive(false);

//             const newOTP = generateOTP();
//             setGeneratedOTP(newOTP);
//             setStep(2); // Proceed to OTP step

//         } catch (err) {
//             setError(`Failed to capture face. Please ensure proper lighting. ${err.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleOTPVerification = () => {
//         setError('');
//         if (!verifyOTP(otp, generatedOTP)) {
//             setError("Invalid OTP. Please try again.");
//             return;
//         }
//         setStep(3); // Proceed to Fingerprint step
//     };

//     const handleFingerprintAuth = async () => {
//         setLoading(true);
//         setError('');
//         setFingerprintStatus('Waiting for fingerprint...');
//         try {
//             // This function will check the 'vote/finger' path against the voter's ID
//             const isMatch = await verifyVoterFingerprint(voter.id);

//             if (isMatch) {
//                 setFingerprintStatus('Fingerprint verified successfully!');
//                 setTimeout(() => {
//                     onAuthSuccess(); // Final success callback
//                 }, 1500);
//             } else {
//                 // The promise will reject on mismatch, which is caught below
//                 throw new Error("Fingerprint does not match the registered voter.");
//             }
//         } catch (err) {
//             setError(err.message);
//             setFingerprintStatus('Verification Failed.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="auth-flow-container">
//             <div className="auth-flow-card">
//                 {/* Progress Bar */}
//                 <div className="auth-progress">
//                     <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>Face</div>
//                     <div className="progress-line"></div>
//                     <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>OTP</div>
//                     <div className="progress-line"></div>
//                     <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>Fingerprint</div>
//                 </div>

//                 <div className="auth-content">
//                     {/* Step 1: Face Authentication */}
//                     {step === 1 && (
//                         <div className="auth-step">
//                             <h2>Step 1: Face Authentication</h2>
//                             <div className="camera-container">
//                                 <video ref={videoRef} autoPlay muted playsInline style={{ display: cameraActive ? 'block' : 'none' }} />
//                             </div>
//                             <button onClick={handleFaceAuth} className="btn-primary" disabled={loading || !cameraActive}>
//                                 {loading ? 'Verifying...' : 'Verify Face'}
//                             </button>
//                         </div>
//                     )}

//                     {/* Step 2: OTP Verification */}
//                     {step === 2 && (
//                         <div className="auth-step">
//                             <h2>Step 2: OTP Verification</h2>
//                             <p>Your one-time password is: <strong className="otp-code">{generatedOTP}</strong></p>
//                             <input
//                                 type="text"
//                                 value={otp}
//                                 onChange={(e) => setOtp(e.target.value)}
//                                 placeholder="Enter 6-digit OTP"
//                                 maxLength="6"
//                             />
//                             <button onClick={handleOTPVerification} className="btn-primary" disabled={loading}>
//                                 Verify OTP
//                             </button>
//                         </div>
//                     )}

//                     {/* Step 3: Fingerprint Verification */}
//                     {step === 3 && (
//                         <div className="auth-step">
//                             <h2>Step 3: Final Verification</h2>
//                             <p>Please use the fingerprint scanner to complete the authentication.</p>
//                             <button onClick={handleFingerprintAuth} className="btn-primary" disabled={loading}>
//                                 {loading ? 'Scanning...' : 'Authenticate with Fingerprint'}
//                             </button>
//                             {fingerprintStatus && <div className="status-message">{fingerprintStatus}</div>}
//                         </div>
//                     )}

//                     {error && <div className="error-message">{error}</div>}
//                 </div>

//                 <div className="auth-footer">
//                     <button onClick={onCancel} className="btn-secondary">Cancel</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AuthenticationFlow;



import React, { useState, useEffect, useRef } from 'react';
import { captureFaceData, compareFaces, startCamera, stopCamera } from '../../services/faceRecognition';
import { generateOTP, verifyOTP } from '../../services/otpService';
import { verifyVoterFingerprint } from '../../services/firebase';
import '../../styles/auth.css';

const AuthenticationFlow = ({ voter, onAuthSuccess, onCancel }) => {
  const [step, setStep] = useState(1); // 1: Face, 2: OTP, 3: Fingerprint
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [fingerprintStatus, setFingerprintStatus] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    if (step === 1) {
        handleStartCamera();
    }
    return () => {
      if (stream) {
        stopCamera(stream);
      }
    };
  }, [step]);

  const handleStartCamera = async () => {
    setCameraActive(true);
    setError('');
    await new Promise(resolve => setTimeout(resolve, 100));
    try {
      if (!videoRef.current) {
        setError("Video element not ready.");
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

  const handleFaceAuth = async () => {
    setLoading(true);
    setError('');
    try {
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

      const newOTP = generateOTP();
      setGeneratedOTP(newOTP);
      setStep(2);

    } catch (err) {
      setError(`Failed to capture face. Please ensure proper lighting. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = () => {
    setError('');
    if (!verifyOTP(otp, generatedOTP)) {
      setError("Invalid OTP. Please try again.");
      return;
    }
    setStep(3);
  };

  const handleFingerprintAuth = async () => {
    setLoading(true);
    setError('');
    setFingerprintStatus('Waiting for fingerprint scan...');
    try {
      const isMatch = await verifyVoterFingerprint(voter.id);

      if (isMatch) {
        setFingerprintStatus('Fingerprint verified successfully!');
        setTimeout(() => {
          onAuthSuccess();
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
      setFingerprintStatus('Verification Failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-flow-container">
      <div className="auth-flow-card">
        <div className="auth-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>Face</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>OTP</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>Fingerprint</div>
        </div>

        <div className="auth-content">
          {step === 1 && (
            <div className="auth-step">
              <h2>Step 1: Face Authentication</h2>
              <div className="camera-container">
                <video ref={videoRef} autoPlay muted playsInline style={{ display: cameraActive ? 'block' : 'none', width: '100%', borderRadius: '8px' }} />
              </div>
              <button onClick={handleFaceAuth} className="btn-primary" disabled={loading || !cameraActive}>
                {loading ? 'Verifying...' : 'Verify Face'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="auth-step">
              <h2>Step 2: OTP Verification</h2>
              <p>Your one-time password is: <strong className="otp-code">{generatedOTP}</strong></p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
              />
              <button onClick={handleOTPVerification} className="btn-primary" disabled={loading}>
                Verify OTP
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="auth-step">
              <h2>Step 3: Final Verification</h2>
              <p>Please use the fingerprint scanner to complete authentication.</p>
              <button onClick={handleFingerprintAuth} className="btn-primary" disabled={loading}>
                {loading ? 'Scanning...' : 'Authenticate with Fingerprint'}
              </button>
              {fingerprintStatus && <div className="status-message">{fingerprintStatus}</div>}
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
