import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Sends a notification when a new message is added to a chat.
 */
export const onNewChatMessage = functions.firestore
  .document("chats/{chatId}/messages/{messageId}")
  .onCreate(async (snapshot, context) => {
    const message = snapshot.data();
    const chatId = context.params.chatId;

    if (!message) {
      console.log("No message data found.");
      return;
    }

    const senderId = message.senderId;
    const userIds = chatId.split("_");
    const recipientId = userIds.find((id: string) => id !== senderId);

    if (!recipientId) {
      console.log("Recipient not found.");
      return;
    }

    // Get sender's profile
    const senderDoc = await db.collection("users").doc(senderId).get();
    const sender = senderDoc.data();
    if (!sender) {
      console.log("Sender profile not found.");
      return;
    }

    // Get recipient's FCM token
    const tokenDoc = await db.collection("fcmTokens").doc(recipientId).get();
    const fcmTokenData = tokenDoc.data();

    if (!fcmTokenData || !fcmTokenData.token) {
      console.log(`No FCM token for user ${recipientId}`);
      return;
    }

    const payload: admin.messaging.MessagingPayload = {
      notification: {
        title: `New message from ${sender.username}`,
        body: message.text,
        clickAction: "/chat",
      },
    };

    try {
      await messaging.sendToDevice(fcmTokenData.token, payload);
      console.log("Notification sent successfully.");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  });


/**
 * Sends a notification when a new file is uploaded.
 */
export const onFileUploadComplete = functions.firestore
  .document("files/{fileId}")
  .onCreate(async (snapshot) => {
    const file = snapshot.data();
    if (!file) {
      console.log("No file data found.");
      return;
    }

    const ownerId = file.ownerId;

    // Get owner's FCM token
    const tokenDoc = await db.collection("fcmTokens").doc(ownerId).get();
    const fcmTokenData = tokenDoc.data();

    if (!fcmTokenData || !fcmTokenData.token) {
      console.log(`No FCM token for user ${ownerId}`);
      return;
    }

    const payload: admin.messaging.MessagingPayload = {
      notification: {
        title: "File Upload Complete",
        body: `Your file "${file.name}" has been successfully uploaded.`,
        clickAction: "/dashboard",
      },
    };

    try {
      await messaging.sendToDevice(fcmTokenData.token, payload);
      console.log("File upload notification sent successfully.");
    } catch (error) {
      console.error("Error sending file upload notification:", error);
    }
  });
