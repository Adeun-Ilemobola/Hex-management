"use client"
import { authClient } from '@/lib/auth-client';
import { api } from '@/lib/trpc';
import { Message } from '@/lib/Zod';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import Chatheader from './Chatheader';
import Loading from '../Loading';
import ChatBox from './ChatBox';
import ChatSend from './ChatSend';
import ChatRoomCard from './ChatRoomCard';
import { Nav } from '../Nav';
import { Inbox } from "lucide-react";
import { isEqual } from '@/lib/utils';
import DropBack from '../DropBack';
import { toast } from 'sonner';
import ScrollBox from '../Scroll';
import { Button } from '../ui/button';
import CreateChatView from './CreateChatView';
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
  const { data: chatMessages, isPending: chatPending } = api.ChatRoom.getUserChats.useQuery(
    { roomId: roomId! },
    {
      enabled: !!roomId,                      // only run when a room is selected
      staleTime: 0,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      refetchInterval: roomId ? 4000 : false, // polling (pull) while a room is open
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
    onSuccess(data, variables, context) {
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
        <CreateChatView/>

        <section
          className={`
        relative mx-auto flex w-full flex-1 flex-col
        px-3 py-2 sm:px-4 md:px-6 md:py-4
        max-w-6xl
       
      `}
          aria-label="Chat workspace"
        >
          {/* Decorative gradient + glass frame */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-primary/10 via-transparent to-transparent"
          />
          <div
            className="
          relative flex min-h-[92vh] max-h-[calc(90vh-80px)] flex-1 flex-col overflow-hidden
          rounded-3xl border border-border/50
          bg-background/60 backdrop-blur-xl
          shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]
          supports-[backdrop-filter]:bg-background/50
        "
          >
            {/* Header (sticky when room selected) */}
            {room && (
              <div className="sticky top-0 z-20">
                <Chatheader
                  Back={() => setRoom(null)}
                  mebers={room.participants.map((p) => p.name) || []}
                  title={room.title}
                />
                <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              </div>
            )}

            {/* Chat room selected */}
            {room && (
              <>
                {/* Messages */}
                <ScrollBox
                  className='flex-1'
                  ref={ScrollBoxRef}


                >
                  <div
                    className="
                  relative  flex w-full flex-col gap-4
                  px-2 py-4 sm:px-2 md:px-3 md:py-3
                "
                  >
                    {/* Background accents */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(60%_40%_at_50%_20%,black,transparent)]"
                      style={{
                        background:
                          "radial-gradient(1200px 350px at 50% -10%, rgba(99,102,241,0.15), transparent 60%), radial-gradient(800px 300px at 80% 0%, rgba(236,72,153,0.08), transparent 60%)",
                      }}
                    />
                    {list.map((message) => (
                      <ChatBox
                        key={message.id}
                        id={message.id}
                        text={message.text || ""}
                        img={message.images || []}
                        authorId={message.authorId}
                        roomId={room.id}
                        isUser={message.authorId === session?.user?.id}
                      />
                    ))}
                  </div>
                </ScrollBox>

                {/* Composer */}
                <div
                  className="
                sticky bottom-0 z-20 w-full border-t border-border/60
                bg-background/80 backdrop-blur-xl
              "
                >
                  <div className="mx-auto max-w-3xl px-3 py-2 sm:px-4 md:px-6 md:py-3">
                    <ChatSend
                      roomId={room.id}
                      sendMessage={(data) => {
                        console.log(data);


                        messageSend.mutate(data);
                      }}
                      userId={session?.user?.id || ""}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Room list when no room selected */}
            {!room && (
              <>
                {isPending ? (<>
                  <div className="flex flex-1">
                    <Loading full={false} />
                  </div>


                </>) : (<>
                  {rooms?.value.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center p-8 text-center">
                      <div className="flex max-w-md flex-col items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-primary/20 blur-2xl" />
                          <Inbox className="h-10 w-10 text-muted-foreground" aria-hidden />
                        </div>
                        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                          No rooms available
                        </h1>
                        <p className="text-sm text-muted-foreground">
                          Create or join a room to start a conversation.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ScrollBox className="flex-1 px-1"  >
                      <div
                        className="
                    mx-auto grid w-full gap-1 px-1 py-2 sm:gap-2 sm:px-4 md:max-w-5xl md:grid-cols-2 md:gap-3 md:px-4
                  "
                      >
                        {rooms?.value.map((r) => (
                          <ChatRoomCard
                            key={r.chatRoomMemberId}
                            type={r.type}

                            title={r.title}
                            notificationCount={r.notificationCount}
                            participants={r.member.map((m) => ({
                              name: m.name,
                              isAdmin: m.isAdmin,
                            }))}
                            select={() => {
                              setRoom({
                                id: r.roomId,
                                title: r.title,
                                notificationCount: r.notificationCount,
                                participants: r.member.map((m) => ({
                                  name: m.name,
                                  isAdmin: m.isAdmin,
                                  joinedAt: m.joinedAt,
                                })),
                              })
                              clearNotifications.mutate({ roomId: r.roomId });
                            }

                            }
                          />
                        ))}
                      </div>
                    </ScrollBox>
                  )}

                </>)}
              </>
            )}


            {/* Header (sticky when room selected) */}

          </div>
        </section>

      </>
    </DropBack>
  )
}
