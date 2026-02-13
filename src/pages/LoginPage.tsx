import { useForm, type SubmitHandler } from 'react-hook-form';
import Logo from '../assets/logo.svg?react';
import User from '../assets/user.svg?react';
import Cross from '../assets/cross.svg?react';
import Lock from '../assets/lock.svg?react';
import Eye from '../assets/eye.svg?react';
import { useState } from 'react';
import { useAuthUserMutation } from '../store/api/authApi';
import { useNavigate } from 'react-router';

interface Inputs {
  login: string;
  password: string;
}

interface DummyError {
  data: {
    message: string;
  };
  status: number
}

const isApiError = (error: unknown): error is DummyError => {
  return typeof error === 'object' && error !== null && 'status' in error && 'data' in error;
}

export const LoginPage = () => {
  const {register, setValue, handleSubmit, formState: {errors}} = useForm<Inputs>({reValidateMode: 'onSubmit'});
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [authUser] = useAuthUserMutation();
  const [inputType, setInputType] = useState<'password' | 'text'>('password');
  const [error, setError] = useState('');
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const userData = await authUser({username: data.login, password: data.password}).unwrap();
      if (userData) {
        if (isChecked) {
          localStorage.setItem('accessToken', userData.accessToken);
        } else {
          sessionStorage.setItem('accessToken', userData.accessToken);
        }
        setError('');
        navigate('/')
      } else {
        setError('Что-то пошло не так')
      }
    } catch (e) {
      if (isApiError(e)) {
        if (e.status === 400) {
          setError('Неправильное имя пользователя или пароль')
        }
      } else {
        setError('Неизвестная ошибка')
      }
    }
  }
  const handleClear = () => {
    setValue('login', '');
  }
  const handleShow = () => {
    if (inputType === 'password') {
      setInputType('text');
    } else {
      setInputType('password');
    }
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
                <Cross className='w-[18px] h-[18px]' />
              </button>
            </div>
            {errors.login && <span className='text-[16px] text-[#d97272]'>Это обязательное поле</span>}
          </label>
          <label className='mt-[16px] flex flex-col gap-[6px] font-inter font-medium text-[18px]/[150%] tracking-[-0.01em] text-[#232323]'>
            Пароль
            <div className='flex items-center justify-center gap-[4px] border-[2px] border-solid border-[#ededed] rounded-[12px] p-[14px_16px] w-[399px] h-[55px] bg-white'>
              <Lock className='w-[24px] h-[24px]' />
              <input type={inputType} {...register("password", {required: true})} className='outline-none w-full' />
              <button onClick={handleShow} type='button' className='w-[24px] h-[24px] flex items-center justify-center p-[2px] cursor-pointer'>
                <Eye className='w-[20px] h-[20px]' />
              </button>
            </div>
            {errors.password && <span className='text-[16px] text-[#d97272]'>Это обязательное поле</span>}
          </label>
          <label className='mt-[20px] font-inter font-medium text-[16px]/[150%] text-[#9c9c9c] flex gap-[10px] items-center w-full'>
            <input type='checkbox' checked={isChecked} onChange={() => setIsChecked(prev => !prev)} className='appearance-none relative w-[20px] h-[20px] border-[2px] border-solid border-[#ededed] rounded-[4px] after:absolute after:bg-[#7076dd] after:bg-check after:bg-no-repeat after:bg-center after:bg-size-[16px_16px] after:top-0 after:left-0 after:w-0 after:h-0 after:rounded-[2px] after:overflow-hidden checked:after:w-[16px] checked:after:h-[16px]' />
            Запомнить данные
          </label>
          <button className='mt-[20px] flex items-center justify-center w-full bg-[#242edb] border-[1px] border-solid border-[#367aff] rounded-[12px] p-[16px_8px] h-[54px] font-inter font-medium text-[18px]/[120%] tracking-[-0.01em] text-[#fff]'>Войти</button>
          {error && <p className='mt-[4px] text-[16px] text-[#d97272] flex items-center justify-center'>{error}</p>}
        </form>
      </div>
    </section>
  )
}