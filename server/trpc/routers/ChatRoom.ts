import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { MessageSchema } from "@/lib/Zod";
import { rateLimit } from "../middlewares/rateLimit";
import { TRPCError } from "@trpc/server";




export const ChatRoomRouter = createTRPCRouter({
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
            const roomChat = await ctx.prisma.message.findMany({
                where: {
                    roomId: roomId
                },
                include: {
                    images: true
                }

            });

            return {
                success: true, value: {
                    chats: roomChat
                }, message: "Room fetched successfully"
            };


        } catch (error) {
            console.error("Error in getRoomById:", error);
            return { success: false, message: "Failed to fetch room", value: null };
        }
    }),
    newMessage: protectedProcedure.use(rateLimit()).input(MessageSchema).mutation(async ({ input, ctx }) => {
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
            await Promise.all(images.map(async (img) => {
                const { id, ...imgRest } = img;
                await ctx.prisma.chatImage.create({
                    data: {
                        ...imgRest,
                        messageId: message.id,
                        chatOwnerID: user.id


                    }
                })
            }))

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
                    include: {
                        images: true
                    }
                })
                const cleanChats = chats.map((chat) => ({
                    ...chat,
                    text: chat.text || null,
                    images: chat.images.map((img) => {
                        const { createdAt, updatedAt, ...rest } = img;
                        return {
                            ...rest,

                        };
                    })
                }))
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

                return { success: true, value: cleanChats, message: "Rooms fetched successfully" };

            } catch (error) {
                console.error("Error in getUserRooms:", error);
                return { success: false, message: "Failed to fetch rooms", value: [] };

            }
        }),


    createRome: protectedProcedure
        .input(z.object({
            toId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                const user = ctx.session?.user;
                if (!user) {
                    return { success: false, message: "User not authenticated" };
                }
                const getReceiver = await ctx.prisma.user.findUnique({
                    where: {
                        id: input.toId
                    }
                })
                if (!getReceiver) {
                    return { success: false, message: "Receiver not found" };
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