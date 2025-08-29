import SolTransaction from "@/components/transactions/SolTransaction";
import WalletButton from "@/components/wallet/WalletButton";
import { WalletInfo } from "@/components/wallet/WalletInfo";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-500 to-slate-900">
      <header className="flex flex-row w-full">
        <div className="w-full mt-10">
          <h1 className="text-4xl font-bold mb-4 text-center text-white">
            Wallet Transaction Tracker
          </h1>
        </div>
        <aside className="flex flex-col mt-4 mr-8 min-w-[180px]">
          <WalletButton />
          <WalletInfo />
        </aside>
      </header>
      <section>
        <SolTransaction />
      </section>
    </main>
  );
}
