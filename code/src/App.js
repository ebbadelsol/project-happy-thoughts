import React, { useState, useEffect } from "react";

import { ThoughtForm } from "components/ThoughtForm";
import { ThoughtItem } from "components/ThoughtItem";
import { LoadingItem } from "components/LoadingItem";

import { API_URL, LIKES_URL } from "utils/urls";

export const App = () => {
	const [thoughts, setThoughts] = useState([]);
	const [newThought, setNewThought] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchThoughts();
	}, []);

	const fetchThoughts = () => {
		setLoading(true);
		fetch(API_URL)
			.then((response) => response.json())
			.then((data) => setThoughts(data.response))
			.finally(() => setLoading(false));
	};

	const handleFormSubmit = (event) => {
		event.preventDefault();

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message: newThought }),
		};

		fetch(API_URL, options)
			.then((response) => response.json())
			.then((data) => {
				fetchThoughts(setNewThought(""));
			});
	};

	const handleLikesIncrease = (thoughtId) => {
		const options = {
			method: "POST",
		};

		fetch(LIKES_URL(thoughtId), options)
			.then((response) => response.json())
			.then((data) => {
				const updatedThoughts = thoughts.map((item) => {
					if (item._id === data.response._id) {
						item.hearts += 1;
						return item;
					} else {
						return item;
					}
				});
				setThoughts(updatedThoughts);
			});
	};

	return (
		<main className="main-section">
			{loading && <LoadingItem />}
			<ThoughtForm
				onFormSubmit={handleFormSubmit}
				newThought={newThought}
				setNewThought={setNewThought}
			/>

			<section className="thoughts-section">
				{thoughts.map((thought) => (
					<ThoughtItem
						key={thought._id}
						thought={thought}
						onLikesIncrease={handleLikesIncrease}
					/>
				))}
			</section>
		</main>
	);
};
