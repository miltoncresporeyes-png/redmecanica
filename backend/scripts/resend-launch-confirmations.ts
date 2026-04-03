import 'dotenv/config';
import { appendFile, mkdir, readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { prisma } from '../src/db.js';
import { sendLaunchLeadConfirmation } from '../src/services/email.js';

type SentLedgerEntry = {
  email: string;
  sentAt: string;
  source: 'batch';
};

const args = process.argv.slice(2);
const includeTests = args.includes('--include-tests');
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');

const emailArg = args.find((arg) => arg.startsWith('--emails='));
const requestedEmails = emailArg
  ? emailArg
      .slice('--emails='.length)
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  : [];

const ledgerPath =
  process.env.LAUNCH_CONFIRMATIONS_LEDGER_FILE ||
  join(process.cwd(), 'tmp', 'launch-confirmations-sent.jsonl');

const isTestEmail = (email: string) =>
  /^(debug|test|check|diag|qa|post-rotate)@/i.test(email) || email.toLowerCase().endsWith('@redmecanica.cl');

const buildLeadTicket = (lead: { id: string; createdAt: Date }) => {
  const createdAt = new Date(lead.createdAt);
  const yyyy = createdAt.getFullYear();
  const mm = String(createdAt.getMonth() + 1).padStart(2, '0');
  const dd = String(createdAt.getDate()).padStart(2, '0');
  const token = lead.id.replace(/-/g, '').slice(0, 8).toUpperCase();
  return `RM-LEAD-${yyyy}${mm}${dd}-${token}`;
};

const loadSentLedger = async () => {
  try {
    const raw = await readFile(ledgerPath, 'utf8');
    return new Set(
      raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          try {
            const parsed = JSON.parse(line) as SentLedgerEntry;
            return parsed.email.toLowerCase();
          } catch {
            return '';
          }
        })
        .filter(Boolean)
    );
  } catch {
    return new Set<string>();
  }
};

const saveSentLedgerEntry = async (email: string) => {
  await mkdir(dirname(ledgerPath), { recursive: true });
  const entry: SentLedgerEntry = {
    email,
    sentAt: new Date().toISOString(),
    source: 'batch',
  };
  await appendFile(ledgerPath, `${JSON.stringify(entry)}\n`, 'utf8');
};

const run = async () => {
  const sentLedger = await loadSentLedger();

  const leads = await prisma.launchLead.findMany({ orderBy: { createdAt: 'asc' } });
  const candidates = leads
    .filter((lead) => (requestedEmails.length > 0 ? requestedEmails.includes(lead.email.toLowerCase()) : true))
    .filter((lead) => (includeTests ? true : !isTestEmail(lead.email)))
    .filter((lead) => (force ? true : !sentLedger.has(lead.email.toLowerCase())));

  if (candidates.length === 0) {
    console.log('No pending confirmations to send');
    return;
  }

  let sent = 0;
  let failed = 0;

  for (const lead of candidates) {
    const email = lead.email;
    const ticket = buildLeadTicket(lead);

    if (dryRun) {
      console.log(`[dry-run] would send confirmation to ${email} with ticket ${ticket}`);
      continue;
    }

    try {
      await sendLaunchLeadConfirmation(email, ticket);
      await saveSentLedgerEntry(email);
      sent += 1;
      console.log(`sent ${email} (${ticket})`);
    } catch (error: any) {
      failed += 1;
      console.log(`failed ${email}: ${error?.message || String(error)}`);
    }
  }

  console.log(
    JSON.stringify(
      {
        totalCandidates: candidates.length,
        sent,
        failed,
        dryRun,
        ledgerPath,
      },
      null,
      2
    )
  );
};

run()
  .catch((error) => {
    console.error('Failed to resend launch confirmations:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
