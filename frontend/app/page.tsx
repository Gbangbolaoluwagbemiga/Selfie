'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { IMPACT_FLOW_ADDRESS, IMPACT_FLOW_ABI } from '@/constants/contracts';

export default function Home() {
  const { isConnected } = useAccount();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: campaigns, isLoading: isLoadingCampaigns, refetch: refetchCampaigns } = useReadContract({
    address: IMPACT_FLOW_ADDRESS,
    abi: IMPACT_FLOW_ABI,
    functionName: 'getCampaigns',
  });

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-6xl font-extrabold mb-6 text-gray-900 leading-tight tracking-tight">
            Fund the <span className="text-blue-600">Future</span> of Impact
          </h2>
          <p className="text-gray-600 text-xl mb-8 leading-relaxed">
            The decentralized crowdfunding platform where transparency meets impact. 
            Launch your campaign or support the next big idea with crypto.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setShowCreateModal(true)}
              disabled={!isConnected}
              className={`px-8 py-4 text-white rounded-xl font-bold text-lg shadow-lg transform transition hover:-translate-y-1 ${isConnected ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {isConnected ? 'Start a Campaign' : 'Connect Wallet to Start'}
            </button>
            <a href="#campaigns" className="px-8 py-4 bg-white text-gray-800 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition shadow-sm hover:shadow-md">
              Explore Campaigns
            </a>
          </div>
        </div>
        
        {/* Stats / Features (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-500 font-medium">On-Chain Transparency</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">0%</div>
            <div className="text-gray-500 font-medium">Platform Fees</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">Global</div>
            <div className="text-gray-500 font-medium">Accessible to Everyone</div>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div id="campaigns" className="mb-8 flex justify-between items-end">
          <div>
             <h3 className="text-3xl font-bold text-gray-900">Trending Campaigns</h3>
             <p className="text-gray-500 mt-2">Discover projects making a difference.</p>
          </div>
        </div>

        {isLoadingCampaigns ? (
          <div className="text-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
             <p className="mt-4 text-gray-500">Loading campaigns...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns && campaigns.length > 0 ? (
              // @ts-ignore
              [...campaigns].reverse().map((campaign, index) => {
                  // Calculate real index because we reversed the array
                  const realIndex = campaigns.length - 1 - index;
                  return (
                    <CampaignCard 
                        key={realIndex} 
                        campaign={campaign} 
                        id={realIndex} 
                        onUpdate={() => refetchCampaigns()}
                    />
                  );
              })
            ) : (
              <div className="col-span-3 text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-lg">No campaigns found. Be the first to launch one!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateCampaignModal 
            onClose={() => setShowCreateModal(false)} 
            onSuccess={() => {
                setShowCreateModal(false);
                refetchCampaigns();
            }}
        />
      )}
    </main>
  );
}

function CampaignCard({ campaign, id, onUpdate }: { campaign: any, id: number, onUpdate: () => void }) {
  const { address } = useAccount();
  const [donateAmount, setDonateAmount] = useState('');
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Reset input on success
  if (isSuccess && donateAmount) {
     onUpdate();
  }

  const handleDonate = async () => {
    if (!donateAmount) return;
    try {
        writeContract({
            address: IMPACT_FLOW_ADDRESS,
            abi: IMPACT_FLOW_ABI,
            functionName: 'donateToCampaign',
            args: [BigInt(id)],
            value: parseEther(donateAmount),
        });
    } catch (e) {
        console.error(e);
    }
  };

  const handleRefund = () => {
    writeContract({
        address: IMPACT_FLOW_ADDRESS,
        abi: IMPACT_FLOW_ABI,
        functionName: 'refund',
        args: [BigInt(id)],
    });
  };

  const isExpired = Number(campaign.deadline) * 1000 < Date.now();
  const progress = Number(campaign.amountCollected) / Number(campaign.target) * 100;
  const daysLeft = Math.max(0, Math.ceil((Number(campaign.deadline) * 1000 - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group">
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {campaign.image ? (
            <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
          {campaign.category || 'General'}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {campaign.title}
        </h3>
        <p className="text-gray-500 mb-6 line-clamp-2 text-sm flex-1">
          {campaign.description}
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-900">{formatEther(campaign.amountCollected)} ETH</span>
            <span className="text-gray-500">of {formatEther(campaign.target)} ETH</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div 
                className={`h-full rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-blue-600'}`} 
                style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 font-medium">
            <span>{progress.toFixed(0)}% Funded</span>
            <span>{isExpired ? 'Ended' : `${daysLeft} Days Left`}</span>
          </div>
        </div>

        <div className="space-y-2">
            {!isExpired ? (
                <div className="flex gap-2">
                    <input 
                        type="number" 
                        placeholder="Amount (ETH)" 
                        value={donateAmount}
                        onChange={(e) => setDonateAmount(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button 
                        onClick={handleDonate}
                        disabled={isPending || isConfirming}
                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition active:scale-95 disabled:opacity-50 whitespace-nowrap"
                    >
                        {isPending || isConfirming ? '...' : 'Donate'}
                    </button>
                </div>
            ) : (
                <div className="text-center py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-500">
                    Campaign Ended
                </div>
            )}

            {isExpired && Number(campaign.amountCollected) < Number(campaign.target) && (
                 <button 
                    onClick={handleRefund}
                    disabled={isPending || isConfirming}
                    className="w-full py-3 mt-2 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-100 transition"
                >
                    Request Refund
                </button>
            )}
        </div>
      </div>
    </div>
  );
}

function CreateCampaignModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
    
    // Trigger onSuccess when tx confirms
    if (isSuccess) {
        // use timeout to let effect run once then close
        setTimeout(onSuccess, 500);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const title = formData.get('title') as string;
        const desc = formData.get('description') as string;
        const category = formData.get('category') as string;
        const target = formData.get('target') as string;
        const deadlineDate = formData.get('deadline') as string;
        const image = formData.get('image') as string;

        const deadlineTimestamp = Math.floor(new Date(deadlineDate).getTime() / 1000);

        writeContract({
            address: IMPACT_FLOW_ADDRESS,
            abi: IMPACT_FLOW_ABI,
            functionName: 'createCampaign',
            args: [
                title, 
                desc, 
                category, 
                parseEther(target), 
                BigInt(deadlineTimestamp), 
                image
            ],
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Create Campaign</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                        <input name="title" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Build a Web3 School" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                        <select name="category" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="Education">Education</option>
                            <option value="Environment">Environment</option>
                            <option value="Tech">Tech</option>
                            <option value="Health">Health</option>
                            <option value="Art">Art</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <textarea name="description" required rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Describe your mission..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Target (ETH)</label>
                            <input name="target" type="number" step="0.001" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="10" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Deadline</label>
                            <input name="deadline" type="date" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                        <input name="image" type="url" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isPending || isConfirming}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg mt-4 disabled:opacity-50"
                    >
                        {isPending || isConfirming ? 'Creating...' : 'Launch Campaign'}
                    </button>
                </form>
            </div>
        </div>
    );
}
