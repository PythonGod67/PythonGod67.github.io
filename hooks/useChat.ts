import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, addDoc, onSnapshot, Timestamp, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '@/firebase-config';

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Timestamp;
}

interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTimestamp: Timestamp;
}

export const useChat = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentChatRoom, setCurrentChatRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchChatRooms = useCallback(async () => {
    if (!userId) return;

    try {
      const q = query(
        collection(db, 'chatRooms'),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTimestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const rooms = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ChatRoom));
        setChatRooms(rooms);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      console.error('Error fetching chat rooms:', err);
      setError('Failed to fetch chat rooms');
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const unsubscribe = fetchChatRooms();
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [fetchChatRooms]);

  const fetchMessages = useCallback(async (chatRoomId: string) => {
    if (!userId) return;

    try {
      const q = query(
        collection(db, 'messages'),
        where('chatRoomId', '==', chatRoomId),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Message));
        setMessages(msgs);
      });

      setCurrentChatRoom(chatRoomId);
      return unsubscribe;
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to fetch messages');
    }
  }, [userId]);

  const sendMessage = async (content: string, recipientId: string) => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    try {
      let chatRoomId = currentChatRoom;

      if (!chatRoomId) {
        // Create a new chat room if it doesn't exist
        const chatRoomRef = await addDoc(collection(db, 'chatRooms'), {
          participants: [userId, recipientId],
          lastMessage: content,
          lastMessageTimestamp: Timestamp.now()
        });
        chatRoomId = chatRoomRef.id;
        setCurrentChatRoom(chatRoomId);
      }

      await addDoc(collection(db, 'messages'), {
        chatRoomId,
        senderId: userId,
        recipientId,
        content,
        timestamp: Timestamp.now()
      });

      // Update the chat room's last message
      await updateDoc(doc(db, 'chatRooms', chatRoomId), {
        lastMessage: content,
        lastMessageTimestamp: Timestamp.now()
      });

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const createChatRoom = async (vendorId: string): Promise<string | undefined> => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    try {
      // Check if a chat room already exists
      const q = query(
        collection(db, 'chatRooms'),
        where('participants', '==', [userId, vendorId].sort())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Chat room already exists, return its ID
        return querySnapshot.docs[0].id;
      }

      // Create a new chat room
      const chatRoomRef = await addDoc(collection(db, 'chatRooms'), {
        participants: [userId, vendorId].sort(),
        lastMessage: '',
        lastMessageTimestamp: Timestamp.now()
      });

      return chatRoomRef.id;
    } catch (err) {
      console.error('Error creating chat room:', err);
      setError('Failed to create chat room');
    }
  };

  return {
    userId,
    messages,
    chatRooms,
    currentChatRoom,
    loading,
    error,
    fetchMessages,
    sendMessage,
    createChatRoom
  };
};