'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, push, set, onValue, off, serverTimestamp, update, query as fbQuery, orderByKey, limitToLast, endAt } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '@/firebase-config';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, Paperclip, Image as ImageIcon, X, ThumbsUp, ThumbsDown, Smile } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  reactions: { [userId: string]: string };
  readBy: string[];
}

interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTimestamp: number;
}

const MESSAGES_PER_PAGE = 20;

const useIntersectionObserver = (ref: React.RefObject<HTMLElement>, options: IntersectionObserverInit = {}): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isIntersecting;
};

const ChatPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const currentUser = auth.currentUser;

  const isLoadMoreVisible = useIntersectionObserver(loadMoreRef, { threshold: 1 });

  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const usersRef = ref(db, 'users');
      return new Promise((resolve, reject) => {
        onValue(usersRef, (snapshot) => {
          const usersData = snapshot.val();
          const usersArray = Object.keys(usersData).map(key => ({
            id: key,
            ...usersData[key]
          }));
          resolve(usersArray);
        }, (error) => {
          reject(error);
        });
      });
    }
  });

  const { data: chatRooms, isLoading: isLoadingChatRooms, error: chatRoomsError } = useQuery({
    queryKey: ['chatRooms', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser) return [];
      const chatRoomsRef = ref(db, `userChatRooms/${currentUser.uid}`);
      return new Promise<ChatRoom[]>((resolve, reject) => {
        onValue(chatRoomsRef, (snapshot) => {
          const roomsData = snapshot.val();
          const roomsArray = roomsData ? Object.keys(roomsData).map(key => ({
            id: key,
            ...roomsData[key]
          })) : [];
          resolve(roomsArray);
        }, (error) => {
          reject(error);
        });
      });
    }
  });

  const {
    data: messagesPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
    error: messagesError
  } = useInfiniteQuery({
    queryKey: ['messages', selectedUser],
    queryFn: async ({ pageParam = null }) => {
      if (!selectedUser || !currentUser) return { messages: [], nextCursor: null };
      const chatRoomId = [currentUser.uid, selectedUser].sort().join('_');
      const messagesRef = ref(db, `messages/${chatRoomId}`);
      const messagesQuery = pageParam
        ? fbQuery(messagesRef, orderByKey(), endAt(pageParam), limitToLast(MESSAGES_PER_PAGE + 1))
        : fbQuery(messagesRef, orderByKey(), limitToLast(MESSAGES_PER_PAGE));

      return new Promise<{ messages: Message[], nextCursor: string | null }>((resolve, reject) => {
        onValue(messagesQuery, (snapshot) => {
          const messagesData = snapshot.val();
          let messagesArray = messagesData ? Object.keys(messagesData).map(key => ({
            id: key,
            ...messagesData[key]
          })) : [];

          let nextCursor = null;
          if (messagesArray.length > MESSAGES_PER_PAGE) {
            nextCursor = messagesArray[0].id;
            messagesArray = messagesArray.slice(1);
          }

          resolve({ messages: messagesArray.reverse(), nextCursor });
        }, (error) => {
          reject(error);
        });
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!selectedUser && !!currentUser
  });

  const messages = messagesPages?.pages.flatMap(page => page.messages) || [];

  useEffect(() => {
    if (messages.length > 0 && !isFetchingNextPage) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isFetchingNextPage]);

  useEffect(() => {
    if (isLoadMoreVisible && hasNextPage) {
      fetchNextPage();
    }
  }, [isLoadMoreVisible, fetchNextPage, hasNextPage]);

  useEffect(() => {
    if (!currentUser || !selectedUser) return;
    const typingRef = ref(db, `typing/${selectedUser}`);
    const typingHandler = (snapshot: any) => {
      setIsTyping(snapshot.val()?.isTyping || false);
    };
    onValue(typingRef, typingHandler);
    return () => off(typingRef, 'value', typingHandler);
  }, [currentUser, selectedUser]);

  const sendMessageMutation = useMutation({
    mutationFn: async ({ text, mediaUrl, mediaType }: { text: string, mediaUrl?: string, mediaType?: string }) => {
      if (!currentUser || !selectedUser) return;
      const chatRoomId = [currentUser.uid, selectedUser].sort().join('_');
      const newMessageRef = push(ref(db, `messages/${chatRoomId}`));
      const messageData = {
        senderId: currentUser.uid,
        text,
        timestamp: serverTimestamp(),
        ...(mediaUrl && mediaType ? { mediaUrl, mediaType } : {}),
        reactions: {},
        readBy: [currentUser.uid]
      };
      await set(newMessageRef, messageData);
      await update(ref(db, `userChatRooms/${currentUser.uid}/${chatRoomId}`), {
        lastMessage: text,
        lastMessageTimestamp: serverTimestamp()
      });
      await update(ref(db, `userChatRooms/${selectedUser}/${chatRoomId}`), {
        lastMessage: text,
        lastMessageTimestamp: serverTimestamp()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedUser] });
      queryClient.invalidateQueries({ queryKey: ['chatRooms', currentUser?.uid] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSendMessage = async () => {
    if (!message.trim() && !mediaFile) return;

    setIsUploading(true);
    let mediaUrl = '';
    let mediaType = '';

    try {
      if (mediaFile) {
        const fileRef = storageRef(storage, `chat_media/${Date.now()}_${mediaFile.name}`);
        const snapshot = await uploadBytes(fileRef, mediaFile);
        mediaUrl = await getDownloadURL(snapshot.ref);
        mediaType = mediaFile.type.startsWith('image/') ? 'image' : 
                    mediaFile.type.startsWith('video/') ? 'video' : 
                    mediaFile.type.startsWith('audio/') ? 'audio' : '';
      }

      await sendMessageMutation.mutateAsync({ text: message, mediaUrl, mediaType });
      setMessage('');
      setMediaFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload media. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
    }
  };

  const updateTypingStatus = useCallback(
    (isTyping: boolean) => {
      if (currentUser && selectedUser) {
        const typingRef = ref(db, `typing/${currentUser.uid}`);
        set(typingRef, { isTyping, timestamp: serverTimestamp() });
      }
    },
    [currentUser, selectedUser]
  );

  const handleReaction = async (messageId: string, reaction: string) => {
    if (!currentUser || !selectedUser) return;
    const chatRoomId = [currentUser.uid, selectedUser].sort().join('_');
    const messageRef = ref(db, `messages/${chatRoomId}/${messageId}/reactions/${currentUser.uid}`);
    await set(messageRef, reaction);
    queryClient.invalidateQueries({ queryKey: ['messages', selectedUser] });
  };

  useEffect(() => {
    if (!currentUser || !selectedUser || !messages.length) return;
    const chatRoomId = [currentUser.uid, selectedUser].sort().join('_');
    const unreadMessages = messages.filter(msg => msg.senderId !== currentUser.uid && !msg.readBy.includes(currentUser.uid));
    unreadMessages.forEach(msg => {
      const messageRef = ref(db, `messages/${chatRoomId}/${msg.id}/readBy/${currentUser.uid}`);
      set(messageRef, true);
    });
  }, [currentUser, selectedUser, messages]);

  if (usersError || chatRoomsError || messagesError) {
    return <div>Error loading chat data. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Chat</h1>
      <div className="flex flex-1 gap-4 overflow-hidden">
        <Card className="w-1/4 overflow-y-auto">
          <CardContent className="p-4">
            <Input 
              type="text" 
              placeholder="Search users..." 
              className="mb-4"
              onChange={(e) => {
                // Implement user search logic here
              }}
            />
            {isLoadingUsers || isLoadingChatRooms ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {chatRooms?.map((room) => (
                  <Button
                    key={room.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSelectedUser(room.participants.find(id => id !== currentUser?.uid) || null)}
                  >
                    <Avatar className="mr-2">
                      <AvatarImage src={users?.find(u => u.id === room.participants.find(id => id !== currentUser?.uid))?.photoURL} />
                      <AvatarFallback>{users?.find(u => u.id === room.participants.find(id => id !== currentUser?.uid))?.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-semibold">{users?.find(u => u.id === room.participants.find(id => id !== currentUser?.uid))?.displayName}</p>
                      <p className="text-sm text-gray-500 truncate">{room.lastMessage}</p>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 overflow-y-auto p-4">
            {isLoadingMessages ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <>
                {hasNextPage && (
                  <div ref={loadMoreRef} className="flex justify-center py-2">
                    {isFetchingNextPage ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Button onClick={() => fetchNextPage()} variant="ghost">
                        Load more messages
                      </Button>
                    )}
                  </div>
                )}
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${msg.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div className={`max-w-[70%] ${msg.senderId === currentUser?.uid ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg p-3`}>
                        {msg.mediaUrl && (
                          <div className="mb-2">
                            {msg.mediaType === 'image' && (
                              <Image src={msg.mediaUrl} alt="Shared image" width={200} height={200} className="rounded-lg" />
                            )}
                            {msg.mediaType === 'video' && (
                              <video src={msg.mediaUrl} controls className="rounded-lg" style={{ maxWidth: '200px' }} />
                            )}
                            {msg.mediaType === 'audio' && (
                              <audio src={msg.mediaUrl} controls className="w-full" />
                            )}
                          </div>
                        )}
                        <p>{msg.text}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs opacity-70">{msg.timestamp ? format(msg.timestamp, 'HH:mm') : 'Sending...'}</p>
                          <div className="flex space-x-1">
                            {Object.entries(msg.reactions || {}).map(([userId, reaction]) => (
                              <span key={userId} className="text-xs">{reaction}</span>
                            ))}
                          </div>
                        </div>
                        {msg.senderId !== currentUser?.uid && (
                          <div className="flex justify-end space-x-1 mt-1">
                            <button onClick={() => handleReaction(msg.id, '👍')} className="text-xs">👍</button>
                            <button onClick={() => handleReaction(msg.id, '👎')} className="text-xs">👎</button>
                            <button onClick={() => handleReaction(msg.id, '😄')} className="text-xs">😄</button>
                          </div>
                        )}
                        {index === messages.length - 1 && msg.senderId === currentUser?.uid && (
                          <div className="text-xs text-right mt-1">
                            {msg.readBy?.includes(selectedUser as string) ? 'Read' : 'Delivered'}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>
          <CardContent className="p-4 border-t">
            {isTyping && (
              <div className="text-sm text-gray-500 mb-2">
                {users?.find(u => u.id === selectedUser)?.displayName} is typing...
              </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-2">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,video/*,audio/*"
                className="hidden"
              />
              <Input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  updateTypingStatus(e.target.value.length > 0);
                }}
                onBlur={() => updateTypingStatus(false)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isUploading || (!message.trim() && !mediaFile)}>
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
            {mediaFile && (
              <div className="mt-2 flex items-center">
                <p className="text-sm text-gray-500 truncate flex-1">{mediaFile.name}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setMediaFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;