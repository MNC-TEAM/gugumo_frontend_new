'use server';

import authIntance from '@/lib/fetchInstance';
import { Return } from '@/types/get.type';

const allReadAction = async (): Promise<Return<string>> => {
  const res = await authIntance(
    `${process.env.API_URL}/api/v1/notification/read`,
    {
      method: 'PATCH',
    },
  );
  return res.json();
};

export default allReadAction;
