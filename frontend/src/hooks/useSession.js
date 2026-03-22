import { useState, useEffect } from 'react';

export function useSession() {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    let sid = localStorage.getItem('mindmate_session');
    if (!sid) {
      // Will be set on first message response
      sid = null;
    }
    setSessionId(sid);
  }, []);

  const saveSession = (sid) => {
    localStorage.setItem('mindmate_session', sid);
    setSessionId(sid);
  };

  const clearSession = () => {
    localStorage.removeItem('mindmate_session');
    setSessionId(null);
  };

  return { sessionId, saveSession, clearSession };
}
