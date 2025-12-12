import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { MessageSchema } from "@/lib/ZodObject";
import { TRPCError } from "@trpc/server";
import { getPlanLimits } from "@/lib/PlanConfig";
import { FilesToCloud } from "@/lib/supabase";




export const ChatRoomRouter = createTRPCRouter({
    /**
 * getUserRooms
 * Protected query.
 * Lists chat rooms the authenticated user belongs to.
 * Normalizes each room with: other participants (excluding self), membership ids, admin flag,
 * join time, unread count, title, and type.
 * Returns { success, message, value: RoomSummary[] }.
 */

    getUserRooms: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const user = ctx.session?.user;
                if (!user) {
                    return { success: false, message: "User not authenticated", value: [] };
                }
                const RoomMember = await ctx.prisma.chatRoomMember.findMany({
                    where: {
                        userId: user.id
                    },
                    select: {
                        roomId: true,
                        id: true,
                        isAdmin: true,
                        joinedAt: true,
                        notificationCount: true,


                        room: {
                            include: {
                                participants: true
                            }

                        }
                    }
                })
                const cleanedRooms = RoomMember.map((room) => ({
                    member: room.room.participants
                        .filter((member) => member.userId !== user.id)
                        .map((member) => ({
                            id: member.id,
                            userId: member.userId,
                            name: member.userName,
                            isAdmin: member.isAdmin,
                            joinedAt: member.joinedAt,
                        })),
                    chatRoomMemberId: room.id,
                    roomId: room.roomId,
                    isAdmin: room.isAdmin,
                    joinedAt: room.joinedAt,
                    notificationCount: room.notificationCount,
                    title: room.room.title,
                    type: room.room.type

                }))
                console.log(cleanedRooms);

                return { success: true, value: cleanedRooms, message: "Rooms fetched successfully" };

            } catch (error) {
                console.error("Error in getUserRooms:", error);
                return { success: false, message: "Failed to fetch rooms", value: [] };

            }
        }),

    /**
* getRoomChatById
* Protected query.
* Input: { roomId }
* Validates the room exists (with participants) and returns its messages (with images).
* Returns { success, message, value: { chats } } or null if room not found.
*/


    getRoomChatById: protectedProcedure.input(z.object({ roomId: z.string() })).query(async ({ input, ctx }) => {
        try {
            const { roomId } = input;
            const getRoom = await ctx.prisma.chatRoom.findUnique({
                where: {
                    id: roomId
                },
                include: {
                    participants: true,

                }
            })
            if (!getRoom) {
                return { success: false, message: "Room not found", value: null };
            }
            const getAllMessages = await ctx.prisma.message.findMany({
                where: {
                    roomId: roomId
                },
            
            });
            const getFullChat = await Promise.all(getAllMessages.map(async (message) => {
                const getImages = await ctx.prisma.file.findMany({
                    where: {
                        messageId: message.id,
                        chatOwnerID: message.authorId,
                        chatRoomID: message.roomId
                        
                    }
                })
                return {
                    ...message,
                    files: getImages
                }
            }))

            return {
                success: true, value: {
                    chats: getFullChat
                }, message: "Room fetched successfully"
            };


        } catch (error) {
            console.error("Error in getRoomById:", error);
            return { success: false, message: "Failed to fetch room", value: null };
        }
    }),
    /**
 * newMessage
 * Protected, rate-limited mutation.
 * Input: MessageSchema (includes roomId, text/media, etc.).
 * Creates a message authored by the current user, persists any images,
 * and increments notificationCount for all other room members.
 * Returns { success, message, value: createdMessage }.
 */

    newMessage: protectedProcedure.input(MessageSchema).mutation(async ({ input, ctx }) => {
        try {
            console.log("Input:", input);

            const { id, images, ...rest } = input;
            const user = ctx.session?.user;
            if (!user) {
                return { success: false, message: "User not authenticated" };
            }
            const message = await ctx.prisma.message.create({
                data: {
                    ...rest,
                    authorId: user.id,
                    roomId: input.roomId
                }
            })
            const UploadImages = (await FilesToCloud(images, { userID: user.id, isChat: true })).map((img) => {
                return {
                    ...img,
                    messageId: message.id,
                    chatOwnerID: user.id
                }
            });
            await ctx.prisma.file.createMany({
                data: UploadImages    
            })
          

            await ctx.prisma.chatRoomMember.updateMany({
                where: {
                    roomId: input.roomId,
                    userId: {
                        not: user.id
                    }

                },
                data: {
                    notificationCount: {
                        increment: 1
                    }
                }

            })
            return { success: true, value: message, message: "Message sent successfully" };

        } catch (error) {
            console.error("Error in newMessage:", error);
            return { success: false, message: "Failed to send message" };

        }
    }),
    /**
 * userRooms
 * Protected query.
 * Lists rooms via a direct room search (participants.some userId = me).
 * Shapes each room with id, title, my unread count, and other participants’ basic info.
 * Returns { success, message, value: RoomSummary[] }.
 */


    userRooms: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const user = ctx.session?.user;
                if (!user) {
                    return { success: false, message: "User not authenticated", value: [] };
                }
                const room = await ctx.prisma.chatRoom.findMany({
                    where: {
                        participants: {
                            some: {
                                userId: user.id
                            }
                        }
                    },
                    include: {
                        participants: true
                    }

                })
                const cleanedRooms = room.map((room) => ({
                    id: room.id,
                    title: room.title,
                    notificationCount: room.participants.find((member) => member.userId === user.id)?.notificationCount || 0,
                    participants: room.participants
                        .filter((member) => member.userId !== user.id)
                        .map((member) => ({
                            name: member.userName,
                            isAdmin: member.isAdmin,
                            joinedAt: member.joinedAt
                        })),
                }))
                return { success: true, value: cleanedRooms, message: "Rooms fetched successfully" };

            } catch (error) {
                console.error("Error in getUserRooms:", error);
                return { success: false, message: "Failed to fetch rooms", value: [] };

            }
        }),


        /**
 * getUserChats
 * Protected query.
 * Input: { roomId }.
 * Returns room messages (oldest → newest) with images;
 * then resets my notificationCount for that room to 0.
 * Returns { success, message, value: ChatMessage[] }.
 */


    getUserChats: protectedProcedure
        .input(z.object({ roomId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const user = ctx.session?.user;
                if (!user) {
                    return { success: false, message: "User not authenticated", value: [] };
                }
                const chats = await ctx.prisma.message.findMany({
                    where: {
                        roomId: input.roomId
                    },
                    orderBy: {
                        createdAt: 'asc'
                    },
                   
                })
                const fetchChats = chats.map(async(chat) => {
                    const getMessageImages = await ctx.prisma.file.findMany({
                        where: {
                            messageId: chat.id,
                            chatRoomID: input.roomId
                        }
                    })
                    return{
                    ...chat,
                    text: chat.text || null,
                    images: getMessageImages
                }
                })
                const formattedChats = await Promise.all(fetchChats)
                
                await ctx.prisma.chatRoomMember.updateMany({
                    where: {
                        roomId: input.roomId,
                        userId: user.id
                    },
                    data: {
                        notificationCount: {
                            set: 0
                        }
                    }
                })

                return { success: true, value: formattedChats, message: "Rooms fetched successfully" };

            } catch (error) {
                console.error("Error in getUserRooms:", error);
                return { success: false, message: "Failed to fetch rooms", value: [] };

            }
        }),

/**
 * createRoom
 * Protected mutation.
 * Input: { toId } (receiver user id).
 * Enforces plan limit (max chat rooms), ensures receiver exists,
 * prevents duplicate 1:1 room, then creates a PRIVATE room with both participants.
 * Returns { success, message, value: newRoom }.
 */

    createRoom: protectedProcedure
        .input(z.object({
            toId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                const user = ctx.session?.user;
                const plan = ctx.subscription
                if (!user || !plan) {
                    return { success: false, message: "User not authenticated" };
                }
                const userPlan = getPlanLimits(plan.PlanTier)
                const currentRoomCount = await ctx.prisma.chatRoom.count({
                    where: {
                        participants: {
                            some: {
                                userId: user.id
                            }
                        }
                    }
                })

                if (userPlan.maxChatRooms && currentRoomCount >= userPlan.maxChatRooms) {
                    return { success: false, message: "You have reached the maximum number of chat rooms for your plan. Please upgrade your plan to create more chat rooms." };
                }
                const getReceiver = await ctx.prisma.user.findUnique({
                    where: {
                        id: input.toId
                    }
                })
                if (!getReceiver) {
                    return { success: false, message: "Receiver not found" };
                }
                const existingRoom = await ctx.prisma.chatRoom.findFirst({
                    where: {
                        AND: [
                            {
                                participants: {
                                    some: {
                                        userId: user.id
                                    }
                                }
                            },
                            {
                                participants: {
                                    some: {
                                        userId: getReceiver.id
                                    }
                                }
                            }
                        ]
                    }
                })
                if (existingRoom) {
                    return { success: false, message: "Room already exists" };
                }



                const newRoom = await ctx.prisma.chatRoom.create({
                    data: {
                        title: `${user.name} and ${getReceiver.name}`,
                        type: "PRIVATE",
                        participants: {
                            create: [
                                {
                                    userId: user.id,
                                    userName: user.name,
                                    isAdmin: true,
                                    joinedAt: new Date()
                                },
                                {
                                    userId: getReceiver.id,
                                    userName: getReceiver.name,
                                    joinedAt: new Date()
                                }
                            ]
                        }
                    }
                })
                if (!newRoom) {
                    return { success: false, message: "Failed to create room" };
                }
                return { success: true, value: newRoom, message: "Room created successfully" };



            } catch (error) {
                console.error("Error in getUserRooms:", error);
                return { success: false, message: "Failed to fetch rooms" };

            }
        }),

        /**
 * userRoomNotification
 * Protected mutation.
 * Input: { roomId }.
 * Resets the caller’s notificationCount for the given room to 0.
 * Returns { success, message } (or not-found when no matching membership row).
 */


    userRoomNotification: protectedProcedure
        .input(z.object({ roomId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                const user = ctx.session?.user;
                if (!user) {
                    throw new TRPCError({ code: "UNAUTHORIZED", message: "User not authenticated" });
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
                    return { success: false, message: "No matching room member found" };
                }
                return { success: true, message: "Notification count reset successfully" };

            } catch (error) {
                console.error("Error in userRoomNotification:", error);
                return { success: false, message: "Failed to reset notification count" };
            }
        })

})