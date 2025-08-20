import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { sendEmail } from "@/server/actions/sendEmail";
import { get } from "http";
import { MessageSchema } from "@/lib/Zod";
import { rateLimit } from "../middlewares/rateLimit";
import { no } from "zod/v4/locales";



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
                    id: room.id,
                    roomId: room.roomId,
                    isAdmin: room.isAdmin,
                    joinedAt: room.joinedAt,
                    notificationCount: room.notificationCount,

                }))
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
                    id: getRoom.id,
                    title: getRoom.title,
                    participants: getRoom.participants,
                    chats: roomChat
                }, message: "Room fetched successfully"
            };


        } catch (error) {
            console.error("Error in getRoomById:", error);
            return { success: false, message: "Failed to fetch room", value: null };
        }
    }),
    newMessage: protectedProcedure .use(rateLimit()).input(MessageSchema).mutation(async ({ input, ctx }) => {
        try {
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
                        })),
                }))
                return { success: true, value: cleanedRooms, message: "Rooms fetched successfully" };

            } catch (error) {
                console.error("Error in getUserRooms:", error);
                return { success: false, message: "Failed to fetch rooms", value: [] };

            }
        }),

})