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

    // Trả về HTML page để xử lý token cho Decap CMS
    // Decap CMS sẽ nhận token và tự động authenticate
    const token = tokenData.access_token;
    const adminUrl = `${url.origin}/admin/`;
    
    // Escape token để tránh XSS
    const escapedToken = token.replace(/'/g, "\\'").replace(/"/g, '\\"');
    
    return new Response(
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authenticating...</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body>
  <script>
    (function() {
      try {
        const token = '${escapedToken}';
        const adminUrl = '${adminUrl}';
        
        // Lưu token vào localStorage với key mà Decap CMS sử dụng
        // Decap CMS sử dụng key 'netlify-cms-user' hoặc 'decap-cms-user'
        const userData = {
          token: token,
          provider: 'github',
          name: 'GitHub User',
          login: 'github-user'
        };
        
        // Thử cả hai key để đảm bảo tương thích
        try {
          localStorage.setItem('netlify-cms-user', JSON.stringify(userData));
        } catch(e) {
          console.warn('Could not save to netlify-cms-user:', e);
        }
        
        try {
          localStorage.setItem('decap-cms-user', JSON.stringify(userData));
        } catch(e) {
          console.warn('Could not save to decap-cms-user:', e);
        }
        
        // Nếu mở trong popup (có window.opener), gửi token qua postMessage
        if (window.opener && !window.opener.closed) {
          try {
            // Gửi token về parent window (Decap CMS)
            window.opener.postMessage({
              type: 'authorization',
              provider: 'github',
              token: token
            }, window.location.origin);
            
            // Đợi một chút rồi đóng popup
            setTimeout(function() {
              window.close();
            }, 100);
            return;
          } catch(e) {
            console.warn('Could not send postMessage:', e);
          }
        }
        
        // Nếu không phải popup hoặc postMessage thất bại, redirect về admin
        // Redirect với token trong hash để Decap CMS có thể đọc
        window.location.href = adminUrl + '#/auth?token=' + encodeURIComponent(token) + '&provider=github';
      } catch(error) {
        console.error('Authentication error:', error);
        document.body.innerHTML = '<p style="color: red;">Lỗi xác thực. Vui lòng thử lại.</p>';
      }
    })();
  </script>
  <p>Đang xác thực... Vui lòng đợi.</p>
  <noscript>
    <p>JavaScript is required for authentication. Please enable JavaScript and try again.</p>
  </noscript>
</body>
</html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
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

