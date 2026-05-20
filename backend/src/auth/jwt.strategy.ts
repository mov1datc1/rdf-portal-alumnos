import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';

const jwksProvider = passportJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
});

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (request: any, rawJwtToken: any, done: any) => {
        jwksProvider(request, rawJwtToken, (err, secret) => {
          if (err || !secret) {
            // Fallback to legacy HS256 string secret
            return done(null, process.env.SUPABASE_JWT_SECRET as string);
          }
          done(null, secret);
        });
      },
      algorithms: ['HS256', 'ES256', 'RS256'],
    });
  }

  async validate(payload: any) {
    // El payload contiene los datos del token JWT de Supabase
    // payload.sub es el ID del usuario
    if (!payload) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, email: payload.email, role: payload.user_metadata?.role };
  }
}
