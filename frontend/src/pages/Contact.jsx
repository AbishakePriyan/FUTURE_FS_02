// src/pages/Contact.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import emailjs from 'emailjs-com';

const Contact = () => {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSending(true);

    // 1) Prepare the template parameters to match your EmailJS template
    const templateParams = {
      from_name:  name,
      from_email: email,
      message:    message,
    };

    try {
      // 2) Send via EmailJS
      await emailjs.send(
        'service_p2ro40c',     // ← your Service ID
        'template_w1ir5eb',    // ← your Template ID
        templateParams,
        '3T5qgRPAWlSvcJtce'      // ← your User/Public Key
      );

      toast.success('✅ Message Sent Successfully!', { position: 'top-right' });
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      toast.success('❌ Failed to send message. Please try again later.', { position: 'top-right' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <form
            id="contact-form"
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block mb-1 text-gray-300">Name</label>
              <input
                id="from_name"
                type="text"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={sending}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Email</label>
              <input
                id="from_email"
                type="email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={sending}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Message</label>
              <textarea
                id="message"
                rows="5"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Write your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={sending}
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className={`w-full px-6 py-2 rounded-md font-semibold transition 
                ${sending
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-yellow-400 text-black hover:bg-yellow-300'}
              `}
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6">Our Location</h2>
          <p className="text-gray-300 mb-4">
            <span className="font-semibold text-yellow-400">Jersey Hub</span><br/>
            123, Sports Nagar<br/>
            Chennai, Tamil Nadu – 600000<br/>
            India
          </p>
          <p className="text-gray-400 mb-4">
            Email: <a href="mailto:support@jerseyhub.com" className="text-yellow-400 underline">support@jerseyhub.com</a><br/>
            Phone: <span className="text-gray-200">+91 12345 67890</span>
          </p>
          <iframe
            title="Jersey Hub Location"
            src="https://www.google.com/maps/embed?pb=!1m18!..." 
            width="100%"
            height="250"
            allowFullScreen=""
            loading="lazy"
            className="rounded-md border border-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
