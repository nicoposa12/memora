import { Metadata } from 'next';
import { BoothClient } from './BoothClient';

export const metadata: Metadata = {
  title: 'Memora Photobooth — snap your strip',
  description: 'Take photos with your own camera and download a printable strip in seconds.',
};

export default function BoothPage() {
  return (
    <main>
      <BoothClient />
    </main>
  );
}

