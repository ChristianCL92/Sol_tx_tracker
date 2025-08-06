import WalletButton from "@/components/wallet/WalletButton";
import { WalletInfo } from "@/components/wallet/WalletInfo";
export default function Home() {
  return (
    <section className="container px-8 bg-amber-100 w-full h-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Wallet Transaction Tracker</h1>
      <div className="flex flex-col items-center">
      <WalletButton />
      <WalletInfo />
      </div>
    </section>
  );
}
