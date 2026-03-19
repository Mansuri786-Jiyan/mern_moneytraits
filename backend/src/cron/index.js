import { startJobs } from "./scheduler.js";

export const initializeCrons = async () => {
    try {
        const jobs = startJobs();
        return jobs;
    }
    catch (error) {
        console.error("CRON INIT ERROR:", error);
        return [];
    }
};
