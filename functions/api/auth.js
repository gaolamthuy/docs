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

    // Kiểm tra environment variables
    if (!clientId || !clientSecret) {
      console.error('Missing GitHub OAuth credentials');
      return new Response(
        JSON.stringify({ 
          error: 'GitHub OAuth credentials are not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Cloudflare Pages environment variables.' 
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Exchanging code for token...', { code: code.substring(0, 10) + '...', redirectUri });

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'GaoLamThuy-Assets-CMS',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    // Kiểm tra response status
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('GitHub token exchange failed:', tokenResponse.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: `GitHub authentication failed: ${tokenResponse.status} ${tokenResponse.statusText}`,
          details: errorText
        }),
        {
          status: tokenResponse.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('GitHub returned error:', tokenData);
      return new Response(
        JSON.stringify({ 
          error: tokenData.error_description || tokenData.error,
          error_code: tokenData.error
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!tokenData.access_token) {
      console.error('No access token in response:', tokenData);
      return new Response(
        JSON.stringify({ error: 'No access token received from GitHub' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Token exchange successful');

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
        // Decap CMS mong đợi format: authorization:github:success:JSON_STRING
        if (window.opener && !window.opener.closed) {
          try {
            // Format message theo đúng format Decap CMS mong đợi
            const authContent = {
              token: token,
              provider: 'github'
            };
            const authContentStr = JSON.stringify(authContent);
            const message = 'authorization:github:success:' + authContentStr;
            
            // Gửi token về parent window (Decap CMS)
            window.opener.postMessage(message, window.location.origin);
            
            console.log('Token sent to parent window');
            
            // Đợi một chút rồi đóng popup
            setTimeout(function() {
              window.close();
            }, 200);
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
      JSON.stringify({ 
        error: 'Failed to authenticate with GitHub',
        message: error.message,
        stack: error.stack
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

