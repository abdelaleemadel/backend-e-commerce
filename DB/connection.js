import mongoose from "mongoose";

async function DBConnection() {
    mongoose.connect(process.env.CONNECTION_URL).then(() => {
        console.log(`Conntected to Db`);
    }).catch(error => { console.log(error); })
}

export default DBConnection