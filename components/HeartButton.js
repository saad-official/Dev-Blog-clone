import { useDocument } from "react-firebase-hooks/firestore";
import db, { increment, auth } from "../lib/firebase";
// Allow user to heart or like a post
export default function Heart({ postRef }) {
  // Listen to Heart Document for Currently Logged in User
  const heartRef = postRef.collection("hearts").doc(auth.currentUser.uid);

  const [heartDoc] = useDocument(heartRef);

  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = db.batch();

    batch.update(postRef, { heartcounts: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  // Remove a User-to-Post reletionship

  const removeHeart = async () => {
    const batch = db.batch();

    batch.update(postRef, { heartcounts: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return heartDoc?.exists ? (
    <button onClick={removeHeart}>💔 UnHearted</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
}
