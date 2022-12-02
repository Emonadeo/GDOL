import { useRouteData } from '@solidjs/router';
import { Component, For } from 'solid-js';

import { createPagination } from 'src/components/pagination';
import { UsersData } from 'src/openapi';
import { ordinal } from 'src/util';

import './page.scss';

import assetMedal from 'src/assets/medal.svg';

const Page: Component = function () {
	const users = useRouteData<typeof UsersData>();

	const [usersPaginated, UsersPagination] = createPagination(() => users() || []);

	return (
		<div class="page-leaderboard">
			<aside class="filter">
				<input class="textfield type-label-lg" type="text" placeholder="Search" />
				<UsersPagination />
			</aside>
			<aside class="medal" style={usersPaginated().length < 8 ? { display: 'none' } : undefined}>
				<img src={assetMedal} alt="Medal" />
			</aside>
			<main>
				<table>
					<thead>
						<tr>
							<th class="rank">
								<p class="type-title-md">Rank</p>
							</th>
							<th class="score">
								<p class="type-title-md">Score</p>
							</th>
							<th class="player">
								<p class="type-title-md">Player</p>
							</th>
						</tr>
					</thead>
					<tbody>
						<For each={usersPaginated()}>
							{(user) => (
								<tr>
									<td
										class="rank"
										classList={{
											gold: user.rank === 1,
											silver: user.rank === 2,
											bronze: user.rank === 3,
										}}
									>
										<p class="mono">
											<span>{user.rank}</span>
											<span>{ordinal(user.rank)}</span>
										</p>
									</td>
									<td class="score">
										<p class="mono">{user.score.toFixed(2)}</p>
									</td>
									<td class="player">
										<a href={`/users/${user.name}`}>
											<p>{user.name}</p>
										</a>
									</td>
								</tr>
							)}
						</For>
					</tbody>
				</table>
			</main>
			<aside class="filter">
				<UsersPagination />
			</aside>
		</div>
	);
};

export default Page;
