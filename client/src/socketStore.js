import create from "zustand";
import { createRef } from "react";
import { io } from "socket.io-client";
import SimplePeer from "simple-peer";

const socket = io("http://localhost:5050");

export const useSocketStore = create((set, get) => ({
  stream: null,
  setStream: (currentStream) => set(() => ({ stream: currentStream })),
  myVideo: null,
  setMyVideo: (myVideoRef) =>
    set({
      myVideo: myVideoRef,
    }),
  userVideo: null,
  setUserVideo: (userVideoRef) =>
    set({
      userVideo: userVideoRef,
    }),
  connectionRef: createRef(),
  me: "",
  name: "",
  setName: (userName) => set({ name: userName }),
  setMe: (id) => set({ me: id }),
  call: {},
  setCall: ({ isReceivedCall, from, name, signal }) =>
    set({
      call: {
        isReceivedCall,
        from,
        name,
        signal,
      },
    }),
  callAccepted: false,
  setCallAccepted: () => set({ callAccepted: true }),
  callEnded: false,
  setCallEnded: () => set({ callEnded: true }),
  getPermission: () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((currentStream) => {
        get().setStream(currentStream);
        get().myVideo.current.srcObject = currentStream;
      });

    socket.on("me", (id) => {
      get().setMe(id);
    });

    socket.on("calluser", ({ from, name: callerName, signal }) => {
      get().setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
  },
  answerCall: () => {
    get().setCallAccepted();
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: get().stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: get().call.from });
    });

    peer.on("stream", (currentStream) => {
      get().userVideo.current.srcObject = currentStream;
    });

    peer.signal(get().call.signal);

    get().connectionRef.current = peer;
  },

  callUser: (id) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: get().stream,
    });

    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: get().me,
        name: get().name,
      });
    });

    peer.on("stream", (currentStream) => {
      get().userVideo.current.srcObject = currentStream;
    });

    socket.on("callaccepted", (signal) => {
      get().setCallAccepted();
      peer.signal(signal);
    });

    get().connectionRef.current = peer;
  },

  leaveCall: () => {
    get().setCallEnded();
    get().connectionRef.current.destroy();

    window.location.reload();
  },
}));
