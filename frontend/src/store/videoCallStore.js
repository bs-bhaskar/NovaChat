import { create } from 'zustand';
import {subscribeWithSelector} from 'zustand/middleware';

const useVideoCallStore = create(
    subscribeWithSelector((set, get) => ({
        // call state
        currentCall: null,
        incomingCall: null,
        isCallActive: false,
        callType: null,// 'audio' or 'video'

        // media stream state
        localStream: null,
        remoteStream: null,
        isVideoEnabled: true,
        isAudioEnabled: true,
        
        // webRTC
        peerConnection: null,
        iceCandidatesQueue: [],// queue to store ICE candidates before peer connection is established

        isCallModelOpen: false,
        callStatus: "idle",// 'idle', 'calling', 'ringing connecting', 'connected', 'ended'

        // actions
        setCurrentCall: (call) => set({ currentCall: call }),
        setIncomingCall: (call) => set({ incomingCall: call }),
        setCallActive: (active) => set({ isCallActive: active }),
        setCallType: (type) => set({ callType: type }),
        setLocalStream: (stream) => set({ localStream: stream }),
        setRemoteStream: (stream) => set({ remoteStream: stream }),
        setPeerConnection: (pc) => set({ peerConnection: pc }),
        setCallModelOpen: (open) => set({ isCallModelOpen: open }),
        setCallStatus: (status) => set({ callStatus: status }),
        addIceCandidate: (candidate) => {const {iceCandidatesQueue} = get(); set({ iceCandidatesQueue: [...iceCandidatesQueue, candidate] })},
        processIceCandidatesQueue: async () => {
            const { iceCandidatesQueue, peerConnection } = get();
            if(peerConnection && peerConnection.signalingState !== "closed" && peerConnection.remoteDescription && iceCandidatesQueue.length > 0) {
                for (const candidate of iceCandidatesQueue) {
                    try {
                        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (error) {
                        console.error('ICE candidate Error', error);
                    }
                }
                set({ iceCandidatesQueue: [] });
            }
        },
        toggleVideo: () => {
            const { localStream, isVideoEnabled } = get();
            if (localStream) {
                const videoTrack = localStream.getVideoTracks()[0];
                if (videoTrack) {
                    videoTrack.enabled = !isVideoEnabled;
                    set({ isVideoEnabled: !isVideoEnabled });
                }
            }
        },
        toggleAudio: () => {
            const { localStream, isAudioEnabled } = get();
            if (localStream) {
                const audioTrack = localStream.getAudioTracks()[0];
                if (audioTrack) {
                    audioTrack.enabled = !isAudioEnabled;
                    set({ isAudioEnabled: !isAudioEnabled });
                }
            }
        },
        endCall: () => {
            const { peerConnection, localStream } = get();
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
            }
            if (peerConnection) {
                peerConnection.close();
            }
            set({
                currentCall: null,
                incomingCall: null,
                isCallActive: false,
                callType: null,
                localStream: null,
                remoteStream: null,
                isVideoEnabled: true,
                isAudioEnabled: true,
                peerConnection: null,
                iceCandidatesQueue: [],
                isCallModelOpen: false,
                callStatus: "idle",
            })
        },
        clearIncomingCall: () => set({ incomingCall: null }),
    })
));

export default useVideoCallStore;