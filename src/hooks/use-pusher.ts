import Pusher from "pusher-js";
import { useEffect, useState } from "react";

let pusherClient: Pusher;

export const usePusher = (channelName: string) => {
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!pusherClient) {
      pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      });
    }

    const channel = pusherClient.subscribe(channelName);
    setChannel(channel);

    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [channelName]);

  const subscribe = (eventName: string, callback: (data: any) => void) => {
    if (!channel) return;
    channel.bind(eventName, callback);
    return () => channel.unbind(eventName, callback);
  };

  return { subscribe };
};
