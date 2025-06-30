// indexedDB.js
import { openDB } from "idb";

const DB_NAME = "VoterDB";
const STORE_NAME = "voters";

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "_id" }); // Ensure _id exists in each voter object
      }
    },
  });
};

export const storeVoters = async (voterList) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  voterList.forEach((voter) => store.put(voter));
  await tx.done;
};

export const getAllVoters = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};
