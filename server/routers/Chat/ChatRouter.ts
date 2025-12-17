

import { createTRPCRouter, protectedProcedure } from "@/server/init"
import { Message, MessageSchema } from "@/lib/ZodObject";
import { on } from "events";import { email, z } from "zod";
import { FilesToCloud } from "@/lib/supabase";
import superjson from 'superjson';
import chatEvents from "./chatEvent";
import { CreateGroupChat } from "@/server/CreateGroupChat";
import { redisHttp } from "@/lib/redis";
export const ChatRouter = createTRPCRouter({
    sendMessage: protectedProcedure
        .input(MessageSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                const user = ctx.session?.user;
                if (!user) {
                    return { success: false, message: "User not authenticated", value: null };
                }
                const newMessage = await ctx.prisma.message.create({
                    data: {
                        roomId: input.roomId,
                        authorId: user.id,
                        text: input.text
                    },
                });
                const sendToCLoud = (await FilesToCloud(input.files, { userID: user.id, isChat: true })).map((image) => {
                    return {
                        ...image,
                        messageId: newMessage.id,
                        chatRoomID: input.roomId,
                        chatOwnerID: user.id,

                    }
                });
                await ctx.prisma.file.createMany({
                    data: sendToCLoud
                });
                const files = await ctx.prisma.file.findMany({
                    where: {
                        messageId: newMessage.id,
                    },
                });

                const payload = MessageSchema.parse({
                    ...newMessage,
                    files,
                })

                await redisHttp.publish("chat-messages", superjson.stringify(payload));

                return { success: true, message: "Message sent successfully", value: null };
            } catch (error) {
                return { success: false, message: "Failed to send message", value: null };
            }
        }),

    onMessage: protectedProcedure
       .input(z.object({ roomId: z.string() }))
        .subscription(async function* ({ input }) {
            // This loop waits for the specific event to fire
            // 'on' creates an AsyncIterator that pauses execution until an event happens
            for await (const [message] of on(chatEvents, `message:${input.roomId}`)) {
                yield message as Message; // Yield the message to the client
            }
        }),

    userRooms: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const user = ctx.session?.user;
                if (!user) {
                    return { success: false, message: "User not authenticated", value: null };
                }
                // get the login user rooms
                const rooms = await ctx.prisma.chatRoom.findMany({
                    where: {
                        participants: {
                            some: {
                                userId: user.id
                            },
                        },
                    },

                });

                const normalizedRooms = await Promise.all(rooms.map(async (room) => {
                    // get the login user room notification
                    const getNotification = await ctx.prisma.chatRoomMember.findFirst({
                        where: {
                            roomId: room.id,
                            userId: user.id
                        },


                    });


                    //get all the room members
                    const getallMembers = await ctx.prisma.chatRoomMember.findMany({
                        where: {
                            roomId: room.id,
                        },
                        select: {
                            userName: true,
                            userId: true
                        }
                    })
                    return {
                        ...room,
                        notificationCount: getNotification?.notificationCount || 0,
                        RoomMembers: getallMembers

                    };
                }))
                ///adeun2020@gmail.com

                return { success: true, message: "Rooms fetched successfully", value: normalizedRooms };
            } catch (error) {
                return { success: false, message: "Failed to fetch rooms", value: null };
            }
        }),


    getRoomMessages: protectedProcedure
        .input(z.object({ roomId: z.string() }))
        .query(async ({ input, ctx }) => {
            try {
                const messages = await ctx.prisma.message.findMany({
                    where: {
                        roomId: input.roomId,
                    },
                });
                const normalizedMessages = await Promise.all(messages.map(async (message) => {
                    const files = await ctx.prisma.file.findMany({
                        where: {
                            messageId: message.id,
                        },
                    });
                    return {
                        ...message,
                        files,
                    };
                }))

                return { success: true, message: "Messages fetched successfully", value: normalizedMessages };
            } catch (error) {
                return { success: false, message: "Failed to fetch messages", value: null };
            }
        }),



    UserNotification: {

    },


    clearUserNotification: protectedProcedure
        .input(z.object({ roomId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                const user = ctx.session?.user;
                if (!user) {
                    return { success: false, message: "User not authenticated", value: null };
                }
                const update = await ctx.prisma.chatRoomMember.updateMany({
                    where: {
                        roomId: input.roomId,
                        userId: user.id
                    },
                    data: {
                        notificationCount: 0
                    }
                })
                if (update.count === 0) {
                    return { success: false, message: "No matching room member found", value: null };
                }
                return { success: true, message: "Notification count reset successfully", value: null };
            } catch (error) {
                return { success: false, message: "Failed to reset notification count", value: null };
            }
        }),



    CreatPrivateChat: protectedProcedure
        .input(z.object({ emails: z.array(z.string()) }))
        .mutation(async ({ ctx, input }) => {
            try {
                const user = ctx.session?.user;
                if (!user) {
                    return { success: false, message: "User not authenticated", value: null };
                }

                await CreateGroupChat({
                    groupName: "Private Chat",
                    members: [...input.emails, user.email],
                    currentAdminId: user.id
                })

                return { success: true, message: "Private chat created successfully", value: null };
            } catch (error) {
                return { success: false, message: "Failed to create private chat", value: null };
            }
        }),






})

// ChatSidebar.tsx
// ---- RoomList

// ChatRoom.tsx