import { useDispatch } from "react-redux";

export const useDispatchWrapper = () => {
  return useDispatch<any>();
};
