export default {
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    template: `
		<img :src="getUrl" style:"width: 100%; height: 100%; object-fit: contain;">
    `,

    computed: {
        getUrl() {
            return "../assets/levels/" + this.name + ".webp";
        },
    },
};
