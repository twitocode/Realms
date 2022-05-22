import useDebounce from "@hooks/useDebounce";
import { Community } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "react-query";

export default function SearchBar() {
	const [input, setInput] = useState("");
	const query = useDebounce(input, 800);

	const { data, isLoading } = useQuery<Community[]>(["search-bar", query], {
		queryFn: async () => {
			const res = await fetch(`/api/community/search?q=${query}`);
			const json = await res.json();

			return json.data;
		},
		initialData: [],
		enabled: query.length > 0,
	});

	return (
		<div className={`dropdown ${input.length > 0 && "dropdown-open"} w-full space-y-2`}>
			<input
				placeholder="Search for a post"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				className="input input-bordered w-full"
			/>
			<ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-md w-full space-y-6">
				{isLoading && <li className="py-2">Loading</li>}
				{!isLoading &&
					data!.length > 0 &&
					data!.map((community) => (
						<li key={community.id} className="py-2">
							<Link href={`/community/${community.id}`}>{community.name}</Link>
						</li>
					))}
				{!isLoading && data!.length === 0 && <li className="py-2">No Results</li>}
			</ul>
		</div>
	);
}
