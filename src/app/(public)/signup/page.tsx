"use client"
import Wrap from "@/components/Common/Wrap";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoCheckmarkOutline } from "react-icons/io5";

const GAMETYPE = [{get : "BADMINTON",name : "배드민턴"},{get : "FUTSAL",name : "풋살"},{get : "BASKETBALL",name : "농구"},{get : "TENNIS",name : "테니스"},{get : "TABLETENNIS",name : "탁구"},{get : "BASEBALL",name : "야구"}];

export default function Signup() {

    const router = useRouter();
    const {register,handleSubmit,getValues} = useForm();
    const [isSend,setIsSend] = useState(false);
    const [isCheck,setIsCheck] = useState(false);
    const [isService,setIsService] = useState({
        isAgreeTermsUse : false,
        isAgreeCollectingUsingPersonalInformation : false,
        isAgreeMarketing : false
    })
    const [likeGame,setLikeGame] = useState<string[]>([]);

    const mailSendHandler = async ()=>{

        const {username} = getValues();

        try {
            const res = await fetch('/back/api/v1/mailSend',{
                method : "POST",
                headers : {
                    "Content-Type": "Application/json"
                },
                body : JSON.stringify({email : username})
            });

            if(res.ok){
                const data = await res.json();

                if(data.status === "success"){
                    setIsSend(true);
                    return alert(data.data);
                }else{
                    setIsSend(false);    
                }

            }else{
                setIsSend(false);
            }
        }
        catch(err){
            console.log(err);
            setIsSend(false);
        }

    } 

    const mailAuthCheckHanlder = async ()=>{

        const {username,emailAuthNum} = getValues();

        try {
            const res = await fetch('/back/api/v1/mailAuthCheck',{
                method : "POST",
                headers : {
                    "Content-Type": "Application/json"
                },
                body : JSON.stringify({email : username,emailAuthNum})
            });

            if(res.ok){
                const data = await res.json();

                if(data.status === "success"){
                    setIsCheck(true);
                    return alert('인증이 완료 되었습니다.');
                }else{
                    return alert('인증에 실패 하였습니다.');
                }

            }else{
                setIsCheck(false);
                return alert('서버와 통신에 실패하였습니다.');
            }
        }
        catch(err){
            setIsCheck(false);
            return alert('오류가 발생했습니다.');
        }

    }

    const allCheckHandler = ()=>{
        if(Object.values(isService).every(value =>value)){
            setIsService(prev=>({
                ...prev,
                isAgreeTermsUse : false,
                isAgreeCollectingUsingPersonalInformation : false,
                isAgreeMarketing : false
            }))
        }else{
            setIsService(prev=>({
                ...prev,
                isAgreeTermsUse : true,
                isAgreeCollectingUsingPersonalInformation : true,
                isAgreeMarketing : true
            }))
        }
    }

    const isServiceHandler = (key : string, value : boolean)=>{
        setIsService(prev=>({
            ...prev,
            [key] : value
        }))
    }

    const gameTypeClickHanlder = (type : string)=>{
        
        if(likeGame.includes(type)){
            setLikeGame(likeGame.filter(el=>el !== type));
        }else{
            setLikeGame(prev=>[
                ...prev,
                type
            ])
        }

    }

    const onSubmitHandler = async (event : any)=>{

        const {nickname,username,emailAuthNum,password,confirmPW} = event;

        if(!nickname){
            return alert('닉네임을 입력해주세요');
        }

        if(!username){
            return alert('이메일을 입력해주세요');
        }        

        if(!isCheck){
            return alert('이메일 인증이 필요합니다.');
        }

        if(!emailAuthNum){
            return alert('인증번호를 입력해주세요');
        }
        
        if(!password){
            return alert('비밀번호를 입력해주세요');
        }

        if(password !== confirmPW){
            return alert('비밀번호가 서로 다릅니다.');
        }

        if(!isService.isAgreeTermsUse){
            return alert('서비스 이용약관에 동의해주세요.');
        }

        if(!isService.isAgreeCollectingUsingPersonalInformation){
            return alert('개인정보 수집 및 이용에 동의해주세요');
        }

        try {

            const res = await fetch('/back/api/v2/member',{
                method : "POST",
                headers : {
                    "Content-Type": "Application/json"
                },
                body : JSON.stringify({
                    username,
                    nickname,
                    password,
                    favoriteSports : likeGame.join(','),
                    isAgreeTermsUse : isService.isAgreeTermsUse,
                    isAgreeCollectingUsingPersonalInformation : isService.isAgreeCollectingUsingPersonalInformation,
                    isAgreeMarketing : isService.isAgreeMarketing,
                    emailAuthNum
                })
            });

            if(res.ok){
                
                const data = await res.json();

                if(data.status === "success"){
                    alert('회원가입이 완료 되었습니다.');
                    return router.push('/');
                }else{
                    return alert(data.message);
                }

            }else{
                if(res.status === 409){
                    return alert('이미 존재하는 회원입니다.');    
                }
                return alert('서버와 통신이 원할하지 않습니다.');
            }

        }
        catch(err){
            // console.error(err);
            alert('오류가 발생했습니다.');
        }
        

    }

  return (
    <Wrap className=" pt-12 pb-[90px] md:py-[150px]">
        <div className="md:py-14 md:px-32 box-border md:bg-Surface mx-auto">
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <h1 className="text-xl md:text-2xl font-semibold text-center text-primary mb-12">회원가입</h1>
                <div>
                    <p className="font-semibold text-base mb-5 text-primary">정보 입력</p>
                    <div className="flex flex-col gap-4 md:gap-5">
                        <input className="h-11 rounded-lg border border-Outline px-3 text-base font-medium placeholder:text-OnBackgroundGray" type="text" placeholder="닉네임" {...register("nickname")}/>
                        <div className="relative">
                            <input type="text" placeholder="이메일을 입력하세요." {...register("username")} className="w-full h-11 rounded-lg border border-Outline px-3 text-base font-medium placeholder:text-OnBackgroundGray"/>
                            <button type="button" onClick={mailSendHandler} className="absolute right-2 top-1/2 -translate-y-1/2 border border-primary text-[13px] font-normal text-primary bg-OnPrimary py-2 px-3 rounded-md cursor-pointer" >인증요청</button>
                        </div>
                        {
                            isSend &&
                            <div className="relative">
                                <input type="text" placeholder="인증번호를 입력하세요" {...register('emailAuthNum')} className="w-full h-11 rounded-lg border border-Outline px-3 text-base font-medium placeholder:text-OnBackgroundGray" />
                                <button type="button" onClick={mailAuthCheckHanlder} className="absolute right-2 top-1/2 -translate-y-1/2 border border-primary text-[13px] font-normal text-primary bg-OnPrimary py-2 px-3 rounded-md cursor-pointer">확인</button>
                            </div>
                        }
                        <input type="password" placeholder="비밀번호" {...register('password')} className="w-full h-11 rounded-lg border border-Outline px-3 text-base font-medium placeholder:text-OnBackgroundGray"/>
                        <input type="password" placeholder="비밀번호 확인" {...register('confirmPW')} className="w-full h-11 rounded-lg border border-Outline px-3 text-base font-medium placeholder:text-OnBackgroundGray"/>
                    </div>
                </div>

                <div className="mt-[46px] md:mt-[58px]">
                    <p className="font-semibold text-base mb-5 text-primary">관심있는 종목 (중복가능)</p>
                    <div className="flex justify-between gap-2 overflow-x-auto">
                        {
                            GAMETYPE.map((el,index)=>(
                                <button 
                                    key={index}
                                    type="button" 
                                    onClick={()=>gameTypeClickHanlder(el.get)}
                                    className={`size-[77px] flex-none border border-primary rounded-full relative overflow-hidden cursor-pointer ${likeGame.includes(el.get) ? "bg-primary text-white" : "bg-background text-primary"}`}
                                >
                                    <div className="absolute left-0 top-0 right-0 bottom-0 flex items-center justify-center gap-[2px] text-sm font-medium">
                                        <p>{el.name}</p>
                                    </div>
                                </button>
                            ))
                        }
                    </div>
                </div>

                <div className="mt-[46px] md:mt-[58px]">
                    <p>서비스 정책</p>
                    <div className="bg-primary">
                        <div className="py-4 md:py-5 px-5 md:px-6">
                            <div className="flex justify-between gap-1">
                                <div className="flex items-center gap-3 cursor-pointer" onClick={allCheckHandler}>
                                    <div className="size-5 rounded bg-white relative flex-none">
                                        {
                                            // Object.values로 배열로 만든후에 every()로 검사
                                            Object.values(isService).every(value =>value) && <IoCheckmarkOutline className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs"/>
                                        }
                                    </div>
                                    <p className="text-base font-medium text-OnPrimary">전체동의</p>
                                </div>
                            </div>

                            <div className="py-4 md:py-5 px-5 md:px-6">
                                <div className="flex items-center gap-3 cursor-pointer" onClick={()=>isServiceHandler('isAgreeTermsUse',!isService.isAgreeTermsUse)}>
                                    <div className="size-5 rounded bg-white relative flex-none">
                                        {
                                            isService.isAgreeTermsUse && <IoCheckmarkOutline className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs"/>
                                        }
                                    </div>
                                    <p className="text-base font-medium text-OnPrimary">서비스 이용약관 동의 (필수)</p>
                                </div>
                                <div className="flex items-center gap-3 cursor-pointer mt-4" onClick={()=>isServiceHandler('isAgreeCollectingUsingPersonalInformation',!isService.isAgreeCollectingUsingPersonalInformation)}>
                                    <div className="size-5 rounded bg-white relative flex-none">
                                        {
                                            isService.isAgreeCollectingUsingPersonalInformation && <IoCheckmarkOutline className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs"/>
                                        }
                                    </div>
                                    <p className="text-base font-medium text-OnPrimary">개인정보 수집 및 이용 동의 (필수)</p>
                                </div>
                                <div className="flex items-center gap-3 cursor-pointer mt-4" onClick={()=>isServiceHandler('isAgreeMarketing',!isService.isAgreeMarketing)}>
                                    <div className="size-5 rounded bg-white relative flex-none">
                                        {
                                            isService.isAgreeMarketing && <IoCheckmarkOutline className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs"/>
                                        }
                                    </div>
                                    <p className="text-base font-medium text-OnPrimary">마케팅 수신 동의 (선택)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8 md:mt-14">
                    <button type="submit" className="inline-flex items-center text-primary bg-OnPrimary text-sm md:text-base font-medium border border-[#4FAAFF] rounded py-2 px-4 justify-center cursor-pointer">회원가입</button>
                </div>

            </form>
        </div>
    </Wrap>
  )
}