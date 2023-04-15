import express = require('express')
import * as functions from 'firebase-functions'
import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
const ethers = require('ethers');
const app: express.Express = express()
app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello World!',
  })
})

app.get('/nameOrAddress/:nameOrAddress', async (req, res) => {
    const nameOrAddress = req.params.nameOrAddress;
    const address = await getAddressByNameOrAddress(nameOrAddress);
    console.log('address', address);
    if (!address) {
        res.status(404).send({
            message: 'Not found',
        })
    } else {
        res.status(200).send({
            address: address,
        })
    }
})

app.get('/notifications/:address', async (req, res) => {
    const address = req.params.address;
    const notifications = await fetchNotifications(address);
    res.status(200).send({
        notifications: notifications,
    })
})


exports.api = functions.region('asia-northeast1').https.onRequest(app)


async function getAddressByNameOrAddress(nameOrAddress: string) {
    if (nameOrAddress.includes('.') && nameOrAddress !== undefined) {
        const provider = new ethers.providers.JsonRpcProvider('https://chaotic-quiet-meme.discover.quiknode.pro/86804d1e5443408f5fe8f2c85d421bf018dbe433');
        const address = await provider.resolveName(nameOrAddress);
        return address;
    } else {
        return nameOrAddress;
    }
}

async function fetchNotifications(userAddress: string) {
    const notifications = await PushAPI.user.getFeeds({
        user: 'eip155:42:' + userAddress,
        env: ENV.PROD,
    });

    console.log(notifications);
    return notifications;
}
