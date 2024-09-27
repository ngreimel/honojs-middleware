import { HTTPException } from 'hono/http-exception'
import type { GoogleErrorResponse, GoogleTokenResponse } from './types'

export async function refreshToken(
  client_id: string,
  client_secret: string,
  refresh_token: string,
): Promise<GoogleTokenResponse & { created: number }> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'cache-control': 'no-store',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      client_id: client_id,
      client_secret: client_secret,
      refresh_token: refresh_token,
      grant_type: 'refresh_token',
    }),
  })
  const response = await res.json() as GoogleTokenResponse | GoogleErrorResponse

  if ('error' in response) {
    throw new HTTPException(res.status, { message: response.error_description })
  }

  return {
    ...response as GoogleTokenResponse,
    ...{ created: Date.now() },
  }
}