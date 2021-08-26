import { User } from 'interfaces/User'
import log from 'lib/log'
import withSession from 'lib/session'

export default withSession(async (req, res) => {
  const user = req.session.get<User>('user')

  try {
    if (user) {
      // in a real world application you might read the user id from the session and then do a database request
      // to get more information on the user if needed
      res.json({
        ...user,
        isLoggedIn: true,
      })
    } else {
      res.json({
        isLoggedIn: false,
      })
    }
  } catch (error) {
    log('ERROR', error.message, 'api.getCategories')
    res.status(500).send('Generic error: ' + error.message)
  }
})
