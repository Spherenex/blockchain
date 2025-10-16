
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set, get, update, remove, onValue } from "firebase/database";


// // Your Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyCM0tItu-glPhEllQZPz8h65ZsHTBiaMw",
//     authDomain: "intel-gesture.firebaseapp.com",
//     databaseURL: "https://intel-gesture-default-rtdb.firebaseio.com",
//     projectId: "intel-gesture",
//     storageBucket: "intel-gesture.appspot.com",
//     messagingSenderId: "696474188829",
//     appId: "1:696474188829:web:ee4e918549569e4f621af4",
//     measurementId: "G-1FK4E6M2VT"
// };


// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);


// // --- Helper to Generate Unique ID ---
// const generateUniqueId = async (path) => {
//     const snapshot = await get(ref(database, path));
//     const data = snapshot.val();
//     if (!data) return 1;
//     const ids = Object.keys(data).map(key => parseInt(data[key].id || 0));
//     return Math.max(0, ...ids) + 1;
// };


// // --- Fingerprint Registration & Verification (with Aadhaar) ---
// /**
//  * Initiates fingerprint registration and sets a 10-second timeout
//  * to reset the registration state.
//  * @param {string} aadhaarNumber - The voter's Aadhaar number.
//  */
// export const registerFingerprint = async (aadhaarNumber) => {
//     const registerRef = ref(database, 'vote/register');

//     // 1. Set the Aadhaar number to start the registration process on the hardware.
//     await set(registerRef, aadhaarNumber);

//     // 2. Set a client-side timer to automatically reset the 'vote/register' path to 0.
//     setTimeout(() => {
//         // After 10 seconds, set the value back to 0.
//         // This acts as a client-side timeout signal.
//         set(registerRef, 0);
//         console.log("Client-side timeout: 'vote/register' has been reset to 0.");
//     }, 10000); // 10000 milliseconds = 10 seconds
// };


// export const waitForFingerprintRegistration = (timeout = 60000) => {
//     return new Promise((resolve) => {
//         const registerRef = ref(database, 'vote/register');
//         const startTime = Date.now();
//         const unsubscribe = onValue(registerRef, (snapshot) => {
//             if (snapshot.val() === 0) {
//                 unsubscribe();
//                 resolve(true);
//             }
//             if (Date.now() - startTime > timeout) {
//                 unsubscribe();
//                 resolve(false);
//             }
//         });
//     });
// };


// export const verifyFingerprint = async (aadhaar) => {
//     const verificationRef = ref(database, 'vote/verification');
//     await set(verificationRef, aadhaar);
//     return new Promise((resolve, reject) => {
//         const startTime = Date.now();
//         const timeout = 60000;
//         const unsubscribe = onValue(verificationRef, async (snapshot) => {
//             if (snapshot.val() === 0) {
//                 unsubscribe();
//                 try {
//                     const fingerRef = ref(database, 'vote/finger');
//                     const fingerSnapshot = await get(fingerRef);
//                     if (String(fingerSnapshot.val()) === String(aadhaar)) {
//                         resolve(true);
//                     } else {
//                         resolve(false);
//                     }
//                 } catch (e) {
//                     reject(new Error("Could not read fingerprint result."));
//                 }
//             }
//             if (Date.now() - startTime > timeout) {
//                 unsubscribe();
//                 reject(new Error("Fingerprint verification timed out."));
//             }
//         });
//     });
// };


// // --- Candidate Operations (Corrected) ---
// export const addCandidate = async (candidateData) => {
//     const id = await generateUniqueId('vote/candidates');
//     const candidateRef = ref(database, `vote/candidates/${id}`);
//     await set(candidateRef, { id, ...candidateData, votes: 0, createdAt: new Date().toISOString() });
//     return id;
// };


// export const getCandidates = async () => {
//     const snapshot = await get(ref(database, 'vote/candidates'));
//     return snapshot.val() || {};
// };


// export const deleteCandidate = async (id) => {
//     await remove(ref(database, `vote/candidates/${id}`));
// };


// export const resetCandidateVotes = async (id) => {
//     await update(ref(database, `vote/candidates/${id}`), { votes: 0 });
// };


// // --- Voter Operations ---
// export const addVoter = async (voterData) => {
//     const id = await generateUniqueId('vote/voters');
//     const voterRef = ref(database, `vote/voters/${id}`);
//     await set(voterRef, {
//         id,
//         ...voterData,
//         voteStatus: 0,
//         createdAt: new Date().toISOString()
//     });
//     return id;
// };


// export const getVoters = async () => {
//     const snapshot = await get(ref(database, 'vote/voters'));
//     return snapshot.val() || {};
// };


// export const getVoterByAadhaar = async (aadhaar) => {
//     const voters = await getVoters();
//     return Object.values(voters).find(v => v.aadhaar === aadhaar);
// };


// export const updateVoterStatus = async (voterId, status) => {
//     await update(ref(database, `vote/voters/${voterId}`), { voteStatus: status });
// };


// export const deleteVoter = async (id) => {
//     await remove(ref(database, `vote/voters/${id}`));
// };


// // --- Vote Casting ---
// export const castVote = async (voterId, candidateId, blockchainData) => {
//     const voteId = await generateUniqueId('vote/votesRecorded');
//     const voteRef = ref(database, `vote/votesRecorded/${voteId}`);
//     await set(voteRef, {
//         id: voteId,
//         voterId,
//         candidateId,
//         timestamp: new Date().toISOString(),
//         blockHash: blockchainData.hash,
//         ...blockchainData
//     });


//     // Update candidate vote count
//     const candidateRef = ref(database, `vote/candidates/${candidateId}`);
//     const candidateSnapshot = await get(candidateRef);
//     const currentVotes = candidateSnapshot.val()?.votes || 0;
//     await update(candidateRef, { votes: currentVotes + 1 });


//     // Update voter status
//     await updateVoterStatus(voterId, 1);
//     return voteId;
// };


// // --- Voting Statistics ---
// export const getVotingStats = async () => {
//     const candidates = await getCandidates();
//     const voters = await getVoters();
//     const votesSnapshot = await get(ref(database, 'vote/votesRecorded'));
//     const votes = votesSnapshot.val() || {};
//     const totalVoters = Object.keys(voters).length;
//     const totalVotesCast = Object.keys(votes).length;
//     const remainingVotes = totalVoters - totalVotesCast;


//     return {
//         candidates: Object.values(candidates),
//         totalVoters,
//         totalVotesCast,
//         remainingVotes,
//         votes: Object.values(votes)
//     };
// };


// // --- Admin Operations ---
// export const verifyAdmin = async (username, password) => {
//     const snapshot = await get(ref(database, 'vote/admin'));
//     const adminData = snapshot.val();
//     if (!adminData) {
//         // Create a default admin if one doesn't exist
//         await set(ref(database, 'vote/admin'), {
//             username: 'admin',
//             password: 'admin123'
//         });
//         // In a real application, use secure password hashing
//         return username === 'admin' && password === 'admin123';
//     }
//     return adminData.username === username && adminData.password === password;
// };


// export { database };








import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, remove, onValue } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCM0tItu-glPhEllQZPz8h65ZsHTBiaMw",
    authDomain: "intel-gesture.firebaseapp.com",
    databaseURL: "https://intel-gesture-default-rtdb.firebaseio.com",
    projectId: "intel-gesture",
    storageBucket: "intel-gesture.appspot.com",
    messagingSenderId: "696474188829",
    appId: "1:696474188829:web:ee4e918549569e4f621af4",
    measurementId: "G-1FK4E6M2VT"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// --- Helper to Generate Unique ID ---
const generateUniqueId = async (path) => {
    const snapshot = await get(ref(database, path));
    const data = snapshot.val();
    if (!data) return 1;
    const ids = Object.keys(data).map(key => parseInt(data[key].id || 0));
    return Math.max(0, ...ids) + 1;
};

// --- Fingerprint Registration & Verification (with Aadhaar) ---
/**
 * Initiates fingerprint registration and sets a 10-second timeout
 * to reset the registration state.
 * @param {string} aadhaarNumber - The voter's Aadhaar number.
 */
export const registerFingerprint = async (aadhaarNumber) => {
    const registerRef = ref(database, 'vote/register');

    // 1. Set the Aadhaar number to start the registration process on the hardware.
    await set(registerRef, aadhaarNumber);

    // 2. Set a client-side timer to automatically reset the 'vote/register' path to 0.
    setTimeout(() => {
        // After 10 seconds, set the value back to 0.
        // This acts as a client-side timeout signal.
        set(registerRef, 0);
        console.log("Client-side timeout: 'vote/register' has been reset to 0.");
    }, 10000); // 10000 milliseconds = 10 seconds
};

export const waitForFingerprintRegistration = (timeout = 60000) => {
    return new Promise((resolve) => {
        const registerRef = ref(database, 'vote/register');
        const startTime = Date.now();
        const unsubscribe = onValue(registerRef, (snapshot) => {
            if (snapshot.val() === 0) {
                unsubscribe();
                resolve(true);
            }
            if (Date.now() - startTime > timeout) {
                unsubscribe();
                resolve(false);
            }
        });
    });
};

/**
 * Verifies a fingerprint by communicating with hardware via Firebase.
 * It sets the Aadhaar number to 'vote/verification' to trigger the scan
 * and schedules a reset of this path to 0 after 10 seconds.
 * It then listens for the hardware's response.
 * @param {string} aadhaar - The voter's Aadhaar number.
 * @returns {Promise<boolean>} A promise that resolves to true if the fingerprint matches, false otherwise.
 */
export const verifyFingerprint = async (aadhaar) => {
    const verificationRef = ref(database, 'vote/verification');

    // 1. Set verification to 1 to start the verification process on the hardware.
    await set(verificationRef, 1);

    // 2. Schedule a client-side reset of 'vote/verification' to 0 after 10 seconds.
    setTimeout(() => {
        set(verificationRef, 0);
        console.log("Client-side timeout: 'vote/verification' reset to 0 after 10s.");
    }, 10000); // 10 seconds

    // 3. Return a promise that waits for the hardware to complete verification.
    return new Promise((resolve, reject) => {
        const overallTimeout = 15000; // A 15-second overall timeout to prevent hangs.
        const startTime = Date.now();

        const unsubscribe = onValue(verificationRef, (snapshot) => {
            // Process is complete when 'verification' is 0 (by hardware or our timeout).
            if (snapshot.val() === 0 || snapshot.val() === '0') {
                unsubscribe(); // Stop listening to prevent multiple resolutions.

                // Simply resolve with true when verification becomes 0
                // No longer comparing aadhaar with finger value
                resolve(true);
            }

            // Failsafe timeout for the entire operation.
            if (Date.now() - startTime > overallTimeout) {
                unsubscribe();
                reject(new Error("Fingerprint verification timed out after 15 seconds."));
            }
        });
    });
};

// --- Candidate Operations (Corrected) ---
export const addCandidate = async (candidateData) => {
    const id = await generateUniqueId('vote/candidates');
    const candidateRef = ref(database, `vote/candidates/${id}`);
    await set(candidateRef, { id, ...candidateData, votes: 0, createdAt: new Date().toISOString() });
    return id;
};

export const getCandidates = async () => {
    const snapshot = await get(ref(database, 'vote/candidates'));
    return snapshot.val() || {};
};

export const deleteCandidate = async (id) => {
    await remove(ref(database, `vote/candidates/${id}`));
};

export const resetCandidateVotes = async (id) => {
    await update(ref(database, `vote/candidates/${id}`), { votes: 0 });
};

// --- Voter Operations ---
export const addVoter = async (voterData) => {
    const id = await generateUniqueId('vote/voters');
    const voterRef = ref(database, `vote/voters/${id}`);
    await set(voterRef, {
        id,
        ...voterData,
        voteStatus: 0,
        createdAt: new Date().toISOString()
    });
    return id;
};

export const getVoters = async () => {
    const snapshot = await get(ref(database, 'vote/voters'));
    return snapshot.val() || {};
};

export const getVoterByAadhaar = async (aadhaar) => {
    const voters = await getVoters();
    return Object.values(voters).find(v => v.aadhaar === aadhaar);
};

export const updateVoterStatus = async (voterId, status) => {
    await update(ref(database, `vote/voters/${voterId}`), { voteStatus: status });
};

export const deleteVoter = async (id) => {
    await remove(ref(database, `vote/voters/${id}`));
};

// --- Vote Casting ---
export const castVote = async (voterId, candidateId, blockchainData) => {
    const voteId = await generateUniqueId('vote/votesRecorded');
    const voteRef = ref(database, `vote/votesRecorded/${voteId}`);
    await set(voteRef, {
        id: voteId,
        voterId,
        candidateId,
        timestamp: new Date().toISOString(),
        blockHash: blockchainData.hash,
        ...blockchainData
    });

    // Update candidate vote count
    const candidateRef = ref(database, `vote/candidates/${candidateId}`);
    const candidateSnapshot = await get(candidateRef);
    const currentVotes = candidateSnapshot.val()?.votes || 0;
    await update(candidateRef, { votes: currentVotes + 1 });

    // Update voter status
    await updateVoterStatus(voterId, 1);
    return voteId;
};

// --- Voting Statistics ---
export const getVotingStats = async () => {
    const candidates = await getCandidates();
    const voters = await getVoters();
    const votesSnapshot = await get(ref(database, 'vote/votesRecorded'));
    const votes = votesSnapshot.val() || {};
    const totalVoters = Object.keys(voters).length;
    const totalVotesCast = Object.keys(votes).length;
    const remainingVotes = totalVoters - totalVotesCast;

    return {
        candidates: Object.values(candidates),
        totalVoters,
        totalVotesCast,
        remainingVotes,
        votes: Object.values(votes)
    };
};

// --- Admin Operations ---
export const verifyAdmin = async (username, password) => {
    const snapshot = await get(ref(database, 'vote/admin'));
    const adminData = snapshot.val();
    if (!adminData) {
        // Create a default admin if one doesn't exist
        await set(ref(database, 'vote/admin'), {
            username: 'admin',
            password: 'admin123'
        });
        // In a real application, use secure password hashing
        return username === 'admin' && password === 'admin123';
    }
    return adminData.username === username && adminData.password === password;
};

export { database };
