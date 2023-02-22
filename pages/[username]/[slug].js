import React from "react";
import db, { auth, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "../../components/PostContent";
import AuthCheck from "../../components/AuthCheck";
import Heart from "../../components/HeartButton";
import Link from "next/link";
export async function getStaticProps({ params }) {
  const { username, slug } = params;
  console.log("fis", username, slug);
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection("03061166772").doc(slug);
    post = postToJSON(await postRef.get());
    console.log("user", post);
    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const snapshot = await db.collectionGroup("03061166772").get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();

    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

const PostPage = (props) => {
  const postRef = db.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;
  console.log("soo", post);
  return (
    <main className="">
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>💗 {post.heartcounts || 0}</strong>
        </p>
        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <Heart postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  );
};

export default PostPage;
