"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { deleteThread } from "@/lib/actions/thread.actions";
import { DeleteThreadProps } from "@/lib/interfaces";


const DeleteThread = ({
    threadId,
    currentUserId,
    authorId,
    parentId,
    isComment,
}: DeleteThreadProps) => {
    const pathname = usePathname();
    const router = useRouter();

    if (currentUserId !== authorId || pathname === "/") return null;

    const deleteHandler = async () => {
        await deleteThread(JSON.parse(threadId), pathname);
        if (!parentId || !isComment) {
            router.push("/");
        }
    };

    return (
        <Image
            src='/assets/delete.svg'
            alt='delete'
            width={18}
            height={18}
            className='cursor-pointer object-contain'
            onClick={deleteHandler}
        />
    );
}

export default DeleteThread;