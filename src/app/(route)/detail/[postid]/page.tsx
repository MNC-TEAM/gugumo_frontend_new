import get from '@/actions/public/detailActions';
import Comments from '@/components/page/post/detail/Comment/Comments';
import DetailUI from '@/components/page/post/detail/DetailUI';
import Skeleton from '@/components/page/post/detail/SkeletonUI/Skeleton';
import Wrap from '@/ui/layout/Wrap';
import Recommends from '@/ui/layout/recommends/Recommends';
import { Suspense } from 'react';

const Detail = async ({ params }: DetailProps) => {
  const detail = await get(params.postid);

  return (
    <main className="pb-36 pt-10 md:pb-40 md:pt-[108px]">
      <Wrap>
        <Suspense fallback={<Skeleton />}>
          <DetailUI detail={detail.data} />
          <Recommends />
          <Comments postid={params.postid} />
        </Suspense>
      </Wrap>
    </main>
  );
};

export default Detail;

export const generateMetadata = async ({ params }: DetailProps) => {
  const detail = await get(params.postid);

  return {
    title: `구구모 - ${detail.data.title}`,
  };
};

interface DetailProps {
  params: { postid: string };
}
