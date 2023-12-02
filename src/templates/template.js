import { Liquid } from "liquidjs";
import { Value } from "liquidjs";

export const Templates = new Liquid({
	root: ["views/", "views/icons/"],
	extname: ".liquid",
});

Templates.registerTag("slug", {
	parse: function (token) {
		this.value = new Value(token.args, this.liquid);
	},
	render: function* (ctx) {
		const str = yield this.value.value(ctx);
		return String(str)
			.normalize("NFKD") // split accented characters into their base characters and diacritical marks
			.replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
			.trim() // trim leading or trailing whitespace
			.toLowerCase() // convert to lowercase
			.replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
			.replace(/\s+/g, "-") // replace spaces with hyphens
			.replace(/-+/g, "-")
			.toLowerCase();
	},
});
