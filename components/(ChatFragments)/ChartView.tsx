"use client"
import { authClient } from '@/lib/auth-client';
import { api } from '@/lib/trpc';
import { Message } from '@/lib/Zod';
import React, { useState, useRef, useLayoutEffect } from 'react'

import { Nav } from '../Nav';
import DropBack from '../DropBack';
import { toast } from 'sonner';
// import { Button } from '../ui/button';
import CreateChatView from './CreateChatView';
import ChartRoomList from './ChartRoomList';
import MessageView from './MessageView';
import { secondsToMilliseconds } from '@/lib/utils';
interface RoomData {
  id: string;
  title: string;
  notificationCount: number;
  participants: {
    name: string;
    isAdmin: boolean;
    joinedAt: Date;
  }[];

}

interface ChatRoomCardProps {
  id: string;
  title: string;
  notificationCount: number;
  participants: {
    name: string;
    isAdmin: boolean;
  }[];
  select: () => void;
}

// Fake data for ChatRoomCardProps
const fakeChatRooms: ChatRoomCardProps[] = [
  {
    id: "room-001",
    title: "Frontend Team",
    notificationCount: 3,
    participants: [
      { name: "Alice Johnson", isAdmin: true },
      { name: "Bob Smith", isAdmin: false },
      { name: "Carol Williams", isAdmin: false },
      { name: "David Brown", isAdmin: false }
    ],
    select: () => console.log("Selected Frontend Team")
  },
  {
    id: "room-002",
    title: "Project Alpha",
    notificationCount: 0,
    participants: [
      { name: "Emily Davis", isAdmin: true },
      { name: "Frank Miller", isAdmin: true },
      { name: "Grace Wilson", isAdmin: false },
      { name: "Henry Taylor", isAdmin: false },
      { name: "Ivy Anderson", isAdmin: false }
    ],
    select: () => console.log("Selected Project Alpha")
  },
  {
    id: "room-003",
    title: "Design Review",
    notificationCount: 12,
    participants: [
      { name: "Jack Thompson", isAdmin: true },
      { name: "Kate Roberts", isAdmin: false },
      { name: "Liam Clark", isAdmin: false }
    ],
    select: () => console.log("Selected Design Review")
  },
  {
    id: "room-004",
    title: "Random Chat",
    notificationCount: 7,
    participants: [
      { name: "Mia Rodriguez", isAdmin: false },
      { name: "Noah Lewis", isAdmin: false },
      { name: "Olivia Martinez", isAdmin: true },
      { name: "Peter Garcia", isAdmin: false },
      { name: "Quinn Lopez", isAdmin: false },
      { name: "Rachel Kim", isAdmin: false }
    ],
    select: () => console.log("Selected Random Chat")
  },
  {
    id: "room-005",
    title: "Bug Fixes",
    notificationCount: 1,
    participants: [
      { name: "Sam Johnson", isAdmin: true },
      { name: "Tina White", isAdmin: false }
    ],
    select: () => console.log("Selected Bug Fixes")
  },
  {
    id: "room-006",
    title: "Marketing Strategy",
    notificationCount: 25,
    participants: [
      { name: "Uma Patel", isAdmin: true },
      { name: "Victor Chen", isAdmin: true },
      { name: "Wendy Zhang", isAdmin: false },
      { name: "Xavier Singh", isAdmin: false },
      { name: "Yuki Tanaka", isAdmin: false },
      { name: "Zoe Carter", isAdmin: false },
      { name: "Alex Morgan", isAdmin: false }
    ],
    select: () => console.log("Selected Marketing Strategy")
  },
  {
    id: "room-007",
    title: "Coffee Break",
    notificationCount: 0,
    participants: [
      { name: "Blake Nelson", isAdmin: false },
      { name: "Chloe Evans", isAdmin: false },
      { name: "Dylan Cooper", isAdmin: true }
    ],
    select: () => console.log("Selected Coffee Break")
  },
  {
    id: "room-008",
    title: "Tech Support",
    notificationCount: 5,
    participants: [
      { name: "Elena Foster", isAdmin: true },
      { name: "Felix Rivera", isAdmin: true },
      { name: "Gabriella Hayes", isAdmin: false },
      { name: "Hassan Ali", isAdmin: false }
    ],
    select: () => console.log("Selected Tech Support")
  }
];

export { fakeChatRooms, type ChatRoomCardProps };
export default function ChartView() {
  const ScrollBoxRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [room, setRoom] = useState<RoomData | null>(null);
  const roomId = room?.id ?? null;
  const utils = api.useUtils(); // tRPC v10 helpers
  // const [messages, setMessages] = useState<Message[]>([]);
  const { data: chatMessages, isPending: chatMessagesPending } = api.ChatRoom.getUserChats.useQuery(
    { roomId: roomId! },
    {
      enabled: !!roomId,                      // only run when a room is selected
      staleTime: 0,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      refetchInterval: roomId ? secondsToMilliseconds(3.3) : false, // polling (pull) while a room is open
      placeholderData: {
        message: "",
        success: true,
        value: []
      },    // smooth room switches

    }
  );
  const { data: rooms, isPending } = api.ChatRoom.getUserRooms.useQuery()
  const messageSend = api.ChatRoom.newMessage.useMutation({
    /**
     * This function is called when the mutation is triggered.
     * It is used to set the optimistic response data before the actual mutation is sent to the server.
     * It takes the variables passed to the mutation as an argument.
     * It is used to cancel the `getUserChats` query, and then set the new data of the `getUserChats` query.
     * It is used to create a new message and add it to the existing messages in the cache.
     * It then returns the previous data, so that the cache can be rolled back if the mutation fails.
     */
    onMutate: async (vars) => {
      if (!roomId) return;
      const formMessage: Message = {
        id: vars.id || "",
        text: vars.text || "",
        authorId: vars.authorId || "",
        roomId: vars.roomId || "",
        isDeleted: false,
        createdAt: vars.createdAt || new Date(),
        images: vars.images?.map((img, i) => ({
          ...img,
          id: vars.id || "",
          ChatRoomID: vars.images?.[i]?.ChatRoomID || "",
          chatOwnerID: vars.images?.[i]?.chatOwnerID || "",
          messageId: vars.images?.[i]?.messageId || "",
          supabaseID: vars.images?.[i]?.supabaseID || "",

        })) || [],


      }

      await utils.ChatRoom.getUserChats.cancel({ roomId });
      const prev = utils.ChatRoom.getUserChats.getData({ roomId });

      utils.ChatRoom.getUserChats.setData({ roomId }, (old) => {
        if (old) {
          return {
            message: "",
            success: true,
            value: [...old.value, formMessage],
          };
        }
        return {
          message: "",
          success: true,
          value: [formMessage],
        };
      })


      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev && roomId) {
        utils.ChatRoom.getUserChats.setData({ roomId }, ctx.prev); // rollback
      }
      toast.error(err.message);
    },
    /**
     * Called after the mutation has finished, whether it was successful or not.
     * Invalidates the cache for the given roomId, so that the chat is refetched.
     */
    onSettled: async () => {
      if (roomId) {
        await utils.ChatRoom.getUserChats.invalidate({ roomId });  // devalue & refetch

      }
    },
  })
  const clearNotifications = api.ChatRoom.userRoomNotification.useMutation({
    onSuccess(data) {
      if (!data.success) {
        toast.error(data.message);
      } else {
        utils.ChatRoom.getUserRooms.invalidate();
      }
    },
  })
  const list = chatMessages?.value || [];       // avoid duplicating state
  const lastKey = list.at(-1)?.id ?? "__none__";
  const scrollToBottom = () => {
    setTimeout(() => {
      if (!ScrollBoxRef.current) return;
      ScrollBoxRef.current.scrollTop = ScrollBoxRef.current.scrollHeight;
    }, 90);
  };
  useLayoutEffect(() => {
    // wait for render + layout (and images) to settle, then snap to bottom
    scrollToBottom();

  }, [lastKey]);




  return (
    <DropBack is={sessionPending}>
      <>
        <Nav session={session} SignOut={authClient.signOut} />
        <CreateChatView />
        <section className={`relative flex w-full flex-1 flex-row overflow-hidden min-h-0  `}
          aria-label="Chat workspace"
        >
          <ChartRoomList
            loading={isPending}
            data={rooms?.value || []}
            onSelect={(roomId) => {
              const room = rooms?.value.find((room) => room.roomId === roomId);
              if (!room) return;
              setRoom({
                id: room.roomId,
                title: room.title,
                notificationCount: room.notificationCount,
                participants: room.member,

              });
              clearNotifications.mutate({ roomId });
            }}
          />
          <div className="flex flex-1 basis-0 min-w-0 min-h-0">
            <MessageView
              sendMessage={(data) => messageSend.mutate(data)}
              roomId={roomId || ""}
              userId={session?.user.id || ""}
              chats={chatMessages?.value || []}
              ScrollBoxRef={ScrollBoxRef}
              loading={chatMessagesPending}
            />
          </div>
        </section>
      </>
    </DropBack>
  )
}
