'use client';

import * as C from '@/constant/card/constant';
import { Content } from '@/types/get.type';
import Bookmark from '@/ui/Button/Bookmark/Bookmark';
import Tag from '@/ui/layout/card/atom/Tag';
import moment from 'moment';
import { useRouter } from 'next/navigation';

const Card = ({ el }: { el: Content }) => {
  const router = useRouter();

  const clickHandler = (postid: number) => {
    router.push(`/detail/${postid}`);
  };

  return (
    <div
      role="none"
      className="cursor-pointer rounded-lg border bg-Surface px-4 py-5 transition-shadow hover:shadow-lg md:border-none md:bg-white"
      onClick={() => clickHandler(el.postId)}
    >
      <div className="flex flex-wrap gap-[5px] leading-none">
        <Tag
          className={`${el.meetingStatus !== 'END' ? 'bg-[#BFE0FF] text-[#4378FF]' : 'bg-OnSurface text-background'}`}
        >
          {C.STATUS[el.meetingStatus]}
        </Tag>
        <Tag className="bg-[#D2FFAE] text-[#54A900]">
          {C.GAMETYPE[el.gameType]}
        </Tag>
        <Tag className="bg-[#FDC9AF] text-[#FF6414]">
          {C.LOCATION[el.location]}
        </Tag>
      </div>

      <h4 className="mt-[11px] line-clamp-2 h-10 text-ellipsis break-keep text-base font-medium leading-[1.3]">
        {el.title}
      </h4>

      <ul className="mt-12 text-[13px] leading-none md:block">
        {el.meetingDateTime && (
          <li className="flex text-OnBackgroundGray">
            <p className="pr-[9px]">시간</p>
            <p className="border-l border-OnBackgroundGray pl-[9px]">
              {moment(el.meetingDateTime).format('YYYY-MM-DD')}
            </p>
          </li>
        )}
        {el.meetingDays && (
          <li className="mt-1 flex text-OnBackgroundGray">
            <p className="pr-[9px]">요일</p>
            <p className="border-l border-OnBackgroundGray pl-[9px]">
              {el.meetingDays.split(';').join(',')}
            </p>
          </li>
        )}
        <li className="mt-1 flex text-OnBackgroundGray">
          <p className="pr-[9px]">인원</p>
          <p className="border-l border-OnBackgroundGray pl-[9px]">
            {el.meetingMemberNum}명
          </p>
        </li>
      </ul>

      <div className="mt-[9.5px] flex flex-wrap items-center justify-between gap-[7px] border-t border-Outline pt-[9.5px]">
        <span className="whitespace-nowrap text-[13px] font-medium text-OnBackgroundGray">
          모집 마감일 {moment(el.meetingDeadline).format('YY.MM.DD')}
        </span>
        <Bookmark bookmarked={el.bookmarked} postId={el.postId} />
      </div>
    </div>
  );
};

export default Card;
