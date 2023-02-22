import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import Metatags from "../../components/Metatags";
import db, { auth, serverTimestamp } from "../../lib/firebase";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { toast } from "react-hot-toast";
import Link from "next/link";
import ImageUploader from "../../components/ImageUploader";
export default function AdminPostEdit() {
  return (
    <div>
      <AuthCheck>
        {/* <Metatags title="admin page" /> */}
        <PostManager />
      </AuthCheck>
    </div>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = db
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("03061166772")
    .doc(slug);

  const [post] = useDocumentData(postRef);

  return (
    <main className="">
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>

            <Link href={`/${post.username}/${post.slug}`}>
              <button>Live View</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });
    toast("Post Updated Successfully");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {/* {preview && (
       
      )} */}

      {preview ? (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      ) : (
        <div style={{ display: `${preview ? "hidden" : "block"}` }}>
          <ImageUploader />
          <textarea
            {...register("content", {
              required: { value: true, message: "content is required" },
              minLength: { value: 10, message: "content is too Short" },
              maxLength: { value: 20000, message: "content is too long" },
            })}
          ></textarea>

          {errors.content && (
            <p className="text-danger">{errors.content.message}</p>
          )}
          <fieldset>
            <input
              type="checkbox"
              {...register("published", { required: true })}
            />
            <label>Published</label>
          </fieldset>

          <button
            type="submit"
            className="btn-green"
            disabled={!isDirty || !isValid}
          >
            Save Changes
          </button>
        </div>
      )}
    </form>
  );
}
