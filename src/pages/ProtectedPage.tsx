import { Navigate, Outlet } from "react-router";
import { useTypedDispatch, useTypedSelector } from "../store/hooks/redux";
import { setAuth } from "../store/slices/authSlice";

export const ProtectedPage = () => {
  const dispatch = useTypedDispatch();
  const { isAuthed } = useTypedSelector((s) => s.auth);
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  if (token) {
    dispatch(setAuth(true));
  }
  return isAuthed ? <Outlet /> : <Navigate to="/auth" />;
};
