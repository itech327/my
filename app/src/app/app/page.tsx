import type { Metadata } from 'next';
import { requireUser } from '@/lib/session';
import { data } from '@/lib/data';
import { Editor } from './Editor';

export const metadata: Metadata = { title: 'إنشاء صوت' };

export default async function EditorPage({ searchParams }: { searchParams: Promise<{ welcome?: string; voice?: string }> }) {
  const user = await requireUser();
  const sp = await searchParams;
  const [voices, balance, history] = await Promise.all([
    data.listVoices({ userId: user.id }), data.getBalance(user.id), data.listGenerations(user.id, 1),
  ]);
  const paid = balance.nextExpiry !== null; // purchased lots carry an expiry, the trial does not
  return <Editor voices={voices} initialBalance={balance} paid={paid} welcome={sp.welcome} initialVoice={sp.voice} hasHistory={history.length > 0} />;
}
