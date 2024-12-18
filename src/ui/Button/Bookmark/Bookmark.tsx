'use client';

import addAction from '@/actions/auth/bookmark/addAction';
import deleteAction from '@/actions/auth/bookmark/deleteAction';
import BookmarkSVG from '@/asset/image/bookmark.svg';
import { useToast } from '@/provider/ToastProvider';
import { useSession } from 'next-auth/react';
import { MouseEvent } from 'react';

interface BookmarkProps {
  bookmarked: boolean;
  postId: number;
}

const Bookmark = ({ bookmarked, postId }: BookmarkProps) => {
  const { showToast } = useToast();
  const { data: session } = useSession();

  const addMutation = async () => {
    const res = await addAction(postId);
    if (res.status === 'fail')
      return showToast('error', '오류가 발생했습니다.');
    showToast('success', '북마크가 등록 되었습니다.');
  };

  const deleteMutation = async () => {
    const res = await deleteAction(postId);
    if (res.status === 'fail')
      return showToast('error', '오류가 발생했습니다.');
    showToast('success', '북마크가 해제 되었습니다.');
  };

  const bookmarkHandler = async (e: MouseEvent) => {
    e.stopPropagation();

    if (!session) return showToast('error', '로그인을 해야합니다.');

    if (!bookmarked) return addMutation();

    if (window.confirm('정말 삭제하시겠습니까?')) return deleteMutation();
  };

  return (
    <button
      aria-label="북마크 버튼"
      type="button"
      onClick={bookmarkHandler}
      className="cursor-pointer"
    >
      <BookmarkSVG
        className={`stroke-[#4FAAFF] group-hover:stroke-white ${bookmarked ? 'text-[#4FAAFF]' : 'text-white'}`}
        width={24}
        height={24}
        alt="북마크 아이콘"
      />
    </button>
  );
};

export default Bookmark;
