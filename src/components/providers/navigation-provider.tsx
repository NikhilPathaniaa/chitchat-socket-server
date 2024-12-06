'use client';

import { usePathname, useRouter } from "next/navigation";
import { useSocket } from '@/lib/socket/context';
import { createContext, useContext } from "react";

interface NavigationContextType {
  handleLogout: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  handleLogout: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { socket } = useSocket();

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
    }
    router.replace('/');
  };

  return (
    <NavigationContext.Provider value={{ handleLogout }}>
      {children}
    </NavigationContext.Provider>
  );
}
