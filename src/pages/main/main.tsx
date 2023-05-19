/* eslint-disable @typescript-eslint/no-unused-vars */
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useState, useEffect } from "react";
import { Post } from "./posts";

export interface PostType {
	id: string;
	userId: string;
	username: string;
	title: string;
	description: string;
}

export const Main = () => {
	const [postsList, setPostsList] = useState<PostType[] | null>(null);
	const postsRef = collection(db, "posts");

	const getPosts = async () => {
		const data = await getDocs(postsRef);
		setPostsList(
			() =>
				data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as PostType[]
		);
	};

	useEffect(() => {
		getPosts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			{postsList?.map((post) => {
				return <Post post={post} />;
			})}
		</div>
	);
};
