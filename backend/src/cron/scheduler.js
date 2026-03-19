import cron from "node-cron";
import { processRecurringTransactions } from "./jobs/transaction.job.js";
import { processReportJob } from "./jobs/report.job.js";

const scheduleJob = (name, time, job) => {
    return cron.schedule(time, async () => {
        try {
            await job();
        }
        catch (error) {
        }
    }, {
        scheduled: true,
        timezone: "UTC",
    });
};

export const startJobs = () => {
    return [
        scheduleJob("Transactions", "5 0 * * *", processRecurringTransactions),
        //run 2:30am every first of the month
        scheduleJob("Reports", "30 2 1 * *", processReportJob),
    ];
};
