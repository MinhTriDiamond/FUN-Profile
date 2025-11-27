import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";

const samplePosts = [
  {
    id: 1,
    author: "Alice Chen",
    initials: "AC",
    time: "2 hours ago",
    content: "Just deployed my first smart contract on the blockchain! 🚀 The possibilities with Web3 are endless. Who else is building cool stuff?",
    image: undefined,
    likes: 142,
    comments: 23,
    shares: 8,
  },
  {
    id: 2,
    author: "Bob Smith",
    initials: "BS",
    time: "4 hours ago",
    content: "Amazing community meetup today! Met so many talented developers and designers. The future of decentralized social is here! 💙",
    image: undefined,
    likes: 89,
    comments: 15,
    shares: 4,
  },
  {
    id: 3,
    author: "Carol Wang",
    initials: "CW",
    time: "6 hours ago",
    content: "Finally understanding how NFTs can revolutionize digital ownership. This changes everything! 🎨✨",
    image: undefined,
    likes: 234,
    comments: 45,
    shares: 12,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-feed">
      <Header />
      
      <div className="flex">
        <LeftSidebar />
        
        {/* Center Feed */}
        <main className="flex-1 ml-60 mr-72 py-4 px-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <CreatePost />
            
            {samplePosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </main>
        
        <RightSidebar />
      </div>
    </div>
  );
};

export default Index;
