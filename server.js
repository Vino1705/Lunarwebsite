const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Page Routes
app.get('/', (req, res) => res.render('index'));
app.get('/offer', (req, res) => res.render('offer'));
app.get('/how', (req, res) => res.render('how'));
app.get('/gallery', (req, res) => res.render('gallery'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/thankyou', (req, res) => res.render('thankyou'));  // ✅ Thank You Page

// Handle Contact Form Submission
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vinoism1703@gmail.com',
    pass: 'sbny fxpe yenj xbmx'
  },
  tls: {
    rejectUnauthorized: false   // 👈 ignore self-signed certs
  }
});


  // Email to Admin
  const adminMail = {
    from: email,
    to: 'vinoism1703@gmail.com',
    subject: `New message from ${name}`,
    text: `From: ${name} <${email}>\n\nMessage:\n${message}`
  };

  // Auto-reply to Sender
  const userReply = {
    from: 'vinoism1703@gmail.com',
    to: email,
    subject: 'Thanks for contacting Lunar Terrain Project!',
    text: `Hi ${name},\n\nThanks for reaching out to us!\n\nWe received your message:\n"${message}"\n\nWe'll get back to you soon.\n\n– Lunar Terrain Project Team`
  };

  // Send both emails
  transporter.sendMail(adminMail, (error, info) => {
    if (error) {
      console.error('Admin email error:', error);
      return res.send('<h2>❌ Error sending your message. Please try again.</h2>');
    }

    console.log('Admin email sent:', info.response);

    transporter.sendMail(userReply, (autoErr, autoInfo) => {
      if (autoErr) {
        console.error('Auto-reply failed:', autoErr);
      } else {
        console.log('Auto-reply sent:', autoInfo.response);
      }

      // ✅ Redirect to Thank You Page
      res.redirect('/thankyou');
    });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
