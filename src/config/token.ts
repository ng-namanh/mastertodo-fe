import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';
import Cookies from 'js-cookie';


export const tokenUtils = {
  getAccessToken: () => Cookies.get(ACCESS_TOKEN),
  getRefreshToken: () => Cookies.get(REFRESH_TOKEN),
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => {
    Cookies.set(ACCESS_TOKEN, tokens.accessToken)
    Cookies.set(REFRESH_TOKEN, tokens.refreshToken)
  },
  removeTokens: () => {
    Cookies.remove(ACCESS_TOKEN)
    Cookies.remove(REFRESH_TOKEN)
  },
  hasTokens: () => {
    const accessToken = Cookies.get(ACCESS_TOKEN)
    const refreshToken = Cookies.get(REFRESH_TOKEN)
    return !!accessToken && !!refreshToken
  },
}

