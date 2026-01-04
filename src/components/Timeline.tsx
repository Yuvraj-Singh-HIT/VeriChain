import { motion } from 'framer-motion';
import { CheckCircle, MapPin, Clock, User } from 'lucide-react';

interface TimelineEvent {
  id: string;
  action: string;
  actor: string;
  role: string;
  location: string;
  timestamp: string;
  notes?: string;
  txHash?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  orientation?: 'vertical' | 'horizontal';
}

const Timeline = ({ events, orientation = 'vertical' }: TimelineProps) => {
  if (orientation === 'horizontal') {
    return (
      <div className="relative overflow-x-auto pb-4">
        <div className="flex items-start gap-4 min-w-max px-4">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex flex-col items-center"
            >
              {/* Connector line */}
              {index < events.length - 1 && (
                <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-secondary" />
              )}
              
              {/* Node */}
              <motion.div
                whileHover={{ scale: 1.2 }}
                className={`relative z-10 w-12 h-12 rounded-full border-2 border-primary bg-background flex items-center justify-center mb-4 ${
                  index === events.length - 1 ? 'glow-primary' : ''
                }`}
              >
                <CheckCircle className={`w-6 h-6 ${
                  index === events.length - 1 ? 'text-primary' : 'text-primary/70'
                }`} />
              </motion.div>
              
              {/* Content Card */}
              <div className="w-48 glass rounded-xl p-4 text-center">
                <h4 className="font-heading font-semibold text-foreground capitalize mb-1">
                  {event.action.replace(/_/g, ' ')}
                </h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center justify-center gap-1">
                    <User className="w-3 h-3" />
                    {event.role}
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(event.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-primary/50" />
      
      <div className="space-y-8">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative pl-16"
          >
            {/* Node */}
            <motion.div
              whileHover={{ scale: 1.2 }}
              className={`absolute left-0 w-12 h-12 rounded-full border-2 bg-background flex items-center justify-center ${
                index === events.length - 1 
                  ? 'border-primary glow-primary' 
                  : 'border-primary/50'
              }`}
            >
              <CheckCircle className={`w-5 h-5 ${
                index === events.length - 1 ? 'text-primary' : 'text-primary/70'
              }`} />
            </motion.div>
            
            {/* Content Card */}
            <div className="glass rounded-xl p-5 border border-border hover:border-primary/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <h4 className="font-heading font-semibold text-lg text-foreground capitalize">
                    {event.action.replace(/_/g, ' ')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    by {event.actor} ({event.role})
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {new Date(event.timestamp).toLocaleString()}
                </div>
              </div>
              
              {event.notes && (
                <p className="text-sm text-muted-foreground mb-3">
                  {event.notes}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-primary">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </span>
                
                {event.txHash && (
                  <a 
                    href={`https://polygonscan.com/tx/${event.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
                  >
                    TX: {event.txHash.slice(0, 10)}...
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
