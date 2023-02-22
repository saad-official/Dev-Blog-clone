import React, { useContext, useState } from "react";
import AuthCheck from "../../components/AuthCheck";
import kebabCase from "lodash.kebabcase";
import { useRouter } from "next/router";
import db, { auth, serverTimestamp } from "../../lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import toast from "react-hot-toast";
const AdminPostPage = () => {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
};
export default AdminPostPage;

function PostList() {
  const ref = db
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("03061166772");
  const query = ref.orderBy("createdAt");
  const [querySnapshot] = useCollection(query);

  const posts = querySnapshot?.docs.map((doc) => doc.data());
  return (
    <>
      <h1>Manage Your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // validate length
  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = db
      .collection("users")
      .doc(uid)
      .collection("03061166772")
      .doc(slug);
    // Give all field a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# Hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await ref.set(data);
    toast.success("Post Success");

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };
  return (
    <form onSubmit={createPost}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article"
      />
      <p>
        <strong> Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
