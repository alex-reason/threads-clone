import { ProfileHeaderProps } from "@/lib/interfaces"
import Image from "next/image"

const ProfileHeader = ({ accountId, authUserId, name, username, imgUrl, bio }: ProfileHeaderProps) => {
    return (
        <div className="flex w-full flex-col justify-start">
            <div className="flex-centered justify-between">
                <div className="flex-centered gap-3">
                    <div className="relative h-20 w-20 object-cover">
                        <Image
                            src={imgUrl}
                            alt="profile image"
                            fill className="rounded-full object-cover shadow-2xl bg-[#f2f2f2]"
                        />
                    </div>

                    <div className="flex-1">
                        <h2 className="text-left text-heading3-bold text-light-1">{name}</h2>
                        <p className="text-base-medium text-gray-1">@{username}</p>
                    </div>
                </div>
            </div>
            {/*TO do: community */}

            <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
            <div className="mt-12 h-0.5 w-full bg-dark-2" />
        </div>
    )
}

export default ProfileHeader