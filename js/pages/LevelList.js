import { store } from "../main.js";
import { embed, getEngineSelect, getSelectSelect, doStuff, incVisits, getYoutubeIdFromUrl, getLevelThumbnail } from "../util.js";
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
                    <template v-if="engineAsked == null">
                                <td class="rank">
                                    <p v-if="i + 1 <= 150" class="type-label-lg-big">#{{ i + 1}}</p>
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
                    <template v-else-if="engineAsked == level.engine">
                            <td class="rank">
                                <p v-if="i + 1 <= 150" class="type-label-lg">#{{ ii = ii + 1 }} (#{{ i + 1 }})</p>
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
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div v-if="level.scratchLink != null" class="type-title-sm">Links</div>
                            <div v-else-if="level.itchLink2 != null" class="type-title-sm">Links</div>
                            <div v-else class="type-title-sm">Link</div>
                            <div class="button-holder">
                            <!-- money folder -->
								<a v-if="level.scratchLink != null" :href="level.scratchLink" target="_blank">
                                	<button class="link-button" style="background-color: #f7a935; border-color: #f7a935;">
										<img src="../assets/scratchS.svg" class="button-center" style="width:70%;">
									</button>
                                </a>
                                <a v-if="level.turbowarpLink != null" :href="level.turbowarpLink" target="_blank">
                                	<button class="link-button" style="background-color: #ff4c4c; border-color: #ff4c4c;">
										<img src="../assets/turbowarpT.svg" class="button-center" style="width:110%;">
									</button>
                                </a>
                                <a v-if="level.itchLink != null" :href="level.itchLink" target="_blank">
                                	<button class="link-button" style="background-color: #fa5c5c; border-color: #fa5c5c;">
										<img src="../assets/itchioShop.svg" class="button-center" style="width:100%;"></button>
                                </a>
                                <a v-if="level.itchLink2 != null" :href="level.itchLink2" target="_blank">
                                	<button class="link-button" style="background-color: #7d2e2e; border-color: #7d2e2e;">
                                    	<p class="button-center" style="width: 100%;">LDM</p>
									</button>
                                </a>                                
                            </div>
                        </li>
                        <li>
                            <div class="type-title-sm">Main GD difficulty</div>
                            <p>{{ level.demonDifficulty }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <p v-if="selected + 1 <= 75"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <p v-else-if="selected +1 <= 150"><strong>100%</strong> or better to qualify</p>
                    <p v-else>This level does not accept new records.</p>
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
                                <p>{{ record.hz }}Hz</p>
                            </td>
                        </tr>
                    </table>
                </div>
                    <div v-else-if="selected == null" class="level" style="height: 100%; display: flex; justify-content: center; align-items: center;">
                    <h3>Welcome to the Scratch Geometry Dash Level List!</h3>
                    <p>Click the levels on the left side to see information about them!</p>
                    <p>For more information about the submission rules check the right side!</p>
                    <button class="btn" @click="selected = Math.ceil(Math.random() * list.length)">
                    	<span class="type-label-lg">I'm feeling lucky</span>
					</button>
                    <h3>Filters for levels</h3>
                    <p>Select engine:</p>
					<form action="#" class="type-label-lg">
                    	<select class="btn" v-model="engineSelected" id="engine" name="engine">
                        	<option class="type-label-lg" value="All" selected>All</option>
                            <option class="type-label-lg" value="GDR">GDR</option>
                            <option class="type-label-lg" value="iPhone">iPhone</option>
                            <option class="type-label-lg" value="Other">Other</option>
                        </select>
					    <button class="btn" type="submit">Filter!</button>
					</form>
                    <a class="nav__icon" href="https://discord.gg/FkKeS9kvT4">
                        <img src="../assets/discord.svg" alt="Discord Logo" />
                    </a>
                    <p>
                    	<a href="https://discord.gg/FkKeS9kvT4">
                        	join our discord please
                        </a>
                    </p>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p class="type-label-md">Website layout made by <a href="https://tsl.pages.dev/" style="text-decoration: underline;" target="_blank">TheShittyList</a>. <br> List equation stolen from <a href="https://list-calc.finite-weeb.xyz/" style="text-decoration: underline;" target="_blank">this peak website</a>.</p>
                    </div>
                    <template v-if="editors">
                        <h3>List Moderators</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                    <h3>Submission Requirements</h3>
                    <p>
                        Record submission:
                    </p>
                    <p>
                        - Achieved the record without using hacks (however, Turbowarp's FPS bypass is allowed, up to 250fps for levels that support delta time like Geometry Dash Revamped, Geometry Pig Dash,... and levels use Peneren's Spooky Dash Mods or Peneren's Pig Dash Mods can use hacks that don't affect the cheat indicator except speedhack).
                    </p>
                    <p>
                        - The recording must have a previous attempt and entire death animation shown before the completion, unless the completion is on the first attempt.
                    </p>
                    <p>
						- The recording must also show the player hit the endwall or reach the empty part at the end of the level, or the completion will be invalidated.
                    </p>
                    <p>
						- The recording must also show the player hit the endwall or reach the empty part at the end of the level, or the completion will be invalidated.
                    </p>
					<p>
						- Completion must use ~30 fps for levels that don't support delta time.
					</p>
					<p>
						- The recording must show the FPS used, or give moderator raw footage of the completion.
					</p>
                    <p>
                        - Do not use secret routes or bug routes.
                    </p>
                    <p>
                        - Do not use easy modes, only a record of the unmodified gameplay qualifies (depends on what level it is).
                    </p>
                    <p>
                        Once a level falls onto the Legacy List, we accept records for it for 24 hours after it falls off, then afterwards we never accept records for said level.
                    </p>
                    <p>
                        Level requirement:
                    </p>
                    <p>
                        - A level must be 20 seconds or longer and it must have decent quality of gameplay.
                    </p>
                    <p>
                        - A level must have some effort put into it.
                    </p>
                    <p>
                        - A level that has spam as main difficulty is not eligible to add.
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
        engineSelected: "All",
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
