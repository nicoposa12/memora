import { Metadata } from 'next';
import { MemoraBooth } from '@/features/booth/components/MemoraBooth';

export const metadata: Metadata = {
  title: 'Memora Photobooth — snap your strip',
  description: 'Take photos with your own camera and download a printable strip in seconds.',
};

export default function BoothPage() {
  return (
    <main>
      <MemoraBooth eventName="Memora Booth" eventSubtitle="Try it now" exitHref="/" />
    </main>
  );
}
