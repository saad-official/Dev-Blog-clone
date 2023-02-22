import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import db, { auth, googleAuthProvider } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import debounce from "lodash.debounce";
const Enter = ({ props }) => {
  const { user, username } = useContext(UserContext);

  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInWithButton />
      )}
    </main>
  );
};

export default Enter;

// Sign in with Google Button
function SignInWithButton() {
  const SignInWithGoogle = () => {
    alert("d");
    auth
      .signInWithPopup(googleAuthProvider)
      .catch((error) => alert(error.message));
  };

  return (
    <button className="btn-google" onClick={SignInWithGoogle}>
      <img src={"/google.png"} alt="" srcset="" />
      Sing in
    </button>
  );
}

// Sign out button
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

// user form
function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    // create ref for both documents
    const userDoc = db.doc(`users/${user.uid}`);
    const usernameDoc = db.doc(`usernames/${formValue}`);

    //  Commit both docs together as a batch write
    const batch = db.batch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // only set form value if length is < 3 or it passess
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the Database for username match after each debounced change
  // useCallback is required for the debounce to work

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = db.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log("FireStore Read Excuted");
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input value={formValue} name="username" id="" onChange={onChange} />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) return <p>Checking..</p>;
  else if (isValid)
    return <p className="text-success">{username} is Avaiable</p>;
  else if (username && !isValid)
    return <p className="text-danger">That Username is taken</p>;
  else return <p></p>;
}
