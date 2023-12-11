import { SortOrder } from "mongoose";

export interface AccountProps {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string;
};

export interface UserActionUpdateParams {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string
};

export interface UserActionFetchAllParams {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
};

export interface ThreadActionCreateParams {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
};


export interface ThreadCardProps {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: {
        name: string;
        image: string;
        id: string;
    };
    community: {
        id: string;
        name: string;
        image: string;
    } | null;
    createdAt: string;
    comments: {
        author: {
            image: string;
        };
    }[];
    isComment?: boolean;
    likes: number,
    // likeHandler: (threadId: string) => {}
};

export interface UserCardProps {
    id: string;
    name: string;
    username: string;
    imgUrl: string;
    personType: string;
};

// for liking thread function
export interface UpdateThreadParams {
    threadId: string,
    inUserLikedThreads: boolean
};

export interface CommentProps {
    threadId: string,
    currentUserImg: string,
    currentUserId: string
}

export interface ProfileHeaderProps {
    accountId: string,
    authUserId: string,
    name: string,
    username: string,
    imgUrl: string,
    bio: string
}

export interface ThreadsTabProps {
    currentUserId: string,
    accountId: string,
    accountType: string
}