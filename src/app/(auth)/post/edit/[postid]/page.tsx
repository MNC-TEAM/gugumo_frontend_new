import get from '@/actions/meeting/detailActions';
import Form from '@/components/post/write/Form';
import Wrap from '@/ui/layout/Wrap';

export default async function Edit({ params }: { params: { postid: string } }) {
  const { data: detail } = await get(params.postid);

  return (
    <main className="py-20 md:pb-36 md:pt-[90px]">
      <Wrap>
        <Form edit={detail} />
      </Wrap>
    </main>
  );
}
