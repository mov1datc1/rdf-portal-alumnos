import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SUPABASE_JWT_SECRET,
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
