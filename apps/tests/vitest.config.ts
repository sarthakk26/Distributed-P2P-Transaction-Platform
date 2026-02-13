import { defineConfig } from "vitest/config";
import path from "path";


export default defineConfig({

    resolve: {
        alias: {
            // Resolves @/ to user-app's src directory
            "@": path.resolve(__dirname, "../user-app/src"),
        },
    },
    test: {
        // Run test files sequentially — critical for DB tests so
        // suites don't stomp each other's seeded data
        pool: "forks",
        poolOptions: {
            forks: {
                singleFork: true,
            },
        },

        // Give each test plenty of time — we're hitting a real DB
        testTimeout: 15000,
        hookTimeout: 30000,

        // Pretty output
        reporters: ["verbose"],

        // Glob for all integration tests
        include: ["integration/**/*.test.ts"],
    },
});
