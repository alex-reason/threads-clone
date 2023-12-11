import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser, fetchUserActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await fetchUserActivity(userInfo._id) || [];

  return (
    <section className="">
      <h1 className="head-text mb-10">
        Activity

        <div className="mt-10 flex flex-col gap-5">
          {activity.length > 0 ? (
            <>
              {
                activity.map((item) => (
                  <>
                  <Link href={`/thread/${item.parentId}`} key={item.id}>
                    <article className="activity-card">
                      <Image
                        src={item.author.image}
                        alt={`${item.author.name} profile picture`}
                        width={20}
                        height={20}
                        className="rounded-full rounded-cover w-6 h-6 bg-[#f2f2f2]"
                      />
                      <p className="!text-small-regular text-light-1 ">
                        <span className="mr-1 text-primary-500">{item.author.name}</span>
                        {" "}replied to your thread
                       
                      </p>
                    </article>
                  </Link>

                  </>
                ))}
            </>
          )
            :
            <p className="!text-base-regular text-light-3">No Activity</p>
          }
        </div>
      </h1>
    </section>
  )
}

export default Page