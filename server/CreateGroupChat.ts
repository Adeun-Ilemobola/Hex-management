"use server";
import  prisma  from "@/lib/prisma";


interface CreateGroupChatProps {
    // PropertyID: string;
    groupName: string;
    members: string[]
    currentAdminId: string
   
}



export async function CreateGroupChat({  groupName, members , currentAdminId }: CreateGroupChatProps) {
    try {
        const validUsers = await prisma.user.findMany({
            where: {
                email: {
                    in: members
                }
            }
        })
            const newChatRoon = await prisma.chatRoom.create({
                data: {
                    title: groupName,
                    type: validUsers.length >0 ? "GROUP" : "PRIVATE",
                }
            })
            const newMembers= await Promise.all(validUsers.map(async (user) => {
               const member = await prisma.chatRoomMember.create({
                    data: {
                       roomId: newChatRoon.id,
                       userId: user.id,
                       isAdmin: user.id === currentAdminId,
                       notificationCount: 0,
                       userName: user.name
                    }
                })
                return member
            }))

            return{
                success: true,
                message: "Group chat created successfully",
                roomId: newChatRoon.id
            }
    } catch (error) {
        console.log(error);
        return{
            success: false,
            message: "Failed to create group chat"
        }
    }
}


export async function getOwnerPropertieCount({ ownerType, ownerId }: { ownerType: "USER" | "ORGANIZATION"; ownerId: string }) {
    try {
        if (ownerType === "USER") {
            const total = await prisma.propertie.count({
                where: {
                    ownerType: "USER",
                    ownerId: ownerId
                }
            })
            return total
        } else {
            const total = await prisma.propertie.count({
                where: {
                    ownerType: "ORGANIZATION",
                    ownerId: ownerId
                }
            })
            return total
        }
         
    } catch (error) {
        console.log(error);
        return null;
    }
}