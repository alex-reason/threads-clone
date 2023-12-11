import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { UserButton, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect("/onboarding");

  const result = await fetchThreads(1, 30);

  // const onLiked = (threadId: string) => {
  //   const containsThread = userInfo.likedThreads.some((likedThread: object) => likedThread.id(threadId));
  //   if (containsThread){
  //     console.log('unlike')
  //   } else {
  //     console.log('liked')
  //   }
  // }

  return (
    <main>
      <div>
        <h1 className="head-text">HOME</h1>
        <section className="mt-9 flex flex-col gap-10">
          {result?.threads.length === 0 ?
            <p className="no-result">No threads found</p>
            :
            <>
              {result?.threads.map((thread) => (
                <ThreadCard
                  key={thread._id}
                  id={thread._id}
                  currentUserId={user.id || ''}
                  parentId={thread.parentId}
                  content={thread.text}
                  author={thread.author}
                  community={thread.community}
                  createdAt={thread.createdAt}
                  comments={thread.children}
                  likes={thread.likes}
                />
              ))}
            </>
          }
        </section>
      </div>
    </main>
  )
}