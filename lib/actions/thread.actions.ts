"use server"

import { connectToDB } from "../mongoose";
import { ThreadActionCreateParams, UpdateThreadParams } from "@/lib/interfaces";
import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import { AnyARecord } from "dns";
import { revalidatePath } from "next/cache";

export async function createThread({ text, author, communityId, path }: ThreadActionCreateParams) {
    try {
        connectToDB();
        const createThread = await Thread.create({
            text,
            author,
            community: null,
        });

        // update user model
        await User.findByIdAndUpdate(author, {
            $push: { threads: createThread._id }
        })

        revalidatePath(path);
    } catch (error: any) {
        console.log(`Failed to create thread: ${error.message}`);
    }
};

export async function fetchThreads(pageNumber: number = 1, pageSize: number = 20) {
    try {
        connectToDB();
        //calculate numbers of post to skip depending on current page
        const skipAmount = (pageNumber - 1) * pageSize;
        // fetch posts with no parent (ia top-level post);
        const threadsQuery = Thread.find({ parentId: { $in: [null || undefined] } })
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: 'author', model: User })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: '_id name parentId image'
                }
            });

        const totalThreadsCount = await Thread.countDocuments({ parentId: { $in: [null || undefined] } })

        const threads = await threadsQuery.exec();

        const isNext = totalThreadsCount > skipAmount + threads.length;

        return { threads, isNext };
    } catch (error: any) {
        console.log(error.message)
    }
}

export async function fetchThreadById(id: string) {
    connectToDB();
    try {
        // TO DO: populate community
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id name image "
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec();

        return thread;
    } catch (error: any) {
        console.log(error)
    }
}
// export async function updateThread({
//     threadId,
//     inUserLikedThreads
// }: UpdateThreadParams): Promise<void> {
//     try {
//         connectToDB();
//         await Thread.findOneAndUpdate(
//             { id: threadId },
//             {
//                 likes: 0,
//             },
//             { upsert: true }
//         );
//     } catch (error: any) {
//         console.log(`Failed to create/update thread: ${error.message}`);
//     }
// };

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
) {
    connectToDB();
    try {
        // find the original thread;
        const originalThread = await Thread.findById(threadId);
        if (!originalThread) {
            throw new Error("Thread not found")
        }
        // create new thread
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        })
        // save new thead
        const savedCommentThread = await commentThread.save();

        // update the original thread to include the new comment
        originalThread.children.push(savedCommentThread._id);

        // save the original thread
        await originalThread.save();

        revalidatePath(path)


    } catch (error: any) {
        console.log(error.message)
    }
};

