import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FlyingMoneyAnimationProps {
  senderAvatar?: string;
  senderName: string;
  receiverName: string;
  receiverAvatar?: string;
}

export const FlyingMoneyAnimation = ({
  senderAvatar,
  senderName,
  receiverName,
  receiverAvatar,
}: FlyingMoneyAnimationProps) => {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative w-full max-w-4xl mx-auto px-8">
        {/* Sender */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
        >
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={senderAvatar} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {senderName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium text-foreground">{senderName}</p>
        </motion.div>

        {/* Flying Money */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: [0, 600, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 -translate-y-1/2"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <DollarSign className="h-16 w-16 text-accent" />
            <motion.div
              animate={{ rotate: [0, -20, 0] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-2 -right-2 text-accent"
            >
              💸
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Receiver */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
        >
          <Avatar className="h-24 w-24 border-4 border-accent">
            <AvatarImage src={receiverAvatar} />
            <AvatarFallback className="text-2xl bg-accent text-accent-foreground">
              {receiverName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium text-foreground">{receiverName}</p>
        </motion.div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
        >
          <p className="text-lg font-semibold text-foreground">Sending transaction...</p>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-sm text-muted-foreground mt-2"
          >
            Please wait for blockchain confirmation
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};
