# Changes from upstream

> [!NOTE]  
> This repository is a fork of `github.com/honojs/middleware`

## OAuth Providers Middleware

### Types

An optional `expires_at` property has been added to the `Token` type.
It is up to the provider's `authFlow` to set this value.

```
{
  token: string
  expires_in: number
  expires_at?: Date
}
```


### Google

The Google OAuth flow has been updated to include the `refresh-token`, when available. The `refreshToken` method has also been implemented.

The `expires_at` property is set for all tokens.

#### Authentication Flow

After the completion of the Google OAuth flow, essential data has been prepared for use in the subsequent steps that your app needs to take.

`googleAuth` method provides ~~3~~ **4** set key data:

- `refresh-token`:
    - You can refresh new tokens using this token, which is only available on the initial authorization.
    - Type:
      ```
      {
        token: string
        expires_in: number
      }
      ```

To access this data, utilize the `c.get` method within the callback of the HTTP request handler.

```ts
app.get('/google', (c) => {
  const token = c.get('token')
  const refreshToken = c.get('refresh-token')
  const grantedScopes = c.get('granted-scopes')
  const user = c.get('user-google')

  return c.json({
    token,
    refreshToken,
    grantedScopes,
    user,
  })
})
```

#### Refresh Token

Once the user token expires you can refresh their token without the need to prompt the user again for access. In such a scenario, you can utilize the `refreshToken` method, which accepts the `client_id`, `client_secret` and `refresh_token` as parameters.

> [!NOTE]  
> A `refresh_token` [may expire or otherwise fail](https://developers.google.com/identity/protocols/oauth2#expiration). Your code should anticipate the possibility that a granted refresh token might no longer work.

```ts
import { googleAuth, refreshToken } from '@hono/oauth-providers/google'

app.post('/google/refresh', async (c, next) => {
  try {
    await refreshToken(CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)
  } catch (err) {
    // ...
  }

  // ...
})
```
