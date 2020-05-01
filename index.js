var imagesToPdf = require("images-to-pdf")
var fs = require('fs')
var request = require('request')
var bodyParser = require('body-parser')

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

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

let sendToWhatsapp = function (phone) {
    let date = new Date();
    date = date.toLocaleDateString();
    let fileName = 'Amar-Ujala-' + date;

    let toNumber = 'whatsapp:+91' + phone
    client.messages
        .create({
            from: 'whatsapp:+14155238886',
            body: "Hello there! Here is your today's newspaper 📰",
            to: toNumber
        })
        .then(message => console.log(message.status))

    client.messages
        .create({
            from: 'whatsapp:+14155238886',
            body: fileName + '-part-1',
            to: toNumber,
            mediaUrl: 'https://epaper--abhisheksharm22.repl.co/part1'
        })
        .then(message => console.log(message.status))

    setTimeout(function () {
        client.messages
            .create({
                from: 'whatsapp:+14155238886',
                body: fileName + '-part-2',
                to: toNumber,
                mediaUrl: 'https://epaper--abhisheksharm22.repl.co/part2'
            })
            .then(message => console.log(message.status))
    }, 2000)
}

// start the server

var express = require('express')
var app = express()
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
var port = process.env.PORT || 8080
var part1 //first half of paper
var part2 //second half of paper

app.get("/", (req, res, next) => {
    res.send("Jaaga hu bhai")
});

app.get("/part1", (req, res, next) => {
    part1 = fs.readFileSync('./epaper-part1.pdf')
    res.contentType("application/pdf")
    res.send(part1)
});

app.get("/part2", (req, res, next) => {
    part2 = fs.readFileSync('./epaper-part2.pdf')
    res.contentType("application/pdf")
    res.send(part2)
});

app.get("/update", (req, res, next) => {
    downloadPaper()
    getPart1()
    getPart2()
    res.send("Updated the paper")
})

app.get("/send", (req, res, next) => {
    let args = req.query.ph.split(',')
    console.log(args)
    for (let i = 0; i < args.length; i++) {
        sendToWhatsapp(args[i])
    }
    res.send('Paper sent')
})

//handle incoming messages
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.post('/incoming', (req, res) => {

    const twiml = new MessagingResponse();

    if (req.body.Body.toLowerCase() == 'paper') {
        let toNumber = req.body.From.substring(12)
        sendToWhatsapp(toNumber)
    } else {
        var msg = twiml.message(`Hello Hello 👋

I am Akhbarwala 🤓🗞 I will send you the latest newspaper, right within WhatsApp.

To receive the newspaper - reply with *Paper*`)
        res.writeHead(200, {
            'Content-Type': 'text/xml'
        });
        res.end(twiml.toString());
    }
});

app.listen(port)
console.log('Magic happens on port ' + port)