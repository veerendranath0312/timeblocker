import admin from "firebase-admin";
import path from "path";
import fs from "fs";
const serviceAccountPath = path.join(__dirname, "../../serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
console.log(serviceAccount)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;