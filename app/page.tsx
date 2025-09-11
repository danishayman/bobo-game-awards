"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Vote, Calendar, Gamepad2, Award, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden px-6 py-24 md:py-32"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-primary/5 via-transparent to-transparent"></div>
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto text-center space-y-8">
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-primary/30 bg-red-primary/10 text-red-primary text-sm font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              <Gamepad2 className="w-4 h-4" />
              Community Gaming Awards 2024
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                Gaming
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-primary to-red-secondary bg-clip-text text-transparent">
                Awards
              </span>
            </h1>
            
            <p className="mx-auto max-w-3xl text-xl md:text-2xl text-white/80 leading-relaxed">
              Vote for your favorite games of the year. Join the community in celebrating 
              the <span className="text-red-primary font-semibold">most outstanding achievements</span> in gaming.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button asChild variant="premium" size="lg" className="text-lg px-10 py-4 h-14">
              <Link href="/vote">
                <Vote className="mr-2 h-5 w-5" />
                Start Voting
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-10 py-4 h-14">
              <Link href="/results">
                <Trophy className="mr-2 h-5 w-5" />
                View Results
              </Link>
            </Button>
          </motion.div>

          {/* Live Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16"
          >
            {[
              { icon: Trophy, label: "Categories", value: "12", color: "text-red-primary" },
              { icon: Gamepad2, label: "Nominees", value: "120", color: "text-blue-400" },
              { icon: Users, label: "Voters", value: "2,847", color: "text-green-400" },
              { icon: Calendar, label: "Days Left", value: "14", color: "text-yellow-400" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-background-secondary border border-white/10 group-hover:border-white/20 mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Categories */}
      <motion.section 
        className="px-6 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="text-white">Award </span>
              <span className="text-red-primary">Categories</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Vote in all categories to make your voice heard in the gaming community
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
          {[
            {
              title: "Game of the Year",
              description: "The ultimate award for the best overall game",
              nominees: 10,
              icon: Trophy,
              color: "from-red-500 to-red-600"
            },
            {
              title: "Best Indie Game",
              description: "Celebrating creativity from independent developers",
              nominees: 12,
              icon: Star,
              color: "from-purple-500 to-purple-600"
            },
            {
              title: "Best Multiplayer",
              description: "Games that bring people together",
              nominees: 8,
              icon: Users,
              color: "from-blue-500 to-blue-600"
            },
            {
              title: "Best Art Direction",
              description: "Visual excellence and artistic achievement",
              nominees: 15,
              icon: Award,
              color: "from-green-500 to-green-600"
            },
            {
              title: "Best Soundtrack",
              description: "Musical masterpieces that enhance gameplay",
              nominees: 10,
              icon: Zap,
              color: "from-yellow-500 to-yellow-600"
            },
            {
              title: "Best Mobile Game",
              description: "Excellence in mobile gaming experiences",
              nominees: 12,
              icon: Gamepad2,
              color: "from-cyan-500 to-cyan-600"
            }
          ].map((category, index) => (
            <motion.div key={category.title} variants={itemVariants}>
              <Card className="relative overflow-hidden group cursor-pointer hover:shadow-[0_0_40px_rgba(229,9,20,0.2)] border-white/20">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${category.color}`}></div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} bg-opacity-20`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-1">{category.title}</CardTitle>
                        <Badge className="bg-red-primary/20 text-red-primary border-red-primary/30">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60 font-medium">
                      <span className="text-white font-bold">{category.nominees}</span> nominees
                    </span>
                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm"
                      className="group-hover:bg-red-primary group-hover:text-white group-hover:border-red-primary"
                    >
                      <Link href={`/vote/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        Vote Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          </motion.div>
        </div>
      </motion.section>

      {/* How it Works */}
      <motion.section 
        className="px-6 py-20 bg-gradient-to-b from-background to-background-secondary"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              How It <span className="text-red-primary">Works</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Simple steps to make your voice heard in the gaming community
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              {
                step: "1",
                title: "Sign In",
                description: "Use your Google or Discord account to get started securely",
                icon: "👤"
              },
              {
                step: "2", 
                title: "Vote",
                description: "Browse categories and vote for your favorite games in each category",
                icon: "🗳️"
              },
              {
                step: "3",
                title: "Results",
                description: "See the winners chosen by the gaming community in real-time",
                icon: "🏆"
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                variants={itemVariants}
                className="text-center space-y-6 group"
              >
                <div className="relative">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-primary to-red-secondary rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg group-hover:shadow-[0_0_30px_rgba(229,9,20,0.4)] transition-all duration-300">
                    {item.step}
                  </div>
                  <div className="absolute -top-2 -right-2 text-2xl">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-red-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/70 text-lg leading-relaxed max-w-sm mx-auto">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
