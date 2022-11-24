---
author: Lahiru Pathirage
category: post
comments: true
date:   2022-11-20
keywords: gcp, serverless, saga, choreography, javascript, gostep
layout: post
img: posts/gcp-saga/flowchart.png
tags:
- gcp, serverless, saga, choreography, gostep
title:  "Saga Pattern with serverless model on Google Cloud Platform - Part 1"
---

> Gostep: 👉 [Guide](https://github.com/gostep-cli/gostep/wiki)  
> Materials: 👉 [Complete source code](https://github.com/lpsandaruwan/saga-gcp)

During the past few years, the microservices architecture(MSA) and serverless model have gained a lot of popularity in the industry. However, these technologies come with their own set of challenges. One substantial challenge is managing data in MSA due to its complexity. Considering common patterns for MSA data management we will be focusing on the Saga pattern in this article.


## The Saga pattern
In order to manage business transactions across multiple microservices, the Saga pattern was introduced. Basically it is a series of local transactions; every transaction happens within the boundary of the micro-service, which every service will publish an event after the transaction for the next subsequent micro-service to perform the next transaction consuming the published event. This process will continue till the last transaction. In case any transaction failed in this series Saga will execute a series of fallback actions to undo the impact of all previous transactions. 

There are two approaches to implementing the Saga pattern.
* **Choreography** - The micro-service is responsible for emitting events eventually of its local transaction. The published event will trigger the execution of local transactions in microservices subscribed to the event. Also in this approach micro-service is responsible for handling the errors.

* **Orchestration** - A central orchestrator(a stateful coordinator) will trigger the local transactions in services and will maintain the global transaction status including handling errors.

Now that we have a basic understanding of Saga pattern, we will discuss how to implement Saga pattern, defining an example for both approaches using Google Cloud Serverless model.


## The real world example
Let’s consider a train ticket booking system.

![flowchart](/assets/img/posts/gcp-saga/flowchart.png)

The workflow consists of,

1. Send a seat reservation request
2. Check for available transits in the database and proceed with seat booking.
3. Hold the number of seats until payment is processed.
4. Process the payment.
5. Confirm the seat booking.
6. Confirm the reservation and notify the customer.

However if the system encountered any error while running a local transaction, the fallback sequence should be executed to undo all the changes happening in the global transaction to keep the [ACID](https://en.wikipedia.org/wiki/ACID) properties.


## Preparing the development environment

> (Please note that we won't be using a real payment gateway or a notification service, beacause the main purpose of this article is to demonstrate how to use severless model for Saga.)

To implement the solution we will be using Google Cloud serverless services, MongoDb and Javascript.

Before we begin we must have,
- A billing enabled Google Cloud project
- Prior knowledge in Google Cloud Services
- Python, NodeJs, GCloud cli tools installed in your system(If you are using Windows, WSL might come in handy)


### Google Cloud CLI/Cloud console
You can use both CLI tools or web console to create and modify services. In this article we will be mostly using CLI tools. Please follow https://cloud.google.com/sdk/docs/install to install the Google Cloud SDK. And once you installed the SDK run `gcloud init` command and follow instructions to configure credentials.


### Building the Cloud functions project structure

To build the project structure and functions, we will be using **gostep**, a pythonic CLI tool that I created previously to manage implementations when there are a lot of cloud functions.

To use gostep you need to have **Subversion CLI**, **Python version 3** and **Pip** package manager installed(Setup a virtual environment of your own preference). When you are ready, run the command, `pip install gostep`. For more information please refer, http://lahirus.com/gostep-intro. Also please make sure that you have enabled Cloud build APIs(https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com).

Using `gostep`, let’s first create a Cloud Functions project.

```sh
mkdir SagaChoreography && cd SagaChoreography
gostep auth init reservationsservice       # Creates a service account credentials file
gostep base init reservations location asia-east2 version "0.1.0"   # Creates gostep project metadata files and directory structure.
```

Now we can have the project base. Let's move ahead with implementing local transactions and services.


## Choreography based solution

For the demonstration we will be using,
- Pub/Sub for event sharing
- Firestore to store event data
- MongoDb as the transits service database

![saga chor flow](/assets/img/posts/gcp-saga/sagachoreographyflow.png)


### Transits service

This micro-service is responsible for CRUD operations on train entities.

```javascript
// Transit document schema
  {
       transitId: string,
       trainName: string,
       start: string,
       destination: string,
       day: string,
       departure: number,
       arrival: number,
       availableSeats: number,
       lockedSeats: number,
       totalSeats: number
  }
```
As the database, we will be using [MongoDB Atlas pay as you go](https://console.cloud.google.com/marketplace/product/mongodb/mdb-atlas-self-service) service in the GCP marketplace After configuring the MongoDb instance, let's create the transits function.

```sh
gostep service init transits version "0.1.0" env nodejs
```

This will create a boilerplate NodeJs cloud function in {PROJECT_ROOT}/src/transits and it can be executed as a http request after the deployment.

Now let’s include the dependencies.

```sh
cd src/transits
npm install --save mongodb
```

After creating the transits database and the collection, we can add MongoDb connection URI and collection name in the `src/trains/functions.json` as an environment variable.

```javascript
"environmentVariables": {
    "DB_URI": "mongodb+srv://<username>:<password>@<your-cluster-url>/<dbname>",
    "COLLECTION": "Transits"
    },
```

First let's use these environment variables and create a function to connect to the database.

```javascript
import { MongoClient } from "mongodb";
 

const DB_URI = process.env.DB_URI || "<Default DB con URI>";
 
const dbClient = new MongoClient(DB_URI);
 
const initDbClientConnection = async () => {
    try {
        await dbClient.connect();
    } catch(e) {
        console.error(e);
        throw new Error("Database failed to connect!");
    }
};
```

And now let's write 2 functions to find transits documents and save/update documents.

```javascript
const COLLECTION = process.env.COLLECTION || "Transits";

const query = async (queries) => {
    try {
        await initDbClientConnection();
        const transits = dbClient.db().collection(COLLECTION);
        return await transits.find(queries).toArray();
    } catch (e) {
        console.error(e);
        throw new Error("Failed to query transits!")
    } finally {
        await dbClient.close();
    }
}

const save = async(transitId, patches) => {
    try {
        await initDbClientConnection();
        const transits = dbClient.db().collection(COLLECTION);
        const targetData = { "$set": patches };
        await transits.updateOne({ transitId: transitId }, targetData, { upsert: true });
    } catch(e) {
        console.error(e);
        throw new Error("Failed to update transits!");
    } finally {
        await dbClient.close();
    }
}
```

In the main function we map GET and PUT https methods to above functions.

```javascript
export const main = async (req, res) => {
    if(req.method === "GET") {
        res.json(await query(req.query));
    } else if(req.method === "PUT") {
        const transitId = req.query["transitId"];
        if(!transitId) {
            res.status(400).send({ "error": "Invalid parameters!" })
        }
        await save(transitId, req.body);
        res.status(201).send();
    } else {
        res.status(400).json({ "error": "Invalid request" });
    }
}
```

Great! Now we have our transits service. We can deploy it by running below command in the project root,
```sh
gostep deploy diff
```

After the deployment, transits service can be executed using http requests. But the endpoint is not available for the public. To test it locally, use the bearer token which you can obtain using the Gcloud cli.

```sh
gcloud auth print-identity-token
```


### Reservations service

Next, we are going to implement the entrypoint of the global transaction. Like before, let's bootstrap a cloud function again. Run,

```sh
gostep service init reservations version "0.1.0" env nodejs
```

Now we have our boilerplate code in `{PROJECT_ROOT}/src/reservations`.

Considering this scenario the **reservations** function is responsible for,
1. Get the user request via a HTTP request.
2. Call transits service and find out if there is any transit avaialable.
3. If a transit is avialable publish an message to the relavent topic. 
4. Save the event data with it's status as 'IN_PROGRES', to update later.

We are going to keep the event data stored in a database. So that we can keep the status of the particular event to use later. For that purpose we use Google Cloud firestore(data store in native mode), which is a serverless easy to use document database.
To enable Firestore run,
```sh
gcloud firestore databases create --region=asia-southeast1
```

After that let's install the dependencies. In the function root({PROJECT_ROOT}/src/resrevations) run,

```sh
npm install --save "@google-cloud/firestore" "@google-cloud/pubsub"
```

Let's assume below payload as the request JSON.
```javascript
{
    "day": "Monday",
    "start": "Colombo",
    "destination": "Ragama",
    "numberOfSeats": 10,
    "userId": "xyz@gmail.com"
}
```

Once the user made his request we have to obtain the available transits for the requested day, start position and destination of the transit. To do that we will using a HTTP request to the **transits** service we implemeted before. Since the transits APIs are not publically available we have to use the `google-auth-library` to authorize requests from other services([See more](https://cloud.google.com/functions/docs/securing/authenticating)). There is no need to add the auth library as a dependecy since it is an already included library in the cloud function runtime.

First let's add an environment variable for the transits API endpoint in `{PROJECT_ROOT}/src/transits/function.json`.

```javascript
    "environmentVariables": {
        "TRANSITS_API": "{HOST_ADDRESS}/transits"
    }
```

After that let's authorize our request to fetch available transits.

```javascript
import { GoogleAuth } from "google-auth-library";


const TRANSITS_API = process.env.TRANSITS_API || "{DEFAULT_TRANSITS_HOST_ADDRESS}/transits";

export const getAvailableTransits = async (numberOfSeats, day, destination, start) => {
    try{
        // Create an authorized client to invoke restricted Transits API.
        const auth = new GoogleAuth();
        const transitsApiClient = await auth.getIdTokenClient(TRANSITS_API);

        const result = await transitsApiClient.request({
            url: `${TRANSITS_API}?day=${day}&destination=${destination}&start=${start}`,
            method: "GET"
        });
        return result.data.filter(element => element["availableSeats"] >= numberOfSeats);
    } catch(e) {
        console.error(e);
    }
};
```

Based on the result of the API request, we proceed further. Let's assume that we got a list of available transits and we selected the topmost transit. Now we will be saving the event data in **firestore**, with a unique Id(a generated UUID as `correlationId`) as the global transation Id to identify the local transactions group and the status of the current event. It will aid to identify the local transaction for later references.

Same as before we can add the firestore collection name(reffered as **kind** in firestore) of the event as an environment varibale in `{PROJECT_ROOT}/src/transits/function.json`.

```javascript
    "environmentVariables": {
        "EVENT_DATA_COLLECTION": "reservations"
    }
```

Now we can write our function to save event data in firestore. Please note that you don't have to include configurations to authorize the connection to the firestore since the cloud function runtime has the authorized access to the firestore in the same project.

```javascript
import Firestore from "@google-cloud/firestore";


const EVENT_DATA_COLLECTION = process.env.EVENT_DATA_COLLECTION || "reservations";

export const saveEvent = async (id, eventData) => {
    try {
        const firestore = new Firestore();
        const docRef = firestore.collection(EVENT_DATA_COLLECTION).doc(id);
        await docRef.set(eventData, { merge: true });
        const result = await docRef.get()
        return result.exists? result.data(): {}; // return the updated doc for later references
    } catch(e) {
        console.error(e);
        throw new Error("Error saving event data!");
    }
};
```

And since we have assumed that we have an available transit, we are going to publish a message to a pubsub topic to trigger the next event, **bookings**. First let's create a topic for this purpose.

```sh
gcloud pubsub topics create reservations.bookings
```

And please copy the output of that command and keep it saved, we are going to need it later. Same as before let's have another environment varible for the topic name and wirte the function to publish the message. In the message we include `correlationId`, `numberOfSeats`, `transitId` and `userId`.

```javascript
import { PubSub } from "@google-cloud/pubsub";


const BOOKINGS_TOPIC = process.env.BOOKINGS_TOPIC || "reservations.bookings";

export const publishMessage = async (topic, message) => {
    try {
        const pubsubClient = new PubSub();
        const dataBuffer = Buffer.from(JSON.stringify(message));
        return await pubsubClient.topic(topic)
            .publishMessage({ data: dataBuffer });
    } catch (e) {
        console.error(e);
        throw new Error(`Error publishing message to ${topic}!`);
    }
}
```

Now we have all helper functions and we can write the logic in the main funtion. Once the function is complted to deploy run,

```sh
gostep deploy diff
```


### Bookings service

The **bookings** function is responsible for hold the requested number of seats in selected transit until the global transaction is finished. The acting trigger of the function will be the `reservations.bookings` pubsub topic we create during the previous step. Once this service successfully locked the request number of seats it will publish a message to the relevenat pubsub topic to trigger the **payments** function.

Let's start. To initialize the function run,
```sh
gostep service init bookings version "0.1.0" env nodejs trigger pubsub
```

Now we have bootstrapped our cloud function in `{PROJECT_ROOT/src/bookings`. Let's tell the funtion that it will triggered by the `reservations.bookings` topic. For that we can include the resource value we copied from the previous topic creation in the `{PROJECT_ROOT/src/bookings/function.json`.

```javascript
    "eventTrigger": {
        "eventType": "providers/cloud.pubsub/eventTypes/topic.publish",
        "resource": "projects/{GCLOUD_PROJECT_ID}/topics/reservations.bookings"
    }
```

Same as the **reservations** function, we need to save the local transaction's event data with the `correlationId` and the `status` as `IN_PROGRESS` for later references. Also we can use same functions from the previous service to authorize requests to **transits** service and to publish the message to the next topic. What we can do is update the transit document to lock the requested number of seats.

```javascript
import { GoogleAuth } from "google-auth-library";


const TRANSITS_API = process.env.TRANSITS_API || "{TRANSITS_API_HOST}/transits";

export const getTransitsById = async (transitId, client) => {
    try {
        const result = await client.request({
            method: 'GET',
            url: `${TRANSITS_API}?transitId=${transitId}`
        });
        return result.length > 0? result[0]: {};
    } catch (e) {
        console.error(e);
        throw new Error(`Error fetching transit data: ${transitId}`);
    }
};

export const updateTransitsById = async (id, newData, client) => {
    try{
        return await client.request({
            method: "PUT",
            url: `${TRANSITS_API}?transitId=${id}`,
            body: newData
        });
    } catch(e) {
        console.error(e);
    }
};


export const main = async (eventData) => {
    const transactionData = JSON.parse(atob(eventData.data)); // Extract data from pubsub message

    const correlationId = transactionData["correlationId"];
    const numberOfSeats = Number(transactionData["numberOfSeats"]);
    const transitId = transactionData["transitId"];
    const userId = transactionData["userId"];

    const auth = new GoogleAuth();
    const transitsApiClient = await auth.getIdTokenClient(TRANSITS_API);

    const transit = await getTransitsById(transitId, transitsApiClient);
    await updateTransitsById(transitId, {
                "lockedSeats": transit["lockedSeats"] + numberOfSeats,
                "availableSeats": transit["availableSeats"] - numberOfSeats
                }, transitsApiClient);
}
```

And like before we will be creating the next pubsub topic to publish the message from **bookings**.

```sh
gcloud pubsub topics create reservations.payments
```

After a successful seat locking, we will be publishing a message with `correlationId`, `numberOfClients` and `userId`.

Once the function has been completed we can deploy it using,
```bash
gostep deploy diff
```

Great! Now we have covered common functionalities,
- Consume HTTP requests
- Function to function direct communication(via HTTP)
- Read and update event data in firestore
- Publishing and subscribing to Pubsub topics

This is more than enough for us to implement next services. Therefor afterwards, I will be explaining the function's role only.


### Payments service

The payments service will consume the message from `reservations.payments` and publish a message to `reservations.bookingCompletions` or `reservations.bookingCancelletions` accordingly for a successful payment or for a failed payment.


### Booking completions service

The booking completions will be consuming the messages from `reservations.bookingCompletions` topic, will be update the transit as the seat booking is completed and after that will update previously saved **booking** event's status from `IN_PROGRESS` to `COMPLETED` for the relevant `correlationId`. Then the service will publish an message to the `reservations.reservationCompletions` topic.


### Booking cancellations service

In the event of a payment failure, after consuming the message from the topic `reservations.bookingCancelletions` this function will rollback the locked seats in the relevant transit, will update **booking** event's status from `IN_PROGRESS` to `FAILED` for the relevant `correlationId` and will pass the `correlationId` to the `reservations.reservationCancellations` topic.


### Reservation completions service

As the final step of a completed series of events the **reservation completions service** will consume the correlation id for the transaction from `reservations.reservationCompletions` and will update previously saved `reservations` event's status from `IN_PROGRESS` to `COMPLETED`. After that a message will be published to the `reservations.notifications` topic to send the successful transaction notifications to the customer.


### Reservation cancellations service

Consuming the message from `reservations.reservationCancellations` this function will update previously saved `reservations` event's status from `IN_PROGRESS` to `FAILED` and will publish a message to the `reservations.notifications` topic to send the failed transaction notifications status to the customer.

## Securing the entrypoint

After deploying all the services we can use Google API gateway to secure our `reservations` entrypoint of the transaction.
Please refer [API gatewey quickstart](https://cloud.google.com/api-gateway/docs/secure-traffic-gcloud).


🦖 Let's look into **Orchestration** based solution in the next article.