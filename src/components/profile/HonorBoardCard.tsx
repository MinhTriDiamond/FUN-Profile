import { FileText, MessageCircle, Star, Share2, Users, Hexagon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface HonorBoardCardProps {
  totalPosts: number;
  totalCommentsReceived: number;
  totalReactionsReceived: number;
  totalSharesReceived: number;
  friendCount: number;
  honorPointsBalance: number;
}

const HonorBoardCard = ({
  totalPosts,
  totalCommentsReceived,
  totalReactionsReceived,
  totalSharesReceived,
  friendCount,
  honorPointsBalance,
}: HonorBoardCardProps) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString('de-DE');
  };

  const statRows = [
    { icon: FileText, label: 'POSTS', value: totalPosts },
    { icon: MessageCircle, label: 'COMMENTS', value: totalCommentsReceived },
    { icon: Star, label: 'REACTIONS', value: totalReactionsReceived },
    { icon: Share2, label: 'SHARES', value: totalSharesReceived },
    { icon: Users, label: 'FRIENDS', value: friendCount },
  ];

  return (
    <Card className="bg-gradient-to-b from-green-900 to-green-950 border-2 border-yellow-500 rounded-xl overflow-hidden">
      <CardHeader className="text-center pb-4">
        <h2 className="text-3xl font-bold text-yellow-400 tracking-wider">HONOR BOARD</h2>
      </CardHeader>
      
      <CardContent className="space-y-3 px-6 pb-6">
        {statRows.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between bg-black/40 border border-yellow-600/50 rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Icon 
                  className={`h-5 w-5 ${stat.label === 'REACTIONS' ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400'}`} 
                />
                <span className="text-yellow-400 font-semibold">{stat.label}</span>
              </div>
              <span className="text-white font-bold text-lg">{formatNumber(stat.value)}</span>
            </div>
          );
        })}

        {/* Total Reward Footer */}
        <div className="flex items-center justify-between bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 border-2 border-yellow-500 rounded-lg px-4 py-4 mt-4">
          <div className="flex items-center gap-3">
            <Hexagon className="h-6 w-6 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-300 font-bold text-lg tracking-wide">TOTAL REWARD</span>
          </div>
          <span className="text-white font-bold text-2xl">{formatNumber(honorPointsBalance)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default HonorBoardCard;