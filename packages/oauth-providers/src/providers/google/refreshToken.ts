import { HTTPException } from 'hono/http-exception'
import type { GoogleErrorResponse, GoogleTokenResponse } from './types'
import type { Token } from '../../types'

export async function refreshToken(
  client_id: string,
  client_secret: string,
  refresh_token: string
): Promise<Token> {
  const response = (await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      clientId: client_id,
      clientSecret: client_secret,
      refresh_token: refresh_token,
      grant_type: 'refresh_token',
    }),
  }).then((res) => res.json())) as GoogleTokenResponse | GoogleErrorResponse

  if ('error' in response) {
    throw new HTTPException(400, { message: response.error_description })
  }

  return tokenResponseToToken(response as GoogleTokenResponse)
}

function tokenResponseToToken(response: GoogleTokenResponse): Token {
  return {
    token: response.access_token,
    expires_in: response.expires_in,
    expires_at: new Date(Date.now() + response.expires_in * 1000),
  }
}