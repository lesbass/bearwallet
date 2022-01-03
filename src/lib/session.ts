import { IronSessionOptions} from 'iron-session'
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'
import moment from 'moment'
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from 'next'

import { User } from '../interfaces/User'

export const sessionOptions: IronSessionOptions = {
  cookieName: process.env.SECRET_COOKIE_NAME ?? '',
  cookieOptions: {
    expires: moment()
      .add(+(process.env.SECRET_COOKIE_EXPIRES_DAYS ?? '30'), 'days')
      .toDate(),
    secure: process.env.NODE_ENV === 'production',
  },
  password: process.env.SECRET_COOKIE_PASSWORD ?? '',
}

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions)
}

// Theses types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
  handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(handler, sessionOptions)
}

declare module 'iron-session' {
  interface IronSessionData {
    user?: User
  }
}
