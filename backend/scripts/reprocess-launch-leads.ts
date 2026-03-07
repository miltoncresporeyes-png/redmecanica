import 'dotenv/config';
import { access, readFile, writeFile } from 'fs/promises';
import { constants } from 'fs';
import { join } from 'path';
import { prisma } from '../src/db.js';

type FallbackLead = {
  email: string;
  reason?: string;
  createdAt?: string;
};

const fallbackPath =
  process.env.LAUNCH_LEADS_FALLBACK_FILE || join(process.cwd(), 'tmp', 'launch-leads-fallback.jsonl');

const run = async () => {
  try {
    await access(fallbackPath, constants.F_OK);
  } catch {
    console.log(`No fallback file found at ${fallbackPath}`);
    return;
  }

  const raw = await readFile(fallbackPath, 'utf8');
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    console.log(`Fallback file is empty: ${fallbackPath}`);
    return;
  }

  const parsed: FallbackLead[] = [];
  const parseErrors: string[] = [];

  for (const line of lines) {
    try {
      const item = JSON.parse(line) as FallbackLead;
      if (!item.email) {
        parseErrors.push(line);
        continue;
      }
      parsed.push(item);
    } catch {
      parseErrors.push(line);
    }
  }

  const deduped = new Map<string, FallbackLead>();
  for (const item of parsed) deduped.set(item.email.toLowerCase(), item);

  let inserted = 0;
  let duplicates = 0;
  const failed: FallbackLead[] = [];

  for (const [, item] of deduped) {
    try {
      await prisma.launchLead.create({ data: { email: item.email } });
      inserted += 1;
    } catch (error: any) {
      if (error?.code === 'P2002') {
        duplicates += 1;
      } else {
        failed.push({
          email: item.email,
          reason: error?.message || item.reason || 'reprocess-failed',
          createdAt: item.createdAt || new Date().toISOString(),
        });
      }
    }
  }

  const remainingLines = [
    ...failed.map((item) => JSON.stringify(item)),
    ...parseErrors,
  ];

  await writeFile(
    fallbackPath,
    remainingLines.length > 0 ? `${remainingLines.join('\n')}\n` : '',
    'utf8'
  );

  console.log(`Processed ${deduped.size} queued lead(s)`);
  console.log(`Inserted: ${inserted}`);
  console.log(`Already existed: ${duplicates}`);
  console.log(`Still queued: ${failed.length + parseErrors.length}`);
  console.log(`Fallback file updated: ${fallbackPath}`);
};

run()
  .catch((error) => {
    console.error('Failed to reprocess launch leads:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
