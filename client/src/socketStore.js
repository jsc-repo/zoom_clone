import create from "zustand";
import { createRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5050");

export const useSocketStore = create((set, get) => ({
  stream: null,
  setStream: (currentStream) => set({ stream: currentStream }),
  myVideo: createRef(),
  userVideo: createRef(),
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
  setCallAccepted: () => set({ callAccepted: !get().callAccepted }),
  callEnded: false,
  setCallEnded: () => set({ callEnded: !get().callEnded }),
  getPermission: () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((currentStream) => {
        get().setStream(currentStream);
        // console.log("STREAM", get().stream);
        get().myVideo.current.srcObject = currentStream;
      });

    socket.on("me", (id) => {
      get().setMe(id);
    });

    socket.on("calluser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
  },
  answerCall: () => {
    const Peer = require("simple-peer");
    setCallAccepted();

    peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  },

  callUser: (id) => {
    const Peer = require("simple-peer");
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callaccepted", (signal) => {
      setCallAccepted();
      peer.signal(signal);
    });
    connectionRef.current = peer;
  },

  leaveCall: () => {
    setCallEnded();
    connectionRef.current.destroy();

    window.location.reload();
  },
}));
