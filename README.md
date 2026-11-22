# Fasting Tracker

Start and stop your daily fast with one tap on your iPhone. Every fast is logged to a Google Sheet with start time, end time and duration.

- **Backend:** Google Apps Script web app bound to a Google Sheet
- **Frontend:** iOS Shortcuts (Home Screen widget, Control Center, Action Button or Siri)
- **Permissions:** the script can access only the one spreadsheet it is attached to

## How it works

One shortcut works as a toggle:

- **First tap** starts a fast and adds a row with the start time.
- **Second tap** ends it and fills in the end time and duration in hours.
- An optional **status** call shows how long the current fast has been running.

The sheet `Fasting` is created automatically:

| Start | End | Duration (h) |
|---|---|---|
| 2026-11-22 20:00 | 2026-11-23 12:15 | 16.25 |

## Files

| File | Purpose |
|---|---|
| `Code.gs` | Apps Script code (web app endpoint) |
| `appsscript.json` | Manifest: time zone, restricted OAuth scope, web app settings |

---

## 1. Google Sheet and Apps Script

1. Create a new Google Sheet.
2. Open **Extensions → Apps Script**.
3. Open `Code.gs`, delete all existing content and paste the contents of [`Code.gs`](Code.gs).
4. Change `KEY` to your own secret string.
5. Save (**Ctrl/Cmd + S**).

## 2. Restrict permissions (manifest)

1. Open **Project Settings** (gear icon) and check **Show "appsscript.json" manifest file in editor**.
2. Open `appsscript.json` in the editor, delete all existing content and paste the contents of [`appsscript.json`](appsscript.json).
3. Change `timeZone` if you are not in `Europe/Bratislava`.
4. Save.

The `spreadsheets.currentonly` scope (together with `/** @OnlyCurrentDoc */` in the code) limits the script to this one spreadsheet instead of all your Google Sheets.

## 3. Deploy as a web app

1. Click **Deploy → New deployment**, select type **Web app**.
2. **Execute as:** Me, **Who has access:** Anyone.
3. Click **Deploy** and authorize. Google should ask only for access to this spreadsheet.
   If you see *"Google hasn't verified this app"*, click **Advanced → Go to (project name) (unsafe)**. It is your own script.
4. Copy the **Web app URL** ending in `/exec`.

After any code change, redeploy: **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The URL stays the same.

If you previously granted broader access, revoke it at [myaccount.google.com/permissions](https://myaccount.google.com/permissions).

## 4. iPhone Shortcut

### "Fast" (toggle)

1. Open **Shortcuts** and tap **+** (top right).
2. Tap the title → **Rename** → `Fast`.
3. Tap **Search Actions**, add **Get Contents of URL**, tap the **URL** field and paste:
   ```
   https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?key=YOUR_KEY
   ```
   Leave the method as GET.
4. Add **Show Notification**, replace *Hello World!* with the variable **Contents of URL**.
5. Tap **Done**.
6. Run it once. When asked *Allow "Fast" to connect to "script.google.com"?*, choose **Always Allow**.

Result:

```
Get contents of [https://script.google.com/.../exec?key=...]
Show notification [Contents of URL]
```

### "Fast status" (optional)

Long-press **Fast** → **Duplicate**, rename the copy to `Fast status` and append `&action=status` to the URL.

## 5. Launch options

- **Home Screen widget:** long-press the Home Screen → **Edit → Add Widget → Shortcuts** → small widget → **Add Widget**. Long-press the widget → **Edit Widget → Shortcut → Fast**.
- **Control Center** (iOS 18+): open Control Center → **+ → Add a Control → Shortcut → Fast**.
- **Action Button** (iPhone 15 Pro and later): **Settings → Action Button → Shortcut → Choose a Shortcut → Fast**.
- **Siri:** say "Fast".

## API

`GET <web app URL>?key=<KEY>[&action=status]`

| Request | Response |
|---|---|
| no fast running | `Fast started at HH:mm` |
| fast running | `Fast ended: X.X h` |
| `&action=status`, running | `Fasting for X.X h` |
| `&action=status`, not running | `No fast running` |
| wrong or missing key | `Invalid key` |

## Tips

- Average fast length: `=AVERAGE(C2:C)`
- Longest fast: `=MAX(C2:C)`

## Troubleshooting

| Problem | Fix |
|---|---|
| HTML page instead of a message | URL must end in `/exec` (not `/dev`); redeploy a new version |
| `Invalid key` | `key=` in the URL does not match `KEY` in `Code.gs` |
| Wrong times | Check `timeZone` in `appsscript.json` |
| Google asks for access to all spreadsheets | `oauthScopes` missing in `appsscript.json` or `/** @OnlyCurrentDoc */` missing in `Code.gs` |

## Security

The key in the URL is a simple shared secret that protects the sheet against random requests. Do not commit your real key or share your web app URL.

## License

MIT
