// app/api/messages/unread-count/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/mongodb';
import Message from '@/models/Message';
import { authOptions } from '../../auth/[...nextauth]/route';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const userId = session.user.id;

    // Count unread messages
    const unreadCount = await Message.countDocuments({
      receiverId: new mongoose.Types.ObjectId(userId),
      read: false
    });

    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    return NextResponse.json(
      { error: 'Failed to get unread message count' },
      { status: 500 }
    );
  }
}
