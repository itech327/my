import { TopNav } from '@/components/TopNav';
import { Footer } from '@/components/Footer';
import { currentUser } from '@/lib/session';

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  return (
    <div className="relative">
      <TopNav signedIn={!!user} />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
