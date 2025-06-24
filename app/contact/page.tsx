"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email anytime',
      value: 'hello@thrills.com',
      action: 'mailto:hello@thrills.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Mon-Fri 9AM-6PM EST',
      value: '+1 (555) 123-4567',
      action: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Our headquarters',
      value: '123 Fashion Ave, NY 10001',
      action: 'https://maps.google.com'
    }
  ];

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      availability: 'Available 24/7'
    },
    {
      icon: Headphones,
      title: 'Phone Support',
      description: 'Speak directly with an expert',
      availability: 'Mon-Fri 9AM-6PM'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join our customer community',
      availability: 'Always active'
    }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 max-w-3xl mx-auto"
        >
          <Badge variant="outline" className="text-sm">
            Get In Touch
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold">
            We'd Love to
            <span className="text-primary block">Hear From You</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Have a question, suggestion, or just want to say hello? 
            We're here to help and would love to connect with you.
          </p>
        </motion.div>
      </section>

      {/* Contact Form & Info */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Get in Touch</h2>
              <p className="text-muted-foreground">
                Choose the best way to reach us. We're committed to responding quickly and helpfully.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card key={info.title} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{info.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{info.description}</p>
                      <a 
                        href={info.action}
                        className="text-primary hover:underline font-medium"
                      >
                        {info.value}
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-muted/50">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Support Options */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Need Immediate Help?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our various support channels for quick assistance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <option.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{option.title}</h3>
                      <p className="text-muted-foreground">{option.description}</p>
                      <Badge variant="outline">{option.availability}</Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Quick answers to common questions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              question: "What's your return policy?",
              answer: "We offer a 30-day return policy for all items in original condition."
            },
            {
              question: "How long does shipping take?",
              answer: "Standard shipping takes 3-5 business days, with free shipping on orders over $50."
            },
            {
              question: "Do you ship internationally?",
              answer: "Yes, we ship to over 25 countries worldwide with competitive rates."
            },
            {
              question: "How can I track my order?",
              answer: "You'll receive a tracking number via email once your order ships."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}