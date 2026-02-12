import { Navigate, Outlet } from "react-router";
import { useTypedSelector } from "../store/hooks/redux";

export const ProtectedPage = () => {
  const { isAuthed } = useTypedSelector((s) => s.auth);
  return isAuthed ? <Outlet /> : <Navigate to="/auth" />;
};
