import Link from "next/link";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import db, { postToJSON, fromMillis } from "../lib/firebase";
import { useState } from "react";
import PostFeed from "../components/PostFeed";

const LIMIT = 1;
export async function getServerSideProps(context) {
  const postsQuery = db
    .collectionGroup("03061166772")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);
  console.log(posts);
  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;

    const query = db
      .collectionGroup("03061166772")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      {/* <Loader show={true} /> */}
      {/* <button onClick={() => toast.success("Toast success")}>Toast me</button> */}

      <PostFeed posts={posts} />
      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load More</button>
      )}
      <Loader show={loading} />
      {postsEnd && "You have Reached the end!"}
    </main>
  );
}
