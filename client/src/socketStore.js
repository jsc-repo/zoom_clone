import create from "zustand";
import { createRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:5050");

const useSocketStore = create((set, get) => ({
  stream: null,
  setStream: (currentStream) => set({ stream: currentStream }),
  myVideo: createRef(),
  me: "",
  setMe: (id) => set({ me: id }),
  call: {},
  setCall: () => set({}),
  getPermission: () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("calluser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
  },
  answerCall: () => {},
  callUser: () => {},
  leaveCall: () => {},
}));
