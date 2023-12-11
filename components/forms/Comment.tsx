"use client"
import * as z from 'zod';
import { usePathname, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from '../ui/input';
import { Button } from "@/components/ui/button";
import { CommentValidation } from '@/lib/validations/thread';
// add comment function
import { CommentProps } from "@/lib/interfaces";
import Image from 'next/image';
import { addCommentToThread } from '@/lib/actions/thread.actions';
const Comment = ({ threadId, currentUserImg, currentUserId }: CommentProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: '',
            accountId: currentUserId
        }
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname);
        form.reset();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className='flex-centered gap-3 w-full'>
                            <FormLabel>
                                <Image
                                    src={currentUserImg}
                                    alt='current user profile image'
                                    width={48}
                                    height={48}
                                    className='rounded-full object-cover'
                                />
                            </FormLabel>
                            <FormControl className='border-none bg-transparent'>
                                <Input
                                    placeholder='comment'
                                    className='no-focus outline-none text-light-1'
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" className='comment-form_btn'>Reply</Button>
            </form>
        </Form>
    )
};

export default Comment;