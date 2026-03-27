import { api } from "../../app/api-client";

export const chatbotAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    sendChatMessage: builder.mutation({
      query: (body) => ({
        url: "/chatbot/message",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendChatMessageMutation } = chatbotAPI;
