import WalletButton from "@/components/wallet/WalletButton";
import { WalletInfo } from "@/components/wallet/WalletInfo";
export default function Home() {
  return (
      <section className="flex flex-row min-h-screen w-full">
        <div className="w-full mt-10">
          <h1 className="text-3xl font-bold mb-4 text-center">Wallet Transaction Tracker</h1>
        </div>
        <div className="flex flex-col mt-4 mr-8 min-w-[180px]">
            <WalletButton />
            <WalletInfo />
        </div>
      </section>
  );
}
