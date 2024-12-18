'use server';

import authIntance from '@/lib/fetchInstance';
import { Return } from '@/types/get.type';
import { revalidateTag } from 'next/cache';

const addAction = async (postId: number): Promise<Return<string>> => {
  const res = await authIntance(`${process.env.API_URL}/api/v1/bookmark/new`, {
    method: 'POST',
    body: JSON.stringify({ postId }),
  });
  revalidateTag('detail');
  return res.json();
};

export default addAction;
