var imagesToPdf = require("images-to-pdf")
var fs = require('fs')
var request = require('request')

// function to download image
var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
    })
}

var urlList
var otherHalf

//download images
let downloadPaper = function () {
    //parameters
    let today = new Date()
    let month = ('0' + (today.getMonth() + 1)).slice(-2)
    let day = ('0' + today.getDate()).slice(-2)
    urlList = []
    otherHalf = []

    for (let i = 1; i < 11; i++) {
        let urlRoute = 'https://epaperwmimg.amarujala.com/2020/' + month + '/' + day + '/dl/' + ('0' + i).slice(-2) + '/hdimage.jpg'
        let localRoute = './temp/' + i + '.png'
        download(urlRoute, localRoute, function () {
            //console.log('Page ' + i +' saved.')
        })
        urlList.push(localRoute)
    }
    otherHalf = urlList.splice(5, 10);
    console.log('Downloaded Images')
}

//convert to PDF
let getPart1 = async function () {
    await imagesToPdf(urlList, "./epaper-part1.pdf")
    console.log('Converted Part 1')
}

let getPart2 = async function () {
    await imagesToPdf(otherHalf, "./epaper-part2.pdf")
    console.log('Converted Part 2')
}

// send the message

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)
const apiUrl = process.env.API_URL
//apiUrl is the url where you run to host this index.js file. Eg Heroku, Now, Repl.it

let sendToWhatsapp = function (phone) {
    let date = new Date();
    date = date.toLocaleDateString();
    let fileName = 'Amar-Ujala-' + date;

    let toNumber = 'whatsapp:+91' + phone
    client.messages
        .create({
            from: 'whatsapp:+14155238886',
            body: "Good Morning! Here is today's newspaper 📰",
            to: toNumber
        })
        .then(message => console.log(message.sid))

    client.messages
        .create({
            from: 'whatsapp:+14155238886',
            body: fileName + '-part-1',
            to: toNumber,
            mediaUrl: apiUrl+ '/part1'
        })
        .then(message => console.log(message.sid))

    setTimeout(function () {
        client.messages
            .create({
                from: 'whatsapp:+14155238886',
                body: fileName + '-part-2',
                to: toNumber,
                mediaUrl: apiUrl+ '/part2'
            })
            .then(message => console.log(message.sid))
    }, 5000)
}

// start the server

var express = require('express')
var app = express()
var port = process.env.PORT || 8080

var part1 = fs.readFileSync('./epaper-part1.pdf')
var part2 = fs.readFileSync('./epaper-part2.pdf')

app.get("/", (req, res, next) => {
    res.send("Jaaga hu bhai")
});

app.get("/part1", (req, res, next) => {
    res.contentType("application/pdf")
    res.send(part1)
});

app.get("/part2", (req, res, next) => {
    res.contentType("application/pdf")
    res.send(part2)
});

app.get("/send", (req, res, next) => {
    downloadPaper()
    getPart1()
    getPart2()
    setTimeout(function () {
        sendToWhatsapp(req.query.ph)
    }, 5000);
    res.send('Paper sent')
})

app.listen(port)
console.log('Magic happens on port ' + port)