
(() => {
  "use strict";

  const supabase = window.clientNestSupabase;

  if (!supabase) {
    console.error("Supabase is not initialized. Check script order.");
    return;
  }

  const style = document.createElement("style");
  style.textContent = `
    #cn-auth-screen {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: #f4f6fb;
      font-family: Arial, sans-serif;
    }
    #cn-auth-card {
      width: 100%;
      max-width: 410px;
      padding: 30px;
      background: white;
      border-radius: 18px;
      box-shadow: 0 12px 40px #17255418;
      box-sizing: border-box;
    }
    #cn-auth-card h1 { margin: 0 0 8px; color: #172554; }
    #cn-auth-card p { color: #64748b; line-height: 1.5; }
    #cn-auth-card label { display: block; margin-top: 16px; color: #334155; }
    #cn-auth-card input {
      display: block;
      width: 100%;
      box-sizing: border-box;
      margin-top: 7px;
      padding: 12px;
      border: 1px solid #cbd5e1;
      border-radius: 9px;
      font-size: 16px;
    }
    #cn-auth-card button {
      width: 100%;
      margin-top: 18px;
      padding: 12px;
      border: 0;
      border-radius: 9px;
      background: #4f46e5;
      color: white;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }
    #cn-auth-card button:disabled { opacity: .6; }
    #cn-auth-switch {
      background: #eef2ff !important;
      color: #4338ca !important;
    }
    #cn-auth-message { overflow-wrap: anywhere; }
    #cn-logout {
      position: fixed;
      right: 12px;
      bottom: 12px;
      z-index: 99998;
      width: auto;
      padding: 10px 14px;
      border: 0;
      border-radius: 9px;
      background: #172554;
      color: white;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  const screen = document.createElement("div");
  screen.id = "cn-auth-screen";
  screen.innerHTML = `
    <section id="cn-auth-card">
      <h1>ClientNest</h1>
      <p id="cn-auth-subtitle">Sign in to your workspace</p>

      <form id="cn-auth-form">
        <label for="cn-email">Email address</label>
        <input id="cn-email" type="email"
          autocomplete="email" required />

        <label for="cn-password">Password</label>
        <input id="cn-password" type="password"
          autocomplete="current-password" minlength="6" required />

        <button id="cn-auth-submit" type="submit">Sign in</button>
      </form>

      <button id="cn-auth-switch" type="button">
        Create a new account
      </button>

      <p id="cn-auth-message" role="status"></p>
    </section>
  `;
  document.body.appendChild(screen);

  const form = document.getElementById("cn-auth-form");
  const email = document.getElementById("cn-email");
  const password = document.getElementById("cn-password");
  const submit = document.getElementById("cn-auth-submit");
  const switchButton = document.getElementById("cn-auth-switch");
  const subtitle = document.getElementById("cn-auth-subtitle");
  const message = document.getElementById("cn-auth-message");

  let isSignup = false;
  let busy = false;
  let logoutButton = null;

  function showMessage(text) {
    message.textContent = text;
  }

  function setBusy(value) {
    busy = value;
    submit.disabled = value;
    switchButton.disabled = value;
    submit.textContent = value
      ? "Please wait..."
      : isSignup ? "Create account" : "Sign in";
  }

  function showLoggedIn(session) {
    if (!session) return;

    screen.style.display = "none";

    if (!logoutButton) {
      logoutButton = document.createElement("button");
      logoutButton.id = "cn-logout";
      logoutButton.textContent = "Sign out";
      logoutButton.addEventListener("click", async () => {
        logoutButton.disabled = true;
        const { error } = await supabase.auth.signOut();

        if (error) {
          alert("Could not sign out: " + error.message);
          logoutButton.disabled = false;
        }
      });
      document.body.appendChild(logoutButton);
    }

    logoutButton.style.display = "block";
  }

  function showLoggedOut() {
    screen.style.display = "flex";
    if (logoutButton) logoutButton.style.display = "none";
  }

  switchButton.addEventListener("click", () => {
    if (busy) return;

    isSignup = !isSignup;
    subtitle.textContent = isSignup
      ? "Create your ClientNest account"
      : "Sign in to your workspace";

    submit.textContent = isSignup ? "Create account" : "Sign in";
    switchButton.textContent = isSignup
      ? "Already have an account? Sign in"
      : "Create a new account";

    password.autocomplete = isSignup
      ? "new-password"
      : "current-password";

    showMessage("");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    showMessage("");

    try {
      const credentials = {
        email: email.value.trim(),
        password: password.value
      };

      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
  ...credentials,
  options: {
    emailRedirectTo: "https://ratanpaw77.github.io/clientnest-saas/"
  }
});
        if (error) throw error;

        if (data.session) {
          showMessage("Account created. Opening ClientNest...");
          showLoggedIn(data.session);
        } else {
          showMessage(
            "Account created. Check your email to confirm it, then return here and sign in."
          );
        }
      } else {
        const { data, error } =
          await supabase.auth.signInWithPassword(credentials);

        if (error) throw error;

        showLoggedIn(data.session);
      }
    } catch (error) {
      showMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      showLoggedIn(session);
    } else {
      showLoggedOut();
    }
  });

  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      showMessage("Could not check your session. Please refresh the page.");
      return;
    }

    if (data.session) {
      showLoggedIn(data.session);
    } else {
      showLoggedOut();
    }
  });
})();
                                    
