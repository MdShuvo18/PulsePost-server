const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ameizfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const blogCollection = client.db('blogCollection').collection('blogCollection')
        const wishListCollection = client.db('blogCollection').collection('wishListCollection')
        const commentCollection = client.db('blogCollection').collection('commentCollection')


        app.get('/blogdetails/:id', async (req, res) => {
            const result = await blogCollection.findOne({ _id: new ObjectId(req.params.id) })
            res.send(result)

        })

        app.get('/addBlogCollection', async (req, res) => {
          
            const result = await blogCollection.find({}).toArray()
            res.send(result)
        })

       

        app.post('/addBlogCollection', async (req, res) => {
            const result = await blogCollection.insertOne(req.body)
            res.send(result)
        })

      
        // wishlistCollection.
        app.get('/wishlist', async (req, res) => {
              let query={}
            if (req.query.userEmail) {
                query = { userEmail: req.query.userEmail }
            }
            const result = await wishListCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/wishlist/:id', async (req, res) => {
            const result = await wishListCollection.findOne({ _id: new ObjectId(req.params.id) })
            res.send(result)
        })

        app.delete('/wishlist/:id', async (req, res) => {
            const result = await wishListCollection.deleteOne({ _id: new ObjectId(req.params.id) })
            res.send(result)
        })
        
        app.post('/wishlist',async (req, res) => {
            const result = await wishListCollection.insertOne(req.body)
            res.send(result);
        })


        
        // comment section
        app.post('/comment', async (req, res) => {
            const result = await commentCollection.insertOne(req.body)
            res.send(result)
        })

        app.get('/comment', async (req, res) => {
            const result = await commentCollection.find({}).toArray()
            res.send(result)
        })

        // update blogs section

        app.get('/addBlogCollection/:id', async (req, res) => {
            const result = await blogCollection.findOne({ _id: new ObjectId(req.params.id) })
            res.send(result)
        })

        app.put('/addBlogCollection/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedItem = req.body;
            const Item = {
                $set: {
                    title: updatedItem.title,
                    image: updatedItem.image,
                    short_description: updatedItem.short_description,
                    long_description: updatedItem.long_description,
                    category: updatedItem.category,
                }
            }
            const result = await blogCollection.updateOne(filter, Item, options);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})