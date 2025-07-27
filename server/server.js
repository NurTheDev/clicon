const connectDB = require("./src/database/database");
const app = require("./src/app");

const PORT = process.env.PORT || 3000;

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}, http://localhost:${PORT}`);
    })
}).catch((error)=>{
    console.error("Error connecting to the database" ,error);
    process.exit(1);
})
