import { apiClient } from "@/app/api-client";

export const chatbotAPI = apiClient.injectEndpoints({
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
