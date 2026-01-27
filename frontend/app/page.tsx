import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
            Fund the <span className="text-blue-600">Future</span> of Impact
          </h2>
          <p className="text-gray-600 text-xl mb-8">
            The decentralized crowdfunding platform where transparency meets impact. 
            Launch your campaign or support the next big idea.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Start a Campaign
            </button>
            <button className="px-8 py-4 bg-white text-gray-800 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition shadow-sm hover:shadow-md">
              Learn More
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800">Trending Campaigns</h3>
          <a href="#" className="text-blue-600 hover:underline">View All &rarr;</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
             <div key={i} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
               <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative">
                 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                   {i === 1 ? 'Education' : i === 2 ? 'Environment' : 'Tech'}
                 </div>
               </div>
               <div className="p-6">
                 <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                   {i === 1 ? 'Build Schools in Web3' : i === 2 ? 'Clean Ocean Initiative' : 'DeSci Research Lab'}
                 </h3>
                 <p className="text-gray-500 mb-6 line-clamp-2">
                   Help us revolutionize the way we approach {i === 1 ? 'education' : 'sustainability'} through decentralized funding mechanisms.
                 </p>
                 
                 <div className="space-y-2 mb-6">
                   <div className="flex justify-between text-sm font-medium">
                     <span className="text-gray-900">4.5 ETH</span>
                     <span className="text-gray-500">of 10 ETH</span>
                   </div>
                   <div className="w-full bg-gray-100 rounded-full h-2">
                     <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                   </div>
                   <div className="flex justify-between text-xs text-gray-400">
                     <span>45% Funded</span>
                     <span>12 Days Left</span>
                   </div>
                 </div>

                 <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition active:scale-95">
                   Donate Now
                 </button>
               </div>
             </div>
          ))}
        </div>
      </div>
    </main>
  );
}
