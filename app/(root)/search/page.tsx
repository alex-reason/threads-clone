import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchAllUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    // fetch all users
    const result = await fetchAllUsers({
        userId: user.id,
        searchString: '',
        pageNumber: 1,
        pageSize: 25,
    });

    return (
        <section className="">
            <h1 className="head-text mb-10">
                <div className='mt-14 flex flex-col gap-9'>
                    {result?.users.length === 0 ? (
                        <p className='no-result'>No Result</p>
                    ) : (
                        <>
                            {result?.users.map((person) => (
                                <UserCard
                                    key={person.id}
                                    id={person.id}
                                    name={person.name}
                                    username={person.username}
                                    imgUrl={person.image}
                                    personType='User'
                                />
                            ))}
                        </>
                    )}
                </div>
            </h1>
        </section>
    )
}

export default Page