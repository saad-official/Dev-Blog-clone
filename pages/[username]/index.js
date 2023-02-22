import React from "react";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  // if no user short circut to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON Serializable data
  // console.log("jjj", userDoc);
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postQuery = userDoc.ref
      .collection("03061166772")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .limit(5);

    posts = (await postQuery.get()).docs.map(postToJSON);
    console.log("jjjkk", posts);
  }

  return {
    props: { user, posts }, // will passed the page as components
  };
}

const UserProfilePage = ({ user, posts }) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
};

export default UserProfilePage;
