
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://db.jobos.online');

async function testFetch() {
    console.log("Attempting to fetch blogs...");
    try {
        const records = await pb.collection('blogs').getList(1, 10);
        console.log("Success! Found " + records.totalItems + " blogs.");
        console.log("Items:", records.items);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        // Check if collection not found
        if (error.status === 404) {
            console.error("Collection 'blogs' likely does not exist.");
        }
    }
}

testFetch();
