import { useForm, type SubmitHandler } from 'react-hook-form';
import Logo from '../assets/logo.svg?react';
import User from '../assets/user.svg?react';
import Cross from '../assets/cross.svg?react';

interface Inputs {
  login: string;
  password: string;
}

export const LoginPage = () => {
  const {register, setValue, handleSubmit, formState: {errors}} = useForm<Inputs>({reValidateMode: 'onSubmit'});
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  const handleClear = () => {
    setValue('login', '');
  }
  return (
    <section className="w-[527px] h-[716px] p-[6px] rounded-[40px] bg-white shadow-[0_24px_32px_0_rgba(0,0,0,0.04)] mx-auto mt-[92px]">
      <div className="w-[515px] h-[704px] p-[48px] rounded-[34px] bg-[linear-gradient(180deg,rgba(35,35,35,0.03)_0%,rgba(35,35,35,0)_50%)]">
        <div className='mx-auto rounded-[100px] w-[52px] h-[52px] shadow-[0_12px_8px_0_rgba(0,0,0,0.03),0_0_0_2px_#fff] bg-[linear-gradient(360deg,rgba(35,35,35,0)_50%,rgba(35,35,35,0.06)_100%)] flex items-center justify-center'>
          <Logo className='w-[35px] h-[34px]' />
        </div>
        <h2 className='mt-[32px] font-inter font-semibold text-[40px]/[110%] tracking-[-0.01em] text-center text-[#232323]'>Добро пожаловать!</h2>
        <p className='mt-[12px] font-inter font-medium text-[18px]/[150%] text-center text-[#bcbcbc]'>Пожалуйста, авторизуйтесь</p>
        <form onSubmit={handleSubmit(onSubmit)} className='mx-auto mt-[32px] w-[399px] h-[350px]'>
          <label className='flex flex-col gap-[6px] font-inter font-medium text-[18px]/[150%] tracking-[-0.01em] text-[#232323]'>
            Логин
            <div className='flex items-center justify-center gap-[4px] border-[2px] border-solid border-[#ededed] rounded-[12px] p-[14px_16px] w-[399px] h-[55px] bg-white'>
              <User className='w-[24px] h-[24px]' />
              <input type='text' {...register("login", {required: true})} className='outline-none w-full' />
              <button onClick={handleClear} type='button' className='w-[24px] h-[24px] flex items-center justify-center p-[2px] cursor-pointer'>
                <Cross className='w-[17px] h-[18px]' />
              </button>
            </div>
            {errors.login && <span className='text-[16px] text-[#d97272]'>Это обязательное поле</span>}
          </label>
        </form>
      </div>
    </section>
  )
}