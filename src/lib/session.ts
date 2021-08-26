// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import moment from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'
import { Session, withIronSession } from 'next-iron-session'

// optionally add stronger typing for next-specific implementation
export type NextIronRequest = NextApiRequest & { session: Session }
export type NextIronHandler = (req: NextIronRequest, res: NextApiResponse) => void | Promise<void>

const withSession = (handler: NextIronHandler) =>
  withIronSession(handler, {
    cookieName: process.env.SECRET_COOKIE_NAME ?? '',
    cookieOptions: {
      expires: moment()
        .add(+(process.env.SECRET_COOKIE_EXPIRES_DAYS ?? '30'), 'days')
        .toDate(),
      secure: process.env.NODE_ENV === 'production',
    },
    password: process.env.SECRET_COOKIE_PASSWORD ?? '',
  })

export default withSession
