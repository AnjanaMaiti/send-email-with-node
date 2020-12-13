const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

//view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//public folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact', {layout: false});
});

app.post('/send', (req, res) => {
    const MAIL_BODY = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'mail.YOURDOMAIN.com',
        port: 123,
        secure: false, // true for 123, false for other ports
        auth: {
            user: 'YOUR_EMAIL',     // generated ethereal user
            pass: 'YOUR_PASSWORD'   // generated ethereal password
        },
        tls:{
          rejectUnauthorized:false
        }
      });
    
      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Nodemailer Contact" <your@email.com>', // sender address
          to: 'RECEIVER_EMAILS',                         // list of receivers
          subject: 'Node Contact Request',               // Subject line
          text: 'Hello world!',                          // plain text body
          html: MAIL_BODY                                // html body
      };
    
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);   
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
          res.render('contact', {msg:'Email has been sent'});
      });
})


const port = 3000;
app.listen(port, () => console.log(`server started on port ${port}`));