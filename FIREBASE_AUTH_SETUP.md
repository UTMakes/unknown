# 🔐 Firebase Email/Password Auth Setup

This guide enables email/password authentication for your game so players can create accounts and access saves across devices.

---

## Step 1: Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **upload-labs-game-d874a**
3. Click **"Authentication"** in the left sidebar
4. Click **"Get started"** (if you haven't already)
5. Click **"Email/Password"**
6. Toggle **"Enable"** to ON
7. Click **"Save"**

---

## Step 2: That's It! 🎉

Your game now supports:
- ✅ User registration with email/password
- ✅ Login on any device
- ✅ Cloud saves linked to accounts
- ✅ Auto-sync every 5 minutes

---

## Testing the Account System

1. **Open your game** (deployed on Vercel)
2. **Click "Login / Register"** in the sidebar
3. **Create an account:**
   - Enter Display Name (e.g., "PlayerOne")
   - Enter Email (e.g., "player@example.com")
   - Enter Password (min 6 characters)
   - Click "Create Account"
4. **Play the game** - your progress auto-saves
5. **Logout** and log back in to test loading

---

## How It Works

| Feature | Description |
|---------|-------------|
| **Registration** | Creates Firebase Auth user + saves initial game data |
| **Login** | Authenticates user + loads their cloud save |
| **Auto-save** | Every 5 minutes while logged in |
| **Manual save** | Click "Save Now" in Account panel |
| **Cross-device** | Login on any device to access your save |

---

## Security Notes

- Passwords must be **at least 6 characters**
- Email addresses must be **unique** (no duplicates)
- All data is stored in your Firebase project
- Players can only access their own saves

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Email already in use" | That email is registered, try logging in instead |
| "Invalid email" | Check email format (needs @ symbol) |
| "Weak password" | Use at least 6 characters |
| "User not found" | Email not registered, create account first |
| Can't login | Check Firebase Console → Authentication → Email/Password is enabled |

---

## Free Tier Limits

Firebase Auth free tier:
- **10,000** users per month
- Unlimited logins
- More than enough for most games!

---

## Need Help?

- Firebase Auth Docs: https://firebase.google.com/docs/auth/web/password-auth
- Check browser console (F12) for error messages
