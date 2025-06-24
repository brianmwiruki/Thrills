'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Users, 
  Globe, 
  Heart,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { label: 'Happy Customers', value: '50K+', icon: Users },
    { label: 'Products Sold', value: '200K+', icon: TrendingUp },
    { label: 'Countries', value: '25+', icon: Globe },
    { label: 'Years Experience', value: '5+', icon: Award },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Every decision we make starts with our customers. We listen, we care, and we deliver.'
    },
    {
      icon: Sparkles,
      title: 'Quality Excellence',
      description: 'We source only the finest materials and work with trusted suppliers to ensure premium quality.'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'We stay ahead of trends and continuously innovate to bring you the latest in fashion technology.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      description: 'Passionate about fashion and technology, Sarah founded Thrills to bridge the gap between style and innovation.',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Design',
      description: 'With 10+ years in fashion design, Michael leads our creative team in developing cutting-edge accessories.',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Customer Experience Director',
      description: 'Emma ensures every customer interaction exceeds expectations and builds lasting relationships.',
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
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          <Badge variant="outline" className="text-sm">
            Our Story
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold">
            Redefining
            <span className="text-primary block">Fashion Accessories</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            At Thrills, we believe that accessories are more than just add-ons – they're expressions of your unique personality. 
            Since 2019, we've been curating and creating premium fashion accessories that blend style, quality, and innovation.
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                We're on a mission to democratize premium fashion accessories. We believe everyone deserves 
                to express their unique style with high-quality, beautifully designed pieces that don't break the bank.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Through careful curation, direct relationships with manufacturers, and a commitment to sustainability, 
                we bring you accessories that are both stylish and responsible.
              </p>
              <Link href="/shop">
                <Button size="lg">
                  Shop Our Collection
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full text-center p-6">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind Thrills
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6">
                  <CardContent className="space-y-4">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{member.name}</h3>
                      <p className="text-primary font-medium">{member.role}</p>
                      <p className="text-sm text-muted-foreground">{member.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-center p-12">
            <CardContent className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Express Your Style?
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Join thousands of customers who trust Thrills for their fashion accessory needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop">
                  <Button size="lg" variant="secondary">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}