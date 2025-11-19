import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { ENV } from './config.env';
import { oauthLogin, OAuthProfile } from '../services/auth.service';

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const oauthProfile: OAuthProfile = {
          id: profile.id,
          email: profile.emails?.[0]?.value || '',
          name: profile.displayName || profile.name?.givenName || undefined,
          provider: 'google',
        };

        const result = await oauthLogin(oauthProfile);
        return done(null, result.user as Express.User);
      } catch (error: any) {
        return done(error, undefined);
      }
    }
  )
);

// Configure GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: ENV.GITHUB_CLIENT_ID,
      clientSecret: ENV.GITHUB_CLIENT_SECRET,
      callbackURL: ENV.GITHUB_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (error: any, user?: any) => void
    ) => {
      try {
        const oauthProfile: OAuthProfile = {
          id: profile.id.toString(),
          email:
            profile.emails?.[0]?.value || profile.username + '@github.local',
          name: profile.displayName || profile.username || undefined,
          provider: 'github',
        };

        const result = await oauthLogin(oauthProfile);
        return done(null, result.user as Express.User);
      } catch (error: any) {
        return done(error, undefined);
      }
    }
  )
);

export default passport;
