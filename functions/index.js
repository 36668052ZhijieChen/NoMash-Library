const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions");
const {initializeApp} = require("firebase-admin/app");
const {FieldValue, getFirestore} = require("firebase-admin/firestore");
const cors = require("cors")({origin: true});

setGlobalOptions({maxInstances: 10});
initializeApp();

exports.countBooks = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const snapshot = await getFirestore().collection("books").get();
      res.status(200).json({count: snapshot.size});
    } catch (error) {
      console.error("Error counting books:", error);
      res.status(500).json({error: "Error counting books"});
    }
  });
});

const calculatePrice = (isbn) => {
  return Number((9.99 + (Number(isbn) % 500) / 100).toFixed(2));
};

exports.bookStore = onRequest((req, res) => {
  cors(req, res, async () => {
    const db = getFirestore();

    try {
      if (req.method === "GET") {
        const snapshot = await db.collection("books").orderBy("name").get();
        const books = snapshot.docs.map((bookDocument) => {
          const book = bookDocument.data();
          return {
            id: bookDocument.id,
            name: book.name,
            isbn: book.isbn,
            price: calculatePrice(book.isbn),
          };
        });

        res.status(200).json({books});
        return;
      }

      if (req.method === "POST") {
        const requestBody = req.body || {};
        const bookId = String(requestBody.bookId || "").trim();
        const buyerName = String(requestBody.buyerName || "").trim();

        if (!bookId || !buyerName) {
          res.status(400).json({error: "Book and buyer name are required."});
          return;
        }

        const bookReference = db.collection("books").doc(bookId);
        const bookDocument = await bookReference.get();

        if (!bookDocument.exists) {
          res.status(404).json({error: "The selected book does not exist."});
          return;
        }

        const book = bookDocument.data();
        const price = calculatePrice(book.isbn);
        const saleReference = db.collection("bookSales").doc();
        const receipt = {
          receiptNumber: `SALE-${saleReference.id.slice(0, 8).toUpperCase()}`,
          buyerName,
          bookId,
          bookName: book.name,
          isbn: book.isbn,
          price,
          purchasedAt: new Date().toISOString(),
        };

        await saleReference.set({
          ...receipt,
          purchasedAt: FieldValue.serverTimestamp(),
        });

        res.status(201).json({message: "Purchase completed.", receipt});
        return;
      }

      res.set("Allow", "GET, POST");
      res.status(405).json({error: "Method not allowed."});
    } catch (error) {
      console.error("Book store error:", error);
      res.status(500).json({
        error: "Unable to process the book store request.",
      });
    }
  });
});
