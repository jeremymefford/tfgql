import type { FastifyInstance } from "fastify";
import { applicationConfiguration } from "../common/conf";

/**
 * Registers a GET /voyager route that serves a self-contained GraphQL Voyager
 * schema visualizer page. Shares the same sessionStorage-based auth as GraphiQL.
 */
export function registerVoyagerRoute(
  fastify: FastifyInstance<any, any, any, any, any>,
): void {
  const tokenManagementUrl = `${applicationConfiguration.tfeBaseUrl.replace(
    /\/api\/v2\/?$/,
    "",
  )}/app/settings/tokens?source=terraform-login`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; worker-src 'self' blob:" />
  <title>tfgql — Schema Visualizer</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="stylesheet" href="/voyager-assets/voyager.css" />
  <style>
    body { margin: 0; height: 100vh; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; }

    /* Nav bar */
    #nav-bar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 9998;
      display: flex; align-items: center; gap: 12px;
      padding: 6px 14px; font-size: 13px;
      background: #1e1e1e; color: #ccc;
      border-bottom: 1px solid #333;
      height: 32px; box-sizing: border-box;
    }
    #nav-bar a {
      color: #e535ab; text-decoration: none; font-weight: 500; font-size: 13px;
    }
    #nav-bar a:hover { text-decoration: underline; }
    #nav-bar .nav-title { font-weight: 600; color: #eee; }
    #nav-bar .nav-sep { color: #555; }
    #nav-bar .nav-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
    #nav-bar button {
      background: none; border: 1px solid #555; border-radius: 3px;
      padding: 2px 8px; font-size: 11px; cursor: pointer; color: #ccc;
    }
    #nav-bar button:hover { background: #333; }

    /* Voyager container */
    #voyager { height: calc(100vh - 32px); margin-top: 32px; }

    /* Auth overlay (same as GraphiQL) */
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

    /* Loading state */
    #loading {
      display: flex; align-items: center; justify-content: center;
      height: calc(100vh - 32px); margin-top: 32px; color: #888; font-size: 15px;
    }
    #loading.hidden { display: none; }
  </style>
</head>
<body>
  <!-- Nav bar -->
  <div id="nav-bar">
    <a href="/">← GraphiQL</a>
    <span class="nav-sep">|</span>
    <span class="nav-title">Schema Visualizer</span>
    <div class="nav-right">
      <span id="token-status"></span>
      <button id="token-logout" style="display:none">Logout</button>
    </div>
  </div>

  <!-- Auth overlay -->
  <div id="auth-overlay">
    <div id="auth-box">
      <h2>Authenticate to tfgql</h2>
      <p>Enter your Terraform Cloud / Enterprise API token to get started.</p>
      <p>
        Don't have one yet?
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

  <!-- Loading indicator (shown while fetching introspection) -->
  <div id="loading">Loading schema…</div>

  <!-- Voyager container (hidden until introspection loads) -->
  <div id="voyager" style="display:none"></div>

  <script src="/voyager-assets/voyager.standalone.js"></script>
  <script>
  (function() {
    var ENCRYPTED_JWT_STORAGE_KEY = 'tfgql_encrypted_jwt';
    var EXPIRY_KEY = 'tfgql_jwt_expires';

    var overlay = document.getElementById('auth-overlay');
    var loadingDiv = document.getElementById('loading');
    var voyagerDiv = document.getElementById('voyager');
    var tokenStatus = document.getElementById('token-status');
    var logoutBtn = document.getElementById('token-logout');
    var errorDiv = document.getElementById('auth-error');
    var submitBtn = document.getElementById('auth-submit');
    var tokenInput = document.getElementById('tfc-token');

    function getStoredToken() {
      var token = sessionStorage.getItem(ENCRYPTED_JWT_STORAGE_KEY);
      var expires = sessionStorage.getItem(EXPIRY_KEY);
      if (!token || !expires) return null;
      var expiresAtMs = Date.parse(expires);
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
      return { token: token, expiresAt: new Date(expiresAtMs).toISOString() };
    }

    function clearToken() {
      sessionStorage.removeItem(ENCRYPTED_JWT_STORAGE_KEY);
      sessionStorage.removeItem(EXPIRY_KEY);
      overlay.classList.remove('hidden');
      logoutBtn.style.display = 'none';
      tokenStatus.textContent = '';
      voyagerDiv.style.display = 'none';
      loadingDiv.classList.remove('hidden');
      tokenInput.value = '';
      errorDiv.style.display = 'none';
      tokenInput.focus();
    }

    function showAuthenticated(expiresAt) {
      overlay.classList.add('hidden');
      logoutBtn.style.display = '';
      var exp = new Date(expiresAt);
      if (Number.isNaN(exp.getTime())) {
        tokenStatus.textContent = 'Authenticated';
      } else {
        tokenStatus.textContent = 'Authenticated · expires ' + exp.toLocaleString();
      }
    }

    function fetchIntrospectionAndRender(jwt) {
      var query = GraphQLVoyager.voyagerIntrospectionQuery;
      var introspectionPromise = fetch(window.location.origin + '/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + jwt,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      }).then(function(res) {
        if (res.status === 401) {
          clearToken();
          throw new Error('Token expired — please re-authenticate.');
        }
        return res.json();
      }).then(function(json) {
        loadingDiv.classList.add('hidden');
        voyagerDiv.style.display = '';
        return json;
      });

      GraphQLVoyager.renderVoyager(voyagerDiv, {
        introspection: introspectionPromise,
        displayOptions: {
          skipRelay: true,
          skipDeprecated: true,
          showLeafFields: true,
          sortByAlphabet: false,
        },
        hideDocs: false,
        hideSettings: false,
      });
    }

    async function authenticate() {
      var tfcToken = tokenInput.value.trim();
      if (!tfcToken) { tokenInput.focus(); return; }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Authenticating...';
      errorDiv.style.display = 'none';

      try {
        var res = await fetch(window.location.origin + '/auth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tfcToken: tfcToken }),
        });
        var data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Authentication failed (' + res.status + ')');
        }
        sessionStorage.setItem(ENCRYPTED_JWT_STORAGE_KEY, data.token);
        var expiresAt = data.expiresAt || null;
        sessionStorage.setItem(EXPIRY_KEY, expiresAt);
        showAuthenticated(expiresAt);
        fetchIntrospectionAndRender(data.token);
      } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Authenticate';
      }
    }

    // Event listeners
    submitBtn.addEventListener('click', authenticate);
    tokenInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') authenticate();
    });
    logoutBtn.addEventListener('click', clearToken);

    // Boot: check for existing token
    var existing = getStoredToken();
    if (existing) {
      showAuthenticated(existing.expiresAt);
      fetchIntrospectionAndRender(existing.token);
    } else {
      loadingDiv.classList.add('hidden');
      tokenInput.focus();
    }
  })();
  </script>
</body>
</html>`;

  fastify.get("/voyager", async (_request, reply) => {
    reply.type("text/html").send(html);
  });
}
