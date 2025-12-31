/**
 * Cloudflare Pages Function để xử lý GitHub OAuth cho Decap CMS
 * 
 * Function này xử lý OAuth flow:
 * 1. Nhận authorization code từ GitHub
 * 2. Exchange code để lấy access token
 * 3. Trả về token cho Decap CMS
 * 
 * @param {Request} request - HTTP request từ Decap CMS
 * @returns {Response} - Response với token hoặc redirect
 */
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Lấy query parameters
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  // Nếu không có code, redirect đến GitHub OAuth
  if (!code) {
    const clientId = env.GITHUB_CLIENT_ID;
    const redirectUri = `${url.origin}/api/auth`;
    const scope = 'repo';
    const stateParam = state || Math.random().toString(36).substring(7);

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${stateParam}`;

    return Response.redirect(authUrl, 302);
  }

  // Exchange code để lấy access token
  try {
    const clientId = env.GITHUB_CLIENT_ID;
    const clientSecret = env.GITHUB_CLIENT_SECRET;
    const redirectUri = `${url.origin}/api/auth`;

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return new Response(
        JSON.stringify({ error: tokenData.error_description || tokenData.error }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Trả về token cho Decap CMS
    // Decap CMS sẽ tự động lưu token và sử dụng để authenticate
    return new Response(
      JSON.stringify({
        token: tokenData.access_token,
        provider: 'github',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('OAuth error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to authenticate with GitHub' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

