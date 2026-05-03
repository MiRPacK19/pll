import { store } from "../main.js";
import { embed, getEngineSelect, getSelectSelect, doStuff, incVisits, getYoutubeIdFromUrl, getLevelThumbnail, getFpsSelect } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";
import levelThumbnail from "../components/List/LevelThumbnail.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list">
                <p v-if="ii = 0 == 12">you shouldn't see this</p>
                    <tr v-for="([level, err], i) in list">
                    <template v-if="engineAsked == null && fpsAsked == null">
                                <td class="rank">
                                    <p v-if="i + 1 <= 350" class="type-label-lg-big">#{{ i + 1}}</p>
                                    <p v-else class="type-label-lg">Legacy</p>
                                </td>
                                <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                                    <button id="levelThumbnailReal" @click="selected = i" style="background-color: rgb(255 0 0 / 0); width: 90%; margin: 0.5em; " :style="getLevelThumbnail(i, list)">
                                        <span class="type-label-lg
                                        ">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                                        <span class="type-label-sm">Verified by {{ level.verifier }}</span>
                                    </button>
                                </td>
                    </template>
                    <template v-else-if="fpsAsked != null && level.password.split('/').map(s => s.trim().replace(/fps/i, '').toLowerCase()).some(pwd => pwd === fpsAsked.toLowerCase()) && engineAsked == null">
                            <td class="rank">
                                <p v-if="i + 1 <= 350" class="type-label-lg">#{{ ii = ii + 1 }} (#{{ i + 1 }})</p>
                                <p v-else class="type-label-lg">Legacy</p>
                            </td>
                            <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                                <button id="levelThumbnailReal" @click="selected = i" style="background-color: rgb(255 0 0 / 0); width: 90%; margin: 0.5em; " :style="getLevelThumbnail(i, list)">
                                    <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                                                                            <span class="type-label-sm">Verified by {{ level.verifier }}</span>
                                </button>
                            </td>
                    </template>
                    <template v-else-if="engineAsked != null && level.password.split('/').map(s => s.trim()).some(pwd => engineAsked.includes(pwd)) && fpsAsked == null">
                            <td class="rank">
                                <p v-if="i + 1 <= 350" class="type-label-lg">#{{ ii = ii + 1 }} (#{{ i + 1 }})</p>
                                <p v-else class="type-label-lg">Legacy</p>
                            </td>
                            <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                                <button id="levelThumbnailReal" @click="selected = i" style="background-color: rgb(255 0 0 / 0); width: 90%; margin: 0.5em; " :style="getLevelThumbnail(i, list)">
                                    <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                                                                            <span class="type-label-sm">Verified by {{ level.verifier }}</span>
                                </button>
                            </td>
                    </template>
                    <template v-else-if="fpsAsked != null && engineAsked != null && level.password.split('/').map(s => s.trim()).some(pwd => engineAsked.includes(pwd)) && engineAsked != null && level.password.split('/').map(s => s.trim().replace(/fps/i, '').toLowerCase()).some(pwd === fpsAsked.toLowerCase())">
                            <td class="rank">
                                <p v-if="i + 1 <= 350" class="type-label-lg">#{{ ii = ii + 1 }} (#{{ i + 1 }})</p>
                                <p v-else class="type-label-lg">Legacy</p>
                            </td>
                            <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                                <button id="levelThumbnailReal" @click="selected = i" style="background-color: rgb(255 0 0 / 0); width: 90%; margin: 0.5em; " :style="getLevelThumbnail(i, list)">
                                    <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                                                                            <span class="type-label-sm">Verified by {{ level.verifier }}</span>
                                </button>
                            </td>
                    </template>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
					<p class="desc" v-if="level.description" v-html="level.description"></p>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier" :engine="level.engine"></LevelAuthors>
                    <iframe class="video" allow="fullscreen" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <p v-if="selected + 1 <= 200"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <p v-else-if="selected +1 <= 350"><strong>100%</strong> or better to qualify</p>
                    <p v-else>This level does not accept new records.</p>
                    <p v-if="level.legacy">This level should be beaten with legacy hitboxes</p>
                    <p v-else-if="level.legacy == false">This level must be beaten using the new hitboxes</p>
                    <p v-if="level.twoplayer">This level must be beaten solo to qualify</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}</p>
                            </td>
                        </tr>
                    </table>
                </div>
                    <div v-else-if="selected == null" class="level" style="height: 100%; display: flex; justify-content: center; align-items: center; text-align: center;">
                    <h3>Welcome to the Piluli Demon List!</h3>
                    <p>Click the levels on the left side to see information about them!</p>
                    <p>For more information about the submission rules check the right side!</p>
                    <button class="btn" @click="selected = Math.ceil(Math.random() * list.length)">
                    	<span class="type-label-lg">I'm feeling lucky</span>
					</button>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p class="type-label-md">Website layout made by <a href="https://tsl.pages.dev/" style="text-decoration: underline;" target="_blank">TheShittyList</a> and <a href="https://sgdlist.rf.gd/" style="text-decoration: underline;" target="_blank">SGD Level List</a>. <br> List equation stolen from <a href="https://list-calc.finite-weeb.xyz/" style="text-decoration: underline;" target="_blank">this peak website</a>.</p>
                    </div>
                    <template v-if="editors">
                        <h2>List Moderators</h2>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                    <h2>Submission Requirements</h2>
                    <h3>
                        Record submission:
                    </h3>
		    <p>
                        basically the Global Demonlist requirements
                    </p>
                    <p>
                        no vid no did
                    </p>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: null,
        engineAsked: getEngineSelect(),
        fpsAsked: getFpsSelect(),
        engineSelected: "All",
        fpsSelected: "",
		grat: "../assets/levels/",
        ideae: ".webp",
        ii: 0,
        blt: 0,
        errors: [],
        roleIconMap,
        store,
        visits: incVisits()
    }),
    computed: {
        level() {
            if (this.selected == null) {
            	return 0;
            } else {
                return this.list[this.selected][0];
            }
        },
        video() {
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }

            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
    },
    async mounted() {
        // Hide loading spinner
        this.list = await fetchList();
        this.editors = await fetchEditors();
        this.selected = await getSelectSelect(this.list);

        // Error handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
        getLevelThumbnail,
    },
};
