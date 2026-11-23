import type { Metadata } from 'next';
import { requireUser } from '@/lib/session';
import { data } from '@/lib/data';
import { VoiceLibrary } from './VoiceLibrary';

export const metadata: Metadata = { title: 'الأصوات' };

export default async function VoicesPage() {
  const user = await requireUser();
  const [voices, balance] = await Promise.all([data.listVoices({ userId: user.id }), data.getBalance(user.id)]);
  return <VoiceLibrary voices={voices} paid={balance.nextExpiry !== null} />;
}
