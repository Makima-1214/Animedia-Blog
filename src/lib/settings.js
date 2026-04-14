import db from './turso.js';

export async function getSetting(key) {
  const result = await db.execute({ sql: 'SELECT value FROM settings WHERE key = ?', args: [key] });
  return result.rows[0] ? result.rows[0].value : null;
}

export async function getAllSettings() {
  const result = await db.execute('SELECT key, value FROM settings');
  const settings = {};
  result.rows.forEach(row => { settings[row.key] = row.value; });
  return settings;
}

export async function updateSetting(key, value) {
  await db.execute({ sql: 'UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?', args: [value, key] });
}

export async function updateSettings(settingsObj) {
  for (const [key, value] of Object.entries(settingsObj)) {
    await db.execute({ sql: 'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)', args: [key, value] });
  }
}
