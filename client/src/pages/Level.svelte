<script lang="ts">
	import { queryStore } from '@urql/svelte';
	import { client } from 'src/urql';
	import { GetListLevelsDocument, GetRecordsByLevelDocument } from 'src/generated/graphql';
	import { embed, ordinal } from 'src/util';

	export let rank: number;

	const resLevel = queryStore({ client, query: GetListLevelsDocument });

	$: level = $resLevel.data?.List?.levels[rank - 1].level;

	$: resRecords = level
		? queryStore({
				client,
				query: GetRecordsByLevelDocument,
				variables: {
					level: level.id,
				},
		  })
		: undefined;

	$: records = $resRecords?.data?.Records?.docs;
</script>

{#if $resLevel.fetching || !$resRecords || $resRecords.fetching}
	<div />
{:else if $resLevel.error || $resRecords.error}
	<div />
{:else}
	<div class="page-level">
		{#if level}
			<div class="details">
				<span class="rank type-title-lg">{String(rank).padStart(3, '0')}</span>
				<h2 class="name">{level.name}</h2>
				<iframe
					class="video"
					src={embed(level.video)}
					title="youtube video player"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
				/>
				<dl class="credits">
					<div class="publisher">
						<dt class="type-title-sm">Publisher</dt>
						<dd class="type-body-lg">{level.user.name}</dd>
					</div>
					<div class="verifier">
						<dt class="type-title-sm">Verifier</dt>
						<dd class="type-body-lg">{level.verifier.name}</dd>
					</div>
					<div class="creators">
						<dt class="type-title-sm">Creators</dt>
						<dd class="type-body-lg">
							{#each level.creators as creator, i}
								<a href={`/users/${creator.id}`}>{creator.name}</a
								>{#if i < level.creators.length - 1}<span>, </span>{/if}
							{/each}
						</dd>
					</div>
				</dl>
			</div>
			<div class="records">
				<h5>Leaderboard</h5>
				<table>
					{#each records as record, i}
						{@const rank = i + 1}
						{@const complete = record.percentage === 100}
						<tr class="record">
							<td
								class="rank"
								class:gold={i === 0}
								class:silver={i === 1}
								class:bronze={i === 2}
							>
								{#if complete}
									<p class="mono" class:type-body-md={i > 2}>
										<span>{rank}</span><span>{ordinal(rank)}</span>
									</p>
								{/if}
							</td>
							<td class="percentage">
								<p class="mono" class:bold={complete}>{record.percentage}%</p>
							</td>
							<td class="user">
								<a href={`/users/${record.user.id}`}>
									<p>{record.user.name}</p>
								</a>
							</td>
							<td class="video">
								<a href={record.video} target="_blank">
									<img src="/src/assets/icons/media/youtube.svg" alt="YouTube" />
								</a>
							</td>
						</tr>
					{/each}
				</table>
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	@use 'src/styles/screen';
	@use 'src/styles/color';
	@use 'src/styles/util';

	// TODO: Accessibility: Links
	a {
		color: inherit;
	}

	@include screen.xl {
		.page-level {
			overflow: auto;
			flex: 1 0 0;
			display: grid;
			padding-block: 6rem;
			padding-inline: calc(6rem + 1px);
			grid-template-columns: 3fr 2fr;
			column-gap: 1.5rem;
			box-sizing: content-box;

			.details {
				display: flex;
				flex-direction: column;
				gap: 1.5rem;
				position: sticky;
				bottom: 0;
				align-self: end;
				height: max-content;
				// TODO: Better way using container size?
				min-height: calc(100vh - 16rem);

				.video {
					border-top: 1px solid color.$on-background;
					width: 100%;
					aspect-ratio: 16 / 9;
				}

				.credits {
					display: grid;
					grid-template-columns: 1fr 1fr;
					grid-auto-rows: max-content;
					gap: 1.5rem;

					> div {
						display: flex;
						flex-direction: column;
						gap: 0.75rem;
					}

					.creators {
						grid-row: 2;
						grid-column: span 2;
					}
				}
			}

			.records {
				display: flex;
				flex-direction: column;
				gap: 1.5rem;

				position: sticky;
				bottom: 0;
				align-self: end;
				height: max-content;
				// TODO: Better way using container size?
				min-height: calc(100vh - 16rem);

				table {
					tr.record {
						td {
							vertical-align: bottom;
							padding-block: 0.75rem;
							white-space: nowrap;

							&:not(:first-child) {
								padding-left: 1.25rem;
							}
						}

						td.rank {
							text-align: right;

							p:not(.type-body-md) {
								font-weight: 700;
							}

							&.gold p {
								@include util.text-gradient(#ffd700, #e89e00, #ffd700);
							}

							&.silver p {
								@include util.text-gradient(#ffffff, #c0c0c0, #c0c0c0);
							}

							&.bronze p {
								@include util.text-gradient(#ff8e31, #d45d00, #e8721d);
							}
						}

						td.percentage {
							text-align: right;

							p.bold {
								font-weight: 700;
							}
						}

						td.user {
							width: 100%;

							a {
								display: flex;
								align-items: center;
							}
						}

						&:hover td.user a::after {
							content: '';
							flex: 1;
							border-top: 1px solid color.$on-background;
							margin-left: 1.25rem;
						}

						td.video {
							padding-block: 0;
							vertical-align: middle;
							padding-left: 1rem;

							a {
								display: flex;
								height: 2.25rem;
								width: 2.25rem;
								border-radius: 100%;
								align-items: center;
								justify-content: center;

								&:hover,
								&:focus-visible {
									background-color: rgba(color.$on-background, 0.2);
								}

								img {
									height: 1.25rem;
								}
							}
						}

						&:not(:hover) td.video a {
							display: none;
						}
					}
				}
			}
		}
	}
</style>
