import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../App.css";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
	const [user] = useAuthState(auth);
	const navigate = useNavigate();

	const signUserOut = async () => {
		await signOut(auth);
		navigate("/login");
	};

	return (
		<div className='navbar'>
			<div className='pages'>
				<Link className='page' to='/'>
					Home
				</Link>
				{!user ? (
					<Link className='page' to='/login'>
						Login
					</Link>
				) : (
					<Link className='page' to='/createpost'>
						Create Post
					</Link>
				)}
			</div>

			<div className='profileBox'>
				{user && (
					<>
						<p> {user?.displayName} </p>
						<img
							src={user?.photoURL || ""}
							alt='profile_photo'
							width='30px'
							height='30px'
							style={{ borderRadius: 50 }}
						/>
						<button onClick={signUserOut}> Log out</button>
					</>
				)}
			</div>
		</div>
	);
};
