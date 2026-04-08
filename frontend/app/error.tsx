"use client"

type ErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4">
			<h2>Došlo je do greške.</h2>
			<button
				onClick={() => reset()}
				className="rounded bg-black px-4 py-2 text-white"
			>
				Pokušaj ponovo
			</button>
		</div>
	);
}