'use server';

import { FormData } from '@/components/post/write/Form';
import authIntance from '@/lib/fetchInstance';
import { Return } from '@/types/get.type';
import { PatchActionProps } from '@/types/post.type';
import { revalidateTag } from 'next/cache';

const patchAction = async ({
  body,
  postId,
}: {
  body: FormData;
  postId: number;
}): Promise<Return<string>> => {
  const res = await authIntance(
    `${process.env.API_URL}/api/v1/meeting/${postId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(body),
    },
  );
  revalidateTag('detail');
  return res.json();
};

export default patchAction;
