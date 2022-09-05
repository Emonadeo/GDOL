<script lang="ts">
	import { onMount } from 'svelte';

	const listLength = 150; // TODO: Configurable
	const legendCount = 5;

	export let id: number;

	let user;
	let recordsAndVerifications;

	onMount(async () => {
		const res = await api.users.getUser(id);
		user = res.data;
		// TODO: Sort records by level rank on server?
		user.records.sort((a, b) => a.level.rank - b.level.rank);
		recordsAndVerifications = [
			...user.records,
			...user.levelsVerified.map((lvl) => ({
				user: lvl.verifier,
				level: lvl,
				percentage: 100,
				timestamp: null,
			})),
		];
	});
</script>

<div class="page-user">
	{#if user}
		<img
			class="flag"
			src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg"
			alt="Flag"
		/>
		<h2>{user.name}</h2>
		<div class="score">
			<p class="type-title-lg">{user.score}</p>
			<!-- TODO: Create a proper score icon -->
			<svg viewBox="0 0 16 16" width="14" height="14">
				<circle fill="#fff" cx="8" cy="8" r="8" />
				<text
					fill="#000"
					x="8"
					y="8"
					text-anchor="middle"
					dominant-baseline="central"
					font-family="Lexend Deca"
					font-size="12"
					font-weight="700"
				>
					P
				</text>
			</svg>
		</div>
		<div class="chart">
			<div class="bar">
				{#each recordsAndVerifications as record}
					<div
						style:left={`${(record.level.rank - 1) * (100 / listLength)}%`}
						style:width={`${100 / listLength}%`}
						class:incomplete={record.percentage !== 100}
						title={`${record.level.name}: ${record.percentage}%`}
					/>
				{/each}
			</div>
			<div class="legends">
				{#each Array(legendCount) as _, i}
					{@const x =
						(i * (legendCount / (legendCount - 1)) * (listLength - 1)) / legendCount}
					<div
						class="rank"
						style:left={`${Math.floor(x) * (100 / listLength)}%`}
						style:width={`${100 / listLength}%`}
					>
						<svg viewBox="0 0 2 1" preserveAspectRatio="none">
							<polygon points="0,0 1,1 2,0" />
						</svg>
						<p class="type-label-md">{Math.floor(x + 1)}</p>
					</div>
				{/each}
			</div>
		</div>
		<div class="about tile">
			<dt class="type-title-sm">About</dt>
			<dd class="type-body-lg">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua. duis at.
			</dd>
		</div>
		<div class="hardest tile">
			<dt class="type-title-sm">Best Achievement</dt>
			<dd class="type-body-lg">{user.records[0].level.name}</dd>
		</div>
		<div class="favorite tile">
			<dt class="type-title-sm">Favorite Level</dt>
			<dd class="type-body-lg">&mdash;</dd>
		</div>
	{/if}
</div>

<style lang="scss">
	@use 'src/styles/color';
	@use 'src/styles/screen';

	@include screen.xl {
		.page-user {
			display: grid;
			padding: calc(6rem + 1px);
			grid-template-columns: calc(6.5rem + 4px) 1fr 1fr 8rem;
			gap: 1.5rem;

			.flag {
				grid-column: 1;
				height: 1rem;
				place-self: end;
			}

			h2,
			h3 {
				grid-column: 2;
			}

			.score {
				display: flex;
				gap: 0.25rem;
				place-self: end;
			}

			.chart {
				grid-column: 2 / span 2;

				.bar {
					height: 3rem;
					border: 1px solid color.$on-background;
					position: relative;

					div {
						position: absolute;
						background-color: #387800;
						height: 100%;

						&.incomplete {
							background-color: #8f5f00;
						}
					}
				}

				.legends {
					position: relative;
					height: 1.125rem;

					.rank {
						position: absolute;
						display: flex;
						flex-direction: column;

						svg {
							width: 100%;
							height: 0.25rem;
							margin-bottom: 0.25rem;
							fill: color.$on-background;
						}

						p {
							text-align: center;
							align-self: center;
						}
					}
				}
			}

			.tile {
				display: flex;
				flex-direction: column;
				gap: 1rem;
			}

			.about {
				grid-column: 2;
				grid-row: span 2;
				margin-right: 1.5rem;
			}

			.hardest {
				grid-column: 3;
			}

			.favorite {
				grid-column: 3;
			}
		}
	}
</style>
