import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { profileTabs } from "@/constants";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "@/components/shared/ProfileHeader";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";

const Page = async ({ params }: { params: { id: string } }) => {
    const user = await currentUser();
    if (!user) redirect('/login');
    const userInfo = await fetchUser(params.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    return (
        <section>
            <ProfileHeader
                accountId={userInfo.id}
                authUserId={user.id} // checks if current user is viewing own profile or someone else's
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
            />

            <div className="mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {profileTabs.map(profileTab => (
                            <TabsTrigger
                                key={profileTab.label}
                                value={profileTab.value}
                                className="tab"

                            >
                                <Image
                                    src={profileTab.icon}
                                    height={24}
                                    width={24}
                                    alt={profileTab.label}
                                    className="object-contain"
                                />
                                <p className="max-sm:hidden">
                                    {profileTab.label}
                                </p>
                                {
                                    profileTab.label === 'Threads' && (
                                        <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                            {userInfo?.threads?.length}
                                        </p>
                                    )
                                }
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {profileTabs.map(profileTab => (
                        <TabsContent
                            key={`content-${profileTab.label}`}
                            value={profileTab.value}
                            className="w-full text-light-1"
                        >
                            <ThreadsTab
                                currentUserId={user.id}
                                accountId={userInfo.id}
                                accountType="User" // to check if viewing own profile; if so, thread will have delete button
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
};

export default Page;