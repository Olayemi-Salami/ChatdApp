"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletConnectV2 } from "@/components/WalletConnectV2"
import { useWallet } from "@/hooks/useWallet"
import { MessageCircle, Users, Shield, Zap, Globe, ArrowRight, LucideIcon } from "lucide-react"
import { LandingProps, FeatureCardProps } from "@/types/landing"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function Landing({ onGetStarted }: LandingProps) {
  const { isConnected } = useWallet()

  const features: FeatureCardProps[] = [
    {
      icon: MessageCircle,
      title: "Decentralized Chat",
      description: "Secure, peer-to-peer messaging without central servers",
    },
    {
      icon: Globe,
      title: "Custom ENS Names",
      description: "Register your unique .premium domain name",
    },
    {
      icon: Users,
      title: "User Directory",
      description: "Discover and connect with other users in the network",
    },
    {
      icon: Shield,
      title: "Web3 Security",
      description: "Your data is secured by blockchain technology",
    },
    {
      icon: Zap,
      title: "IPFS Storage",
      description: "Profile images stored on decentralized IPFS network",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Premium Chat</h1>
            </div>
            <WalletConnectV2 />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
            The Future of
            <span className="text-primary"> Decentralized </span>
            Communication
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Connect with others using custom ENS names, secure messaging, and decentralized storage. Welcome to Premium
            Chat - where your conversations belong to you.
          </p>

          {isConnected ? (
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-auto">
              <p className="text-muted-foreground mb-4">Connect your wallet to get started</p>
              <WalletConnectV2 />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Premium Chat?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built on cutting-edge Web3 technology for a truly decentralized communication experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-card-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Join the Revolution?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Start your decentralized communication journey today. Register your custom .premium name and connect with
            the community.
          </p>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">Built with ❤️ for the decentralized future</p>
        </div>
      </footer>
    </div>
  )
}
