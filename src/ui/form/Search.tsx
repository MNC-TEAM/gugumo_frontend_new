'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';

type FormValues = {
  search: string;
};

const Search = ({ searchHandler }: { searchHandler?: any }) => {
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmitHandler = handleSubmit(searchHandler);

  return (
    <form
      className="relative -order-1 block h-[34px] w-full rounded-lg bg-Surface md:order-1 md:h-[53px] md:w-[492px]"
      onSubmit={onSubmitHandler}
    >
      <input
        type="text"
        className="box-border h-full w-full bg-transparent px-3 text-[13px] font-medium outline-none md:text-base"
        placeholder="제목, 글 내용을 검색해보세요!"
        {...register('search')}
      />
      <button
        type="submit"
        className="absolute right-[10px] top-1/2 w-5 -translate-y-1/2 md:w-auto"
      >
        <Image
          src="/asset/image/icon/search.svg"
          alt="검색버튼"
          width={24}
          height={24}
        />
      </button>
    </form>
  );
};

export default Search;