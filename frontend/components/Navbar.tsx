import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-lg">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold">I</div>
        <h1 className="text-2xl font-bold">ImpactFlow</h1>
      </div>
      <ConnectButton />
    </nav>
  );
}
