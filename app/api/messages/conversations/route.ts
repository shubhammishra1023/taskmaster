// app/api/messages/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/mongodb';
import Message from '@/models/Message';
import User from '@/models/User';
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

    // Find all conversations where the user is either sender or receiver
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 } // Sort by newest first
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$receiverId', new mongoose.Types.ObjectId(userId)] },
                  { $eq: ['$read', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          let: { 
            senderId: '$lastMessage.senderId', 
            receiverId: '$lastMessage.receiverId' 
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $and: [
                      { $eq: ['$_id', '$$senderId'] },
                      { $ne: ['$$senderId', new mongoose.Types.ObjectId(userId)] }
                    ]},
                    { $and: [
                      { $eq: ['$_id', '$$receiverId'] },
                      { $ne: ['$$receiverId', new mongoose.Types.ObjectId(userId)] }
                    ]}
                  ]
                }
              }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                role: 1,
                profileImage: 1
              }
            }
          ],
          as: 'otherUser'
        }
      },
      {
        $unwind: '$otherUser'
      },
      {
        $project: {
          _id: 0,
          conversationId: '$_id',
          lastMessage: {
            _id: '$lastMessage._id',
            content: '$lastMessage.content',
            senderId: '$lastMessage.senderId',
            createdAt: '$lastMessage.createdAt'
          },
          otherUser: 1,
          unreadCount: 1
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 } // Sort by newest message
      }
    ]);

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { error: 'Failed to get conversations' },
      { status: 500 }
    );
  }
}