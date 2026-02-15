/**
 * Cron Runner for nerkhe.ir
 * Runs scheduled tasks by calling internal API endpoints.
 *
 * Schedule:
 *   - Update prices: every 6 hours (4 calls/day = ~120/month — matches Navasan free tier)
 *   - Daily stats:   every day at midnight (Iran time)
 *   - Generate content: every day at 7:00 AM (Iran time, UTC+3:30)
 */

const APP_URL = process.env.APP_URL || "http://app:3000";
const CRON_SECRET = process.env.CRON_SECRET || "";

const headers = {
  "Content-Type": "application/json",
  ...(CRON_SECRET && { Authorization: `Bearer ${CRON_SECRET}` }),
};

async function callEndpoint(name, path) {
  const url = `${APP_URL}${path}`;
  const now = new Date().toISOString();
  try {
    const res = await fetch(url, { method: "POST", headers });
    const data = await res.json();
    console.log(`[${now}] ${name}: ${res.status}`, JSON.stringify(data));
  } catch (err) {
    console.error(`[${now}] ${name} FAILED:`, err.message);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Price update: every 6 hours (4x/day = ~120/month for Navasan free tier)
async function priceUpdateLoop() {
  while (true) {
    await callEndpoint("update-prices", "/api/cron/update-prices");
    await sleep(6 * 60 * 60 * 1000); // 6 hours
  }
}

// Daily stats: runs at midnight Iran time (UTC 20:30)
async function dailyStatsLoop() {
  while (true) {
    const now = new Date();
    // Iran is UTC+3:30
    const iranHour = (now.getUTCHours() + 3) % 24;
    const iranMinute = (now.getUTCMinutes() + 30) % 60;

    if (iranHour === 0 && iranMinute < 5) {
      await callEndpoint("daily-stats", "/api/cron/daily-stats");
      // Wait 10 minutes to avoid duplicate runs
      await sleep(10 * 60 * 1000);
    } else {
      // Check every minute
      await sleep(60 * 1000);
    }
  }
}

// Content generation: runs at 7:00 AM Iran time (UTC 3:30)
async function contentGenerationLoop() {
  while (true) {
    const now = new Date();
    const iranHour = (now.getUTCHours() + 3) % 24;
    const iranMinute = (now.getUTCMinutes() + 30) % 60;

    if (iranHour === 7 && iranMinute < 5) {
      await callEndpoint("generate-content", "/api/cron/generate-content");
      // Wait 10 minutes to avoid duplicate runs
      await sleep(10 * 60 * 1000);
    } else {
      await sleep(60 * 1000);
    }
  }
}

console.log(`[${new Date().toISOString()}] Cron runner started`);
console.log(`  APP_URL: ${APP_URL}`);
console.log(`  CRON_SECRET: ${CRON_SECRET ? "configured" : "not set"}`);
console.log(`  Schedule: prices=6h (4/day), stats=midnight, content=7am (Iran time)`);

// Run all loops concurrently
Promise.all([
  priceUpdateLoop(),
  dailyStatsLoop(),
  contentGenerationLoop(),
]).catch((err) => {
  console.error("Cron runner crashed:", err);
  process.exit(1);
});
