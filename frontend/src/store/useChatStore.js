import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

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
  ///-------------------- set selected user -------------------------
  //-----------------------------------------------------------------
  setSelectedUser: (selectedUser) => set({ selectedUser: selectedUser }),
}));
