require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "./templates")));

app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});


app.get('/', (req, res) => {
    res.render('index');
})

app.get('*', (req, res) => {
    res.render('index');
})


app.post('/contact', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let msg = req.body.msg;

    const mailer = require("nodemailer");
    let service = mailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.mail,
            pass: process.env.user,
        },
    });

    let options = {
        from: process.env.mail,
        to: "chauraj345r@gmail.com",
        subject: name,
        html: `<div style="text-align: right; background-color: rgb(201, 76, 76); padding:10px;"><p>${new Date().toLocaleString("en-US", {
                    day: "numeric",
                    month: "long",
                    weekday: "long",
                })}</p>
               <p>${new Date().toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                })}</p></div>
                <hr><br>
                <div style="background-color: rgb(128,206,214); padding:10px;"><p><b>Name</b> : ${name}</p>
                <p><b>email</b> : ${email}</p>
                <p><b>Message</b> : ${msg}</p></div>
                <br><hr>
                <p style="text-align: center; background-color: coral; padding:10px;">Copyright &copy; sololinux.ml</p>`,
    };

    service.sendMail(options, (error) => {
        if (error) {
            console.log("NODEMAILER ERR : \n\t" + error);
            res.send({ bool: "false" });
        } else {
            console.log(`message sent from ${name}`);
            res.send({ bool: "true" });
        }
    });
})