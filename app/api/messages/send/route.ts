// app/api/messages/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/mongodb';
import Message from '@/models/Message';
import User from '@/models/User';
import { authOptions } from '../../auth/[...nextauth]/route';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { receiverId, content } = await req.json();

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: 'Receiver ID and content are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify that the receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return NextResponse.json(
        { error: 'Receiver not found' },
        { status: 404 }
      );
    }

    const senderId = session.user.id;

    // Create a unique conversation ID (sorted combination of sender and receiver IDs)
    const ids = [senderId, receiverId].sort();
    const conversationId = `${ids[0]}_${ids[1]}`;

    // Create and save the new message
    const newMessage = new Message({
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      conversationId,
      content,
      read: false,
    });

    await newMessage.save();

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: newMessage._id,
        senderId,
        receiverId,
        content,
        createdAt: newMessage.createdAt,
      },
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}