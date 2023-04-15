import express = require('express')
import * as functions from 'firebase-functions'
import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { LensClient, production } from "@lens-protocol/client";

const ethers = require('ethers');
const app: express.Express = express()


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

app.get('/lens/image/:address', async (req, res) => {
    const address = req.params.address;
    const imageInfo = await fetchLensProfileImageByAddress(address);
    res.status(200).send({
        imageInfo: imageInfo,
    })
})

app.get('/lens/followerInfo/:address', async (req, res) => {
    const address = req.params.address
    res.status(200).send(await getLensFollowInfo(address))
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

async function fetchLensProfileImageByAddress(userAddress: string) {
    const lensClient = new LensClient({
        environment: production
    });
    const allOwnedProfiles = await lensClient.profile.fetchAll({
        ownedBy: [userAddress],
    });
    const profileId = allOwnedProfiles.items[0].id;
    const profile = await lensClient.profile.fetch(
        {
            profileId: profileId
        },
     );
     const imageInfo = profile?.picture
     return imageInfo
}


async function getLensFollowInfo(userAddress: string) {
    const lensClient = new LensClient({
        environment: production
    });
    const allOwnedProfiles = await lensClient.profile.fetchAll({
        ownedBy: [userAddress],
    });
    const profileId = allOwnedProfiles.items[0].id;
    
    const profile = await lensClient.profile.fetch(
        {
            profileId: profileId
        },
     );

     const totalFollowers = profile?.stats.totalFollowers
     const totalFollowing = profile?.stats.totalFollowing

    const followInfo = {
        totalFollowers: totalFollowers,
        totalFollowing: totalFollowing
    }

    return followInfo
    
}