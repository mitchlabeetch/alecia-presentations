import { httpRouter } from "convex/server";
import { exportPptx } from "./exportPptx";

const http = httpRouter();

http.route({
    path: "/export/pptx",
    method: "POST",
    handler: exportPptx,
});

http.route({
    path: "/export/pptx",
    method: "OPTIONS",
    handler: exportPptx,
});

export default http;
