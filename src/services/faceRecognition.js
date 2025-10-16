import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export const loadModels = async () => {
    if (modelsLoaded) return;

    const MODEL_URL = '/models';

    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        modelsLoaded = true;
        console.log('Face recognition models loaded');
    } catch (error) {
        console.error('Error loading face recognition models:', error);
        throw error;
    }
};

export const captureFaceData = async (videoElement) => {
    await loadModels();

    const detection = await faceapi
        .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (!detection) {
        throw new Error('No face detected');
    }

    return {
        descriptor: Array.from(detection.descriptor),
        confidence: detection.detection.score
    };
};

export const compareFaces = (storedDescriptor, currentDescriptor, threshold = 0.6) => {
    const distance = faceapi.euclideanDistance(storedDescriptor, currentDescriptor);
    return distance < threshold;
};

export const startCamera = async (videoElement) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
        });
        videoElement.srcObject = stream;
        return stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
        throw error;
    }
};

export const stopCamera = (stream) => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
};



