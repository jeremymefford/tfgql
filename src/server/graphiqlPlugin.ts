import type { ApolloServerPlugin } from "@apollo/server";
import type { Context } from "./context";
import { applicationConfiguration } from "../common/conf";
/**
 * Apollo Server plugin that serves a self-contained GraphiQL IDE as the
 * landing page with built-in auth. All assets load from this server — no
 * external preflight domains, no Apollo Studio dependency. Works in Chrome with PNA
 * restrictions.
 *
 * Auth flow: prompts for TFC token, exchanges it via POST /auth/token,
 * stores the JWT in sessionStorage, and injects it into every request.
 */
export function graphiqlLandingPagePlugin(): ApolloServerPlugin<Context> {
  return {
    async serverWillStart() {
      return {
        async renderLandingPage() {
          const tokenManagementUrl = `${applicationConfiguration.tfeBaseUrl.replace(
            /\/api\/v2\/?$/,
            "",
          )}/app/settings/tokens?source=terraform-login`;
          const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'" />
  <title>tfgql — GraphiQL</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="stylesheet" href="/graphiql-assets/graphiql.min.css" />
  <style>
    body { margin: 0; height: 100vh; font-family: system-ui, -apple-system, sans-serif; }
    #graphiql { height: 100vh; }

    /* Auth overlay */
    #auth-overlay {
      position: fixed; inset: 0; z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0, 0, 0, 0.5);
    }
    #auth-overlay.hidden { display: none; }
    #auth-box {
      background: #fff; border-radius: 8px; padding: 24px 28px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.2);
      width: 420px; max-width: 90vw;
    }
    #auth-box h2 { margin: 0 0 4px; font-size: 18px; color: #171717; }
    #auth-box p { margin: 0 0 16px; font-size: 13px; color: #666; }
    #auth-box label { display: block; font-size: 13px; font-weight: 500; color: #333; margin-bottom: 6px; }
    #auth-box input {
      width: 100%; padding: 8px 10px; font-size: 14px; font-family: monospace;
      border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;
    }
    #auth-box input:focus { outline: none; border-color: #e535ab; box-shadow: 0 0 0 2px rgba(229,53,171,0.15); }
    #auth-box button {
      margin-top: 14px; width: 100%; padding: 9px; font-size: 14px; font-weight: 600;
      background: #e535ab; color: #fff; border: none; border-radius: 4px; cursor: pointer;
    }
    #auth-box button:hover { background: #d42d9d; }
    #auth-box button:disabled { opacity: 0.6; cursor: not-allowed; }
    #auth-error { color: #d32f2f; font-size: 13px; margin-top: 10px; display: none; }

    /* Token status bar */
    #token-bar {
      position: fixed; top: 0; right: 0; z-index: 9998;
      display: flex; align-items: center; gap: 8px;
      padding: 5px 12px; font-size: 12px; color: #666;
      background: #f5f5f5; border-bottom-left-radius: 6px;
      border: 1px solid #e0e0e0; border-top: none; border-right: none;
      bottom: 0;
      top: auto;
      border-top-left-radius: 6px;
      border-bottom-left-radius: 0;
    }
    #token-bar.hidden { display: none; }
    #token-bar button {
      background: none; border: 1px solid #ccc; border-radius: 3px;
      padding: 2px 8px; font-size: 11px; cursor: pointer; color: #666;
    }
    #token-bar button:hover { background: #eee; }
  </style>
</head>
<body>
  <!-- Auth overlay -->
  <div id="auth-overlay">
    <div id="auth-box">
      <h2>Authenticate to tfgql</h2>
      <p>Enter your Terraform Cloud / Enterprise API token to get started.</p>
      <p>
        Don’t have one yet?
        <a href="${tokenManagementUrl}" target="_blank" rel="noopener noreferrer">
          Open token page in Terraform
        </a>
      </p>
      <label for="tfc-token">TFC API Token</label>
      <input id="tfc-token" type="password" placeholder="Paste your token here" autocomplete="off" />
      <div id="auth-error"></div>
      <button id="auth-submit">Authenticate</button>
    </div>
  </div>

  <!-- Token status bar (shown after auth) -->
  <div id="token-bar" class="hidden">
    <span id="token-status"></span>
    <button id="token-logout">Logout</button>
  </div>

  <div id="graphiql"></div>

  <script src="/graphiql-assets/react.production.min.js"></script>
  <script src="/graphiql-assets/react-dom.production.min.js"></script>
  <script src="/graphiql-assets/graphiql.min.js"></script>
  <script>
  (function() {
    const ENCRYPTED_JWT_STORAGE_KEY = 'tfgql_encrypted_jwt';
    const EXPIRY_KEY = 'tfgql_jwt_expires';
    const defaultQuery =
      "# Basic Terraform Cloud/Enterprise explorer query\\n" +
      "query {\\n" +
      "  workspaces {\\n" +
      "    id\\n" +
      "    name\\n" +
      "    executionMode\\n" +
      "    organization {\\n" +
      "      name\\n" +
      "    }\\n" +
      "  }\\n" +
      "}\\n";
    const overlay = document.getElementById('auth-overlay');
    const tokenBar = document.getElementById('token-bar');
    const tokenStatus = document.getElementById('token-status');
    const errorDiv = document.getElementById('auth-error');
    const submitBtn = document.getElementById('auth-submit');
    const tokenInput = document.getElementById('tfc-token');

    function getStoredToken() {
      const token = sessionStorage.getItem(ENCRYPTED_JWT_STORAGE_KEY);
      const expires = sessionStorage.getItem(EXPIRY_KEY);
      if (!token || !expires) return null;

      const expiresAtMs = Date.parse(expires);
      if (Number.isNaN(expiresAtMs)) {
        sessionStorage.removeItem(ENCRYPTED_JWT_STORAGE_KEY);
        sessionStorage.removeItem(EXPIRY_KEY);
        return null;
      }

      if (new Date(expiresAtMs) <= new Date()) {
        sessionStorage.removeItem(ENCRYPTED_JWT_STORAGE_KEY);
        sessionStorage.removeItem(EXPIRY_KEY);
        return null;
      }
      return { token, expiresAt: new Date(expiresAtMs).toISOString() };
    }

    function clearToken() {
      sessionStorage.removeItem(ENCRYPTED_JWT_STORAGE_KEY);
      sessionStorage.removeItem(EXPIRY_KEY);
      overlay.classList.remove('hidden');
      tokenBar.classList.add('hidden');
      tokenInput.value = '';
      errorDiv.style.display = 'none';
      tokenInput.focus();
    }

    function showAuthenticated(expiresAt) {
      overlay.classList.add('hidden');
      tokenBar.classList.remove('hidden');
      const exp = new Date(expiresAt);
      if (Number.isNaN(exp.getTime())) {
        tokenStatus.textContent = 'Authenticated · expiry unknown';
        return;
      }

      const expiresAtText = exp.toLocaleString();
      const remainingText = formatRemaining(exp.getTime() - Date.now());
      tokenStatus.textContent =
        'Authenticated · expires ' +
        expiresAtText +
        (remainingText ? ' (' + remainingText + ' remaining)' : '');
    }

    function formatRemaining(remainingMs) {
      if (remainingMs <= 0) return 'expired';
      const dayMs = 24 * 60 * 60 * 1000;
      const hourMs = 60 * 60 * 1000;
      const minuteMs = 60 * 1000;

      const days = Math.floor(remainingMs / dayMs);
      const hours = Math.floor((remainingMs % dayMs) / hourMs);
      const minutes = Math.floor((remainingMs % hourMs) / minuteMs);

      const parts = [];
      if (days > 0) parts.push(days + ' day' + (days === 1 ? '' : 's'));
      if (hours > 0)
        parts.push(hours + ' hour' + (hours === 1 ? '' : 's'));
      if (minutes > 0 && days === 0) {
        parts.push(minutes + ' minute' + (minutes === 1 ? '' : 's'));
      }

      if (parts.length === 0) return 'less than a minute';

      const display = parts.slice(0, 2).join(', ');
      return 'in ' + display;
    }

    async function authenticate() {
      const tfcToken = tokenInput.value.trim();
      if (!tfcToken) { tokenInput.focus(); return; }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Authenticating...';
      errorDiv.style.display = 'none';

      try {
        const res = await fetch(window.location.origin + '/auth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tfcToken }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Authentication failed (' + res.status + ')');
        }
        sessionStorage.setItem(ENCRYPTED_JWT_STORAGE_KEY, data.token);
        const expiresAt = data.expiresAt ?? null;
        sessionStorage.setItem(EXPIRY_KEY, expiresAt);
        showAuthenticated(expiresAt);
      } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Authenticate';
      }
    }

    // Custom fetcher that injects the JWT
    function authFetcher(graphQLParams, opts) {
      const stored = getStoredToken();
      if (!stored) {
        clearToken();
        return Promise.reject(new Error('Not authenticated — please log in.'));
      }
      const headers = Object.assign({}, opts && opts.headers, {
        'Authorization': 'Bearer ' + stored.token,
        'Content-Type': 'application/json',
      });
      return fetch(window.location.origin + '/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(graphQLParams),
      }).then(function(res) {
        if (res.status === 401) {
          clearToken();
          return Promise.reject(new Error('Token expired — please re-authenticate.'));
        }
        return res.json();
      });
    }

    // Event listeners
    submitBtn.addEventListener('click', authenticate);
    tokenInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') authenticate();
    });
    document.getElementById('token-logout').addEventListener('click', clearToken);

    // Boot: check for existing token
    const existing = getStoredToken();
    if (existing) {
      showAuthenticated(existing.expiresAt);
    } else {
      tokenInput.focus();
    }

    // Render GraphiQL
    const root = ReactDOM.createRoot(document.getElementById('graphiql'));
    root.render(
      React.createElement(GraphiQL, {
        defaultQuery: defaultQuery,
        fetcher: authFetcher,
        defaultEditorToolsVisibility: true,
      }),
    );
  })();
  </script>
</body>
</html>`;
          return { html };
        },
      };
    },
  };
}
