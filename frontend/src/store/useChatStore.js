import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  //-----------------------------------------------------------------
  ///------------------------ get users -----------------------------
  //-----------------------------------------------------------------
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in getUsers: ", error.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  //-----------------------------------------------------------------
  ///---------------------- get messages ----------------------------
  //-----------------------------------------------------------------
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in getMessages: ", error.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  //-----------------------------------------------------------------
  ///---------------------- send messages ---------------------------
  //-----------------------------------------------------------------
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in sendMessage: ", error.message);
    }
  },

  //-----------------------------------------------------------------
  ///--------------- listen realtime connection ---------------------
  //-----------------------------------------------------------------
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({ messages: [...get().messages, newMessage] });
    });
  },

  //-----------------------------------------------------------------
  ///----------------- break realtime connection --------------------
  //-----------------------------------------------------------------
  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  //-----------------------------------------------------------------
  ///-------------------- set selected user -------------------------
  //-----------------------------------------------------------------
  setSelectedUser: (selectedUser) => set({ selectedUser: selectedUser }),
}));
