<script lang="ts">
	import { onMount } from 'svelte';
	import iconAdd from 'src/assets/icons/changelog/add.svg';
	import iconDelete from 'src/assets/icons/changelog/delete.svg';
	import iconLower from 'src/assets/icons/changelog/lower.svg';
	import iconRaise from 'src/assets/icons/changelog/raise.svg';

	const dict = {
		ADD: 'Added',
		MOVE: 'Moved',
		DELETE: 'Archived',
	};

	let changelog: Changelog[] = [];

	onMount(async () => {
		const res = await api.changelog.getChangelog();

		if (!res.ok) {
			// TODO: Show Error
			return;
		}

		changelog = res.data;
	});

	// Undo the log changes to restore list before changes
	// TODO: Maybe store this in the database changelog instead of recalculating every time?
	function calcBefore(entry: Changelog): any[] {
		const list = entry.list.slice();
		if (entry.to) list.splice(entry.to - 1, 1);
		if (entry.from) list.splice(entry.from - 1, 0, entry.level);
		return list;
	}

	function getIcon(entry: Changelog): string {
		switch (entry.action) {
			case 'ADD':
				return iconAdd;
			case 'DELETE':
				return iconDelete;
			case 'MOVE':
				return entry.to > entry.from ? iconLower : iconRaise;
		}
	}

	type ChangeMarker = 'begin' | 'end' | 'gradient';

	/**
	 * Cursed function, but it works pretty well.
	 * Assembles the visualization for the list changes.
	 * Inserting Begin/End Markers or Gradients where necessary, while maintaining proper Indexes.
	 */
	function getChangeDetails(
		list: Level[],
		rank: number,
		addOrDelete: boolean
	): Array<[Level, number] | ChangeMarker> {
		// Rank is assumed to be withing list bounds
		const sublist: Array<Level | 'begin' | 'end'> = list.slice(Math.max(rank - 2, 0), rank + 1);
		if (rank === 1) sublist.unshift('begin');
		else if (rank === list.length) sublist.push('end');

		if (addOrDelete) {
			sublist.splice(1, 1);
		}

		const res: Array<[Level, number] | ChangeMarker> = sublist.map((lvl, i) =>
			lvl === 'begin' || lvl === 'end' ? lvl : [lvl, i]
		);

		if (addOrDelete) {
			res.splice(1, 0, 'gradient');
		}

		return res;
	}
</script>

<div class="page-changelog">
	<h1>Changelog</h1>
	<ol role="list" class="log">
		{#each changelog as entry}
			{@const before = calcBefore(entry)}
			{@const isAdd = entry.action === 'ADD'}
			{@const isDelete = entry.action === 'DELETE'}
			<li class="entry">
				<div class="date">
					<p class="mono">
						{new Date(entry.timestamp).toLocaleDateString()}
					</p>
				</div>
				<div class="summary">
					<p>
						{dict[entry.action]}
						<a href={`/level/${entry.level.id}`}>{entry.level.name}</a>
					</p>
				</div>
				<div class="changes">
					{#if entry.from !== undefined && !isDelete}
						<p class="from">#{entry.from}</p>
					{/if}
					<div class="icon">
						<img src={getIcon(entry)} alt="change" />
					</div>
					<p class="to">#{isDelete ? entry.from : entry.to}</p>
				</div>
				<div class="actions">
					<p />
				</div>
				{#if entry.reason || !isAdd}
					<div class="details">
						{#if entry.reason}
							<p>
								<span>Reason: </span>
								<span>{entry.reason}</span>
							</p>
						{:else}
							<p class="no-reason">No Reason specified</p>
						{/if}
					</div>
				{/if}
				<div class="details-changes">
					{#each isAdd ? getChangeDetails(entry.list, entry.to, true) : getChangeDetails(before, entry.from, false) as change, i}
						{#if change === 'gradient'}
							<div class="before gradient" />
						{:else if change === 'begin'}
							<div class="before begin">
								<p class="type-label-md">Top of List</p>
							</div>
						{:else if change === 'end'}
							<div class="before end">
								<p class="type-label-md">End of List</p>
							</div>
						{:else}
							<div class="before" class:self={i === 1}>
								<div class="stripe" />
								<p class="level">{change[0].name}</p>
								<p class="rank">
									#{change[1] + (isAdd ? entry.to : entry.from) - 1}
								</p>
							</div>
						{/if}
					{/each}
					<div class="icon">
						<img src={getIcon(entry)} alt="change" />
					</div>
					{#each isDelete ? getChangeDetails(before, entry.from, true) : getChangeDetails(entry.list, entry.to, false) as change, i}
						{#if change === 'gradient'}
							<div class="after gradient" />
						{:else if change === 'begin'}
							<div class="after begin">
								<p class="type-label-md">Top of List</p>
							</div>
						{:else if change === 'end'}
							<div class="after end">
								<p class="type-label-md">End of List</p>
							</div>
						{:else}
							<div class="after" class:self={i === 1}>
								<p class="rank">
									#{change[1] + (isDelete ? entry.from : entry.to) - 1}
								</p>
								<p class="level">{change[0].name}</p>
								<div class="stripe" />
							</div>
						{/if}
					{/each}
				</div>
			</li>
		{/each}
	</ol>
</div>

<style lang="scss">
	@use 'src/styles/color';
	@use 'src/styles/screen';

	@include screen.xl {
		.page-changelog {
			display: grid;
			overflow: auto;
			flex: 1;
			grid-template-columns: calc(6.5rem + 4px) 1fr calc(6.5rem + 4px);
			padding-inline: calc(6rem + 1px);
			column-gap: 1.5rem;

			h1,
			.log {
				grid-column: 2 / span 1;
			}

			h1 {
				margin-block: 6rem;
			}

			.log {
				display: flex;
				flex-direction: column;
				gap: 6rem;
				margin-bottom: 6rem;

				.entry {
					display: grid;
					grid-template-columns: 25% 1fr max-content;
					grid-auto-rows: max-content;
					align-items: center;
					justify-items: start;
					gap: 2rem 1rem;

					&:hover {
						.date::after,
						.summary::after {
							content: '';
							flex: 1;
							border-top: 1px solid;
							position: relative;
							margin-left: 1rem;
							align-self: center;
						}
					}

					.date {
						justify-self: stretch;
						display: flex;
						color: rgba(color.$on-background, 0.4);
						border-color: rgba(color.$on-background, 0.4);
					}

					.summary {
						justify-self: stretch;
						display: flex;

						a {
							color: inherit;
							border-bottom: 1px solid color.$on-background;
						}
					}

					.changes {
						display: grid;
						grid-template-columns: max-content max-content max-content;
						gap: 0.5rem;
						align-items: center;

						.from {
							grid-column: 1;
							justify-self: end;
						}

						.icon {
							grid-column: 2;
							margin-block: -0.5rem;
						}

						.to {
							grid-column: 3;
							justify-self: start;
						}
					}

					.details {
						align-self: start;

						.no-reason {
							color: rgba(color.$on-background, 0.4);
						}
					}

					.details-changes {
						grid-column: 2 / span 2;
						align-self: start;
						justify-self: stretch;
						display: grid;
						grid-template-columns: 1fr 1.5rem 1fr;
						grid-auto-rows: max-content;
						grid-auto-flow: column;
						align-items: center;
						gap: 1rem 0.5rem;
						color: rgba(color.$on-background, 0.4);
						border-color: rgba(color.$on-background, 0.4);
						overflow: hidden;
						position: relative;
						padding-block: 0.5rem;
						margin-block: -0.5rem;

						$dot-size: 1px;

						.before,
						.after {
							display: flex;

							&.begin,
							&.end {
								display: flex;
								align-items: center;
								gap: 0.5rem;

								&::before,
								&::after {
									content: '';
									flex: 1;
									height: 5px;
								}

								&::before {
									border-left: 1px solid rgba(color.$on-background, 0.4);
								}

								&::after {
									border-right: 1px solid rgba(color.$on-background, 0.4);
								}
							}

							&.begin::before,
							&.begin::after {
								align-self: flex-end;
								border-top: 1px solid rgba(color.$on-background, 0.4);
							}

							&.end::before,
							&.end::after {
								align-self: flex-start;
								border-bottom: 1px solid rgba(color.$on-background, 0.4);
							}

							.stripe {
								flex: 1;
								position: relative;

								&::before {
									content: '';
									display: block;
									position: absolute;
									top: 0;
									right: 0;
									bottom: 0;
									left: 0;
									background-size: 5px 5px;
								}
							}

							.level {
								overflow: hidden;
								white-space: nowrap;
								margin-block: -0.5rem;
								padding-block: 0.5rem;
								text-overflow: ellipsis;
							}
						}

						.before {
							grid-column: 1;
							justify-content: end;
							position: relative;

							&.gradient {
								background-image: linear-gradient(90deg, transparent, #00ff00);
								align-self: stretch;
							}

							.stripe::before {
								right: 0.5rem;
								background-image: radial-gradient(
									circle at top 1px left 1px,
									rgba(color.$on-background, 0.4) $dot-size,
									color.$background $dot-size
								);
							}

							&.self .stripe::before {
								background-image: radial-gradient(
									circle at top 1px left 1px,
									color.$on-background $dot-size,
									color.$background $dot-size
								);
							}

							.rank {
								margin-left: 0.5rem;
							}
						}

						.icon {
							grid-column: 2;
							grid-row: 2;
							margin-block: -0.5rem;
						}

						.after {
							grid-column: 3;

							&.gradient {
								background-image: linear-gradient(90deg, #ff0000, transparent);
								align-self: stretch;
							}

							.rank {
								margin-right: 0.5rem;
							}

							.stripe::before {
								left: 0.5rem;
								background-image: radial-gradient(
									circle at top 1px right 1px,
									rgba(color.$on-background, 0.4) $dot-size,
									color.$background $dot-size
								);
								background-position: top right;
							}

							&.self .stripe::before {
								background-image: radial-gradient(
									circle at top 1px right 1px,
									color.$on-background $dot-size,
									color.$background $dot-size
								);
							}
						}

						.self {
							color: color.$on-background;
							border-color: color.$on-background;
						}
					}
				}
			}
		}
	}
</style>
