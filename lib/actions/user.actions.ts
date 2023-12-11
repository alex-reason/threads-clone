"use server"
import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";
import { connectToDB } from "@/lib/mongoose";
import { UserActionFetchAllParams, UserActionUpdateParams } from "@/lib/interfaces";
import User from "@/lib/models/user.model";
import Thread from "@/lib/models/thread.model";

export async function updateUser({
    userId,
    bio,
    name,
    path,
    username,
    image,
}: UserActionUpdateParams): Promise<void> {
    try {
        connectToDB();
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true
            },
            { upsert: true }
        );

        if (path === '/profile/edit') {
            revalidatePath(path)
        }
    } catch (error: any) {
        console.log(`Failed to create/update user: ${error.message}`);
    }
};

export async function fetchUser(userId: string) {
    try {
        connectToDB()
        return await User
            .findOne({ id: userId })
        // .populate({
        //     path: 'communities',
        //     model: Community
        // })
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
};

export async function fetchUserThreads(userId: string) {
    try {
        connectToDB();
        // find all threads authored by user
        // To do: populate community
        const threads = await User.findOne({ id: userId })
            .populate({
                path: 'threads',
                model: Thread,
                populate: {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'name image id'
                    }
                }
            });
        return threads;
    } catch (error: any) {
        console.log(error.message)
    }
};

export async function fetchAllUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
}: UserActionFetchAllParams) {
    try {
        connectToDB();
        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, "i");

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }, // Exclude the current user from the results.
        };

        if (searchString.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } },
            ]
        };

        const sortOptions = { createdAt: sortBy };

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec()

        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext }
    } catch (error: any) {
        console.log(error.message)
    }
};

export async function fetchUserActivity(userId: string) {
    try {
        connectToDB();
        // find all user threads
        const userThreads = await Thread.find({ author: userId });

        // collect all the child thread ids (replies) from 'children' field
        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        }, []);

        const replies = await Thread.find({
            _id: { $in: childThreadIds },
            author: { $ne: userId },
        }).populate({
            path: "author",
            model: User,
            select: "name image _id"
        });

        return replies;

    } catch (error: any) {
        console.log(error.message)
    }
}

