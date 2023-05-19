/* eslint-disable react-hooks/exhaustive-deps */
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { PostType } from "./main";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

interface props {
	post: PostType;
}

interface Like {
	likeDocId: string;
	userId: string;
}

export const Post = ({ post }: props) => {
	const [likes, setLikes] = useState<Like[] | null>(null);
	const [user] = useAuthState(auth);
	const likesRef = collection(db, "likes");
	const likesDoc = query(likesRef, where("postId", "==", post.id));

	const getLikes = async () => {
		const data = await getDocs(likesDoc);
		setLikes(
			data.docs.map((doc) => ({ userId: doc.data().userId, likeDocId: doc.id }))
		);
	};

	const addLike = async () => {
		try {
			const newLikedDoc = await addDoc(likesRef, {
				userId: user?.uid,
				postId: post.id,
			});
			if (user) {
				setLikes((prev) =>
					prev
						? [...prev, { userId: user.uid, likeDocId: newLikedDoc.id }]
						: [{ userId: user.uid, likeDocId: newLikedDoc.id }]
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const removeLike = async () => {
		try {
			const deleteUnlikedDocumentQuery = query(
				likesRef,
				where("postId", "==", post.id),
				where("userId", "==", user?.uid)
			);

			const deleteUnlikedDocumentData = await getDocs(
				deleteUnlikedDocumentQuery
			);

			const deleteUnlikedDocumentId = deleteUnlikedDocumentData.docs[0].id;
			const deleteUnlikedDocument = doc(db, "likes", deleteUnlikedDocumentId);

			await deleteDoc(deleteUnlikedDocument);
			if (user) {
				setLikes(
					(prev) =>
						prev &&
						prev.filter((like) => like.likeDocId !== deleteUnlikedDocumentId)
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

	useEffect(() => {
		getLikes();
	}, []);

	return (
		<div>
			<div className='title'>
				<h1>{post.title}</h1>
			</div>
			<div className='body'>
				<p>{post.description}</p>
			</div>
			<div className='footer'>
				<span> @{post.username}</span>
				<button onClick={hasUserLiked ? removeLike : addLike}>
					{hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
				</button>
				{likes && <p> Likes: {likes?.length} </p>}
			</div>
		</div>
	);
};
