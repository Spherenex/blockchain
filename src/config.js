export const config = {
    // Firebase Configuration
    firebase: {
        databaseURL: "https://intel-gesture-default-rtdb.firebaseio.com/",
        apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyCM0tItu-glPhEllQZPz8h6_5ZsHTBiaMw",
        authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "intel-gesture.firebaseapp.com",
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || "intel-gesture",
        storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "intel-gesture.firebasestorage.app",
        messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "696474188829",
        appId: process.env.VITE_FIREBASE_APP_ID || "1:696474188829:web:ee4e918549569e4f621af4"
    },

    // Blockchain Configuration
    blockchain: {
        difficulty: 2, // Mining difficulty
        maxTransactionsPerBlock: 100
    },

    // Face Recognition Configuration
    faceRecognition: {
        modelPath: '/models',
        detectionOptions: {
            minConfidence: 0.5,
            inputSize: 416,
            scoreThreshold: 0.5
        },
        matchThreshold: 0.6 // Lower = more strict
    },

    // OTP Configuration
    otp: {
        length: 6,
        expiryMinutes: 5
    },

    // Admin Configuration
    admin: {
        defaultUsername: 'admin',
        defaultPassword: 'admin123'
    },

    // App Configuration
    app: {
        name: 'Blockchain Voting System',
        version: '1.0.0',
        apiTimeout: 30000, // 30 seconds
        refreshInterval: 5000 // 5 seconds for stats refresh
    }
};

export default config;