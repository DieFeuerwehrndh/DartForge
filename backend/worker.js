
const ALLOWED_ORIGIN = "https://diefeuerwehrndh.github.io";

function corsHeaders(origin) {
    return {
        "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN
            ? ALLOWED_ORIGIN
            : "null",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json; charset=utf-8"
    };
}

export default {
    async fetch(request, env) {
        const origin = request.headers.get("Origin") || "";
        const headers = corsHeaders(origin);

        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers
            });
        }

        const url = new URL(request.url);

        if (request.method === "GET" && url.pathname === "/api/health") {
            return Response.json({
                success: true,
                app: "DartVexo",
                message: "Backend ist erreichbar."
            }, { headers });
        }

        return Response.json({
            success: false,
            message: "Diese Route existiert nicht."
        }, {
            status: 404,
            headers
        });
    }
};
