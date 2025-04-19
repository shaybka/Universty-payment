import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: "session",
    }),
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("WhatsApp client is ready!");
});

// Initialize the client once on startup
client.initialize();

export default client;
