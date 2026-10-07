import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { env } from './env'
import { prisma } from '../lib/prisma'
import type { JwtPayload } from '../lib/jwt'

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_SECRET,
    },
    async (payload: JwtPayload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.sub },
          select: { id: true, email: true, role: true },
        })
        if (!user) return done(null, false)
        done(null, { sub: user.id, email: user.email, role: user.role, storeId: payload.storeId })
      } catch (err) {
        done(err, false)
      }
    },
  ),
)

export { passport }
