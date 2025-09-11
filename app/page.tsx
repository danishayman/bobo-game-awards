import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Vote, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="container py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Gaming Awards
            <span className="text-purple-600"> 2024</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Vote for your favorite games of the year. Community-driven awards celebrating 
            the best in gaming across multiple categories.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/vote">Start Voting</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8">
            <Link href="/results">View Results</Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Award categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nominees</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">
              Games nominated
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              Community votes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Left</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">
              Until voting ends
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Featured Categories */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter">Award Categories</h2>
          <p className="text-muted-foreground">
            Vote in all categories to make your voice heard
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Game of the Year",
              description: "The ultimate award for the best overall game",
              nominees: 10,
              status: "Active"
            },
            {
              title: "Best Indie Game",
              description: "Celebrating creativity from independent developers",
              nominees: 12,
              status: "Active"
            },
            {
              title: "Best Multiplayer",
              description: "Games that bring people together",
              nominees: 8,
              status: "Active"
            },
            {
              title: "Best Art Direction",
              description: "Visual excellence and artistic achievement",
              nominees: 15,
              status: "Active"
            },
            {
              title: "Best Soundtrack",
              description: "Musical masterpieces that enhance gameplay",
              nominees: 10,
              status: "Active"
            },
            {
              title: "Best Mobile Game",
              description: "Excellence in mobile gaming experiences",
              nominees: 12,
              status: "Active"
            }
          ].map((category) => (
            <Card key={category.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <Badge variant="secondary">{category.status}</Badge>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {category.nominees} nominees
                  </span>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/vote/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      Vote Now
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter">How It Works</h2>
          <p className="text-muted-foreground">
            Simple steps to make your voice heard in the gaming community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-purple-600">1</span>
            </div>
            <h3 className="text-xl font-semibold">Sign In</h3>
            <p className="text-muted-foreground">
              Use your Google or Twitch account to get started
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-purple-600">2</span>
            </div>
            <h3 className="text-xl font-semibold">Vote</h3>
            <p className="text-muted-foreground">
              Browse categories and vote for your favorite games
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold">Results</h3>
            <p className="text-muted-foreground">
              See the winners chosen by the gaming community
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
