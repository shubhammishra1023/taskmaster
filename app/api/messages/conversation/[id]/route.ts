// app/api/messages/conversation/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/mongodb';
import Message from '@/models/Message';
import { authOptions } from '../../../auth/[...nextauth]/route';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const conversationId = params.id;
    const userId = session.user.id;

    await connectToDatabase();

    // Verify that the user is part of this conversation
    const conversationExists = await Message.findOne({
      conversationId,
      $or: [
        { senderId: new mongoose.Types.ObjectId(userId) },
        { receiverId: new mongoose.Types.ObjectId(userId) }
      ]
    });

    if (!conversationExists) {
      return NextResponse.json(
        { error: 'Conversation not found or you do not have access' },
        { status: 404 }
      );
    }

    // Get all messages in the conversation
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 }) // Sort by oldest first
      .lean();

    // Mark unread messages as read
    await Message.updateMany(
      {
        conversationId,
        receiverId: new mongoose.Types.ObjectId(userId),
        read: false
      },
      { $set: { read: true } }
    );

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Get conversation messages error:', error);
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}