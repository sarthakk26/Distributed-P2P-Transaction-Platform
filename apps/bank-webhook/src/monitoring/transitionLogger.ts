type transitionLog = {
    domain: "P2P" | "ONRAMP";
    entityId: number | string;
    from: string,
    to: string,
    meta?: Record<string, any>;
}

export function logTransition({
    domain,
    entityId,
    from,
    to,
    meta
}: transitionLog) {
    console.log(
        JSON.stringify({
            ts: new Date().toISOString,
            domain,
            entityId,
            transition: `${from} -> ${to}`,
            ...(meta ? { meta } : {})
        })
    )

}