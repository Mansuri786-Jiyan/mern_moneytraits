/**
 * Migration Script: Mark all existing users as email-verified
 *
 * Run ONCE before deploying the email verification feature
 * to avoid locking out existing users.
 *
 * Usage:
 *   cd backend
 *   node scripts/migrate-verify-existing-users.js
 */

import "dotenv/config";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("MONGO_URI environment variable is not set.");
    process.exit(1);
}

async function run() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB.");

        const result = await mongoose.connection
            .collection("users")
            .updateMany(
                { isEmailVerified: { $ne: true } },
                { $set: { isEmailVerified: true } }
            );

        console.log(`Migration complete.`);
        console.log(`  Matched:  ${result.matchedCount} users`);
        console.log(`  Modified: ${result.modifiedCount} users`);
    } catch (err) {
        console.error("Migration failed:", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

run();
