import { useEffect, useState } from "react";
import "./App.css";
import Authpage from "./components/Authpage";
import Task from "./components/Task";
import { supabaseClient } from "./supabase/client";
import { Session } from "@supabase/supabase-js";

const App = () => {
  const [session, setSession] = useState<Session | null>(null);

  const fetchSession = async () => {
    const currentSession = await supabaseClient.auth.getSession();
    // console.log("sessions", currentSession);
    const sessionData = currentSession.data.session;
    setSession(sessionData);
  };

  useEffect(() => {
    fetchSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
      }
    );

    // console.log("authLis", authListener);

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabaseClient.auth.signOut();
  };

  return (
    <div>
      {session ? (
        <>
          <button
            onClick={logout}
            className="add-btn"
            style={{ backgroundColor: "red" }}
          >
            Logout
          </button>
          <Task session={session} />
        </>
      ) : (
        <Authpage />
      )}
    </div>
  );
};

export default App;
