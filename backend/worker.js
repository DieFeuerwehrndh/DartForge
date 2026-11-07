
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

        // Patreon-Kampagnen-ID abfragen
        if (
            request.method === "GET" &&
            url.pathname === "/api/setup/campaign"
        ) {
            if (!env.PATREON_CREATOR_ACCESS_TOKEN) {
                return Response.json({
                    success: false,
                    message: "Creator-Zugangs-Token fehlt."
                }, { status: 500, headers });
            }

            const response = await fetch(
                "https://www.patreon.com/api/oauth2/v2/campaigns",
                {
                    headers: {
                        "Authorization": `Bearer ${env.PATREON_CREATOR_ACCESS_TOKEN}`,
                        "User-Agent": "DartVexo/1.0"
                    }
                }
            );

            const result = await response.json();

            if (!response.ok) {
                return Response.json({
                    success: false,
                    message: "Patreon konnte nicht abgefragt werden.",
                    status: response.status
                }, { status: 502, headers });
            }

            return Response.json({
                success: true,
                campaigns: (result.data || []).map(campaign => ({
                    id: campaign.id,
                    name: campaign.attributes?.name || "Unbenannte Kampagne"
                }))
            }, { headers });
        }

        // Backend-Verbindung testen
        if (
            request.method === "GET" &&
            url.pathname === "/api/health"
        ) {
            return Response.json({
                success: true,
                app: "DartVexo",
                message: "Backend ist erreichbar."
            }, { headers });
        }

        // Unbekannte Route
        return Response.json({
            success: false,
            message: "Diese Route existiert nicht."
        }, {
            status: 404,
            headers
        });
    }
};
