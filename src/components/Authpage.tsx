import { useState } from "react";
import { supabaseClient } from "../supabase/client";

const Authpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUp, setSignUp] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { email, password };
    if (email !== "" && password !== "") {
      if (signUp) {
        // Create account
        const { error: signUpError } = await supabaseClient.auth.signUp(data);

        if (signUpError) {
          console.log("Error Signup:", signUpError);
          return;
        }

        setEmail("");
        setPassword("");
        setSignUp(false);
      } else {
        // Login
        const { error: loginError } =
          await supabaseClient.auth.signInWithPassword(data);

        if (loginError) {
          console.log("Error Signup:", loginError);
          return;
        }

        setEmail("");
        setPassword("");
        setSignUp(false);
      }
    }
    // else {
    //   alert("Enter credentials");
    // }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>{signUp ? "Sign up" : "Login"} here</h2>

        <input
          className="input-box"
          type="email"
          placeholder="email"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <br />
        <input
          className="input-box"
          type="password"
          placeholder="password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />

        <br />
        <br />
        <button className="add-btn">{signUp ? "Register" : "Login"}</button>
        <br />
        <br />

        {/* Switch button  */}
        <button
          onClick={() => setSignUp(!signUp)}
          className="add-btn"
          style={{ backgroundColor: "blue" }}
        >
          Switch to {signUp ? "Login" : "Signup"}
        </button>
      </form>
    </>
  );
};

export default Authpage;
