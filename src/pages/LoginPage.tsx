import { useForm, type SubmitHandler } from 'react-hook-form';
import Logo from '../assets/logo.svg?react';

interface Inputs {
  login: string;
  password: string;
}

export const LoginPage = () => {
  const {register, handleSubmit, formState: {errors}} = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  return (
    <section className="w-[527px] h-[716px] p-[6px] rounded-[40px] bg-white shadow-[0_24px_32px_0_rgba(0,0,0,0.04)] mx-auto mt-[92px]">
      <div className="w-[515px] h-[704px] p-[48px] rounded-[34px] bg-[linear-gradient(180deg,rgba(35,35,35,0.03)_0%,rgba(35,35,35,0)_50%)]">
        <button className='mx-auto rounded-[100px] w-[52px] h-[52px] shadow-[0_12px_8px_0_rgba(0,0,0,0.03),0_0_0_2px_#fff] bg-[linear-gradient(360deg,rgba(35,35,35,0)_50%,rgba(35,35,35,0.06)_100%)] flex items-center justify-center'>
          <Logo className='w-[35px] h-[34px]' />
        </button>
        <h2 className='mt-[32px] font-inter font-semibold text-[40px]/[110%] tracking-[-0.01em] text-center text-[#232323]'>Добро пожаловать!</h2>
        <p className='mt-[12px] font-inter font-medium text-[18px]/[150%] text-center text-[#bcbcbc]'>Пожалуйста, авторизуйтесь</p>
        <form onSubmit={handleSubmit(onSubmit)} className='mx-auto mt-[32px] w-[399px] h-[350px]'>
          <label className='flex flex-col gap-[6px] font-inter font-medium text-[18px]/[150%] tracking-[-0.01em] text-[#232323]'>
            Логин
            <input type='text' {...register("login", {required: true})} className='outline-none border-[2px] border-solid border-[#ededed] focus:border-[#7177dd] focus-visible:border-[#7177dd] rounded-[12px] p-[14px_16px] w-[399px] h-[55px] bg-white' />
            {errors.login && <span className='text-[16px] text-[#d97272]'>Это обязательное поле</span>}
          </label>
        </form>
      </div>
    </section>
  )
}