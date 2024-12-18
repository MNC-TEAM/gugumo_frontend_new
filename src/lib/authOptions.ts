import baseIntance from '@/lib/baseInstnace';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import KakaoProvider from 'next-auth/providers/kakao';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { type: 'text', placeholder: '이메일을 입력해주세요.' },
        password: { type: 'password', placeholder: '비밀번호를 입력해주세요.' },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials) return null;

        try {
          const response = await baseIntance(
            `${process.env.API_URL}/api/v1/emailLogin`,
            {
              method: 'POST',
              body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
              }),
            },
          );

          if (response.ok) {
            const data = await response.json();

            if (data.status === 'success') {
              return { token: data.data };
            }
            return null;
          }
          return null;
        } catch (err) {
          return null;
        }
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_RESTAPI || '',
      clientSecret: process.env.KAKAO_CLIENT || '',
    }),
  ],
  jwt: {
    maxAge: 60 * 60,
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ user, token, account }: any): Promise<any> {
      const currentToken = token;

      if (account?.type !== 'credentials' && user) {
        const response = await fetch(`${process.env.API_URL}/kakao/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'Application/json',
          },
          body: JSON.stringify({
            username: user.email,
            nickname: user.name,
            kakaoId: user.id,
            profilePath: user.image,
          }),
        });

        const data = await response.json();

        if (data.status === 'fail') {
          currentToken.username = user.email;
          currentToken.nickname = user.name;
          currentToken.kakaoId = user.id;
        } else if (data.status === 'success') {
          currentToken.accessToken = data.data;
        }
      }

      if (account?.type === 'credentials' && user) {
        currentToken.accessToken = user.token;
      }

      if (account) {
        currentToken.type = account.type;
      }

      return currentToken;
    },
    async session({ token }: any): Promise<any> {
      const session = {} as any;

      if (token.accessToken) {
        session.accessToken = token.accessToken;
      } else {
        session.username = token.username;
        session.nickname = token.nickname;
        session.kakaoId = token.kakaoId;
      }

      session.type = token.type;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    error: '/',
  },
};

export default authOptions;
