export default {
    props: {
        author: {
            type: String,
            required: true,
        },
        creators: {
            type: Array,
            required: true,
        },
        verifier: {
            type: String,
            required: true,
        },
        engine: {
            type: String,
            required: true,
        },
    },
    template: `
        <div class="level-authors">
            <template v-if="selfVerified">
                <div class="type-title-sm">Creator & Verifier</div>
                <p class="type-body">
                    <span>{{ author }}</span>
                </p>
            </template>
            <template v-else-if="creators.length === 0">
                <div class="type-title-sm">Creator</div>
                <p class="type-body">
                    <span>{{ author }}</span>
                </p>
                <div class="type-title-sm">Verifier</div>
                <p class="type-body">
                    <span>{{ verifier }}</span>
                </p>
            </template>
			<template v-else>
            	<div v-if="creators.length == 1" class="type-title-sm">Creator</div>
                <div v-else class="type-title-sm">Creators</div>
    			<p class="type-body">
        			<template v-for="(creator, index) in creators" :key="'creator-' + index">
            			<span>{{ creator }}</span>
            			<span v-if="index < creators.length - 1">, </span>
        			</template>
				</p>
    			<div class="type-title-sm">Verifier</div>
    			<p class="type-body">
        			<span>{{ verifier }}</span>
    			</p>
			</template>
            <div class="type-title-sm">Publisher</div>
            <p class="type-body">
                <span>{{ author }}</span>
            </p>
		</div>
    `,

    computed: {
        selfVerified() {
            return this.author === this.verifier && this.creators.length === 0;
        },
    },
};
