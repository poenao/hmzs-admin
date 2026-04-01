import { TOKEN_KEY } from "@/constants";
import Cookies from "js-cookie";
export const getLocalToken = () => {
  return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || "";
};

export const setLocalToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token);
};

export const removeLocalToken = () => {
  Cookies.remove(TOKEN_KEY);
};
