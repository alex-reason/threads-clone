import { fetchUserThreads } from "@/lib/actions/user.actions";
import { ThreadsTabProps } from "@/lib/interfaces";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

const ThreadsTab = async ({ currentUserId, accountId, accountType }: ThreadsTabProps) => {

    let result = await fetchUserThreads(accountId);
    if (!result) redirect('/');

    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((thread: any)=> (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={accountType === 'User' ? {name: result.name, image: result.image, id: result.id} : thread.author} // to update
                    community={thread.community} // to update
                    createdAt={thread.createdAt}
                    comments={thread.children}
                    likes={thread.likes}
                />
            ))}
        </section>
    )
};

export default ThreadsTab;