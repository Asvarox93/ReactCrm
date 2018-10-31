const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const cors = require("cors");
const corsHandler = cors({ origin: true });

// kasowanie użytkownika z Authentication
exports.deleteUser = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {
    const user = request.body;
    admin
      .auth()
      .deleteUser(user.uid)
      .then(() => {
        console.log("Użytkownik został wykasowany");
        response.send(200);
      })
      .catch(err => {
        console.error("Wystąpił problem przy usuwaniu użytkownika", err);
        response.send(400);
      });
  });
});
