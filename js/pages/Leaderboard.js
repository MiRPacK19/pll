import { fetchLeaderboard, fetchList } from '../content.js';
import { localize, mamaMia, getLevelThumbnail, getEngineSelect } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        engineAsked: getEngineSelect(),
        err: [],
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                <div class="board-container">
                    <table class="board">
                        <tr v-for="(ientry, i) in leaderboard">
                            <td class="rank">
                                <p class="type-label-lg">#{{ i + 1 }}</p>
                            </td> 
                            <td class="total">
                                <p class="type-label-lg">{{ localize(ientry.total) }}</p> 
                            </td>
                            <td class="user" :class="{ 'active': selected == i }">
                                <button @click="selected = i">
                                    <!-- ta strona jest zjebana -->
                                    <span style="display: inline-block;" class="type-label-lg"> {{ ientry.user }}</span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="player-container" style="border-collapse: separate;">
                    <div class="player" style="border-collapse: separate;">
                        <h1>#{{ selected + 1 }} {{ entry.user }}</h1>
                        <h3>{{ entry.total }}</h3>
                        <h2 v-if="entry.verified.length > 0">Verified ({{ entry.verified.length}})</h2>
                        <table class="table" style="display: grid; gap: 6px;">
                            <tr v-for="score in entry.verified">
                                <td class="rank" style="text-align: end;">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level" style="border-radius: 10px; margin: 1px; padding-left: 18px;" :style="getLevelThumbnail(score.rank - 1, list)">
                                    <a class="type-label-lg" style="border-collapse: collapse; border-spacing: 0rem;" target="_blank" :href="score.link">{{ score.level }}</a>
                                    <span class="type-label-sm">+{{ localize(score.score) }}</span>
                                </td>
                            </tr>
                        </table>
                        <h2 v-if="entry.completed.length > 0">Completed ({{ entry.completed.length }})</h2>
                        <table class="table" style="display: grid; gap: 6px;">
                            <tr v-for="score in entry.completed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level" style="border-radius: 10px; margin: 1px; padding-left: 18px;" :style="getLevelThumbnail(score.rank - 1, list)">
                                    <a class="type-label-lg" style="border-collapse: collapse; border-spacing: 0rem" target="_blank" :href="score.link">{{ score.level }}</a>
                                    <span class="type-label-sm">+{{ localize(score.score) }}</span>
                                </td>
                            </tr>
                        </table>
                       
                        <h2 v-if="entry.progressed.length > 0">Progressed ({{entry.progressed.length}})</h2>
                        <table class="table" style="display: grid; gap: 6px;">
                            <tr v-for="score in entry.progressed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level" style="border-radius: 10px; margin: 1px; padding-left: 18px;" :style="getLevelThumbnail(score.rank - 1, list)">
                                    <a class="type-label-lg" target="_blank" style="border-collapse: collapse; border-spacing: 0rem;" :href="score.link">{{ score.percent }}% - {{ score.level }}</a>
									<span class="type-label-sm">+{{ localize(score.score) }}</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        entry() {
            return this.leaderboard[this.selected];
        },
    },
    async mounted() {
        const [leaderboard, err] = await fetchLeaderboard();
        this.list = await fetchList();
        this.leaderboard = leaderboard;
        this.err = err;
        // Hide loading spinner
        this.loading = false;
    },
    methods: {
        localize,
        getLevelThumbnail,
    },
};
