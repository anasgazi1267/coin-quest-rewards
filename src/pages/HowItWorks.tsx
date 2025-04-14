
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Create an Account",
      description:
        "Sign up for a free account to start earning coins. If someone referred you, enter their referral code to get bonus coins.",
    },
    {
      number: 2,
      title: "Complete Tasks",
      description:
        "Subscribe to YouTube channels, join Telegram groups, or complete other tasks to earn coins. Each task has a specific coin reward.",
    },
    {
      number: 3,
      title: "Watch Ads",
      description:
        "Watch short ads to earn coins. The longer the ad duration, the more coins you'll earn. Ads are available in different durations: 15s, 25s, 35s, and 50s.",
    },
    {
      number: 4,
      title: "Refer Friends",
      description:
        "Share your referral code with friends and earn 50 coins for each person who signs up using your code.",
    },
    {
      number: 5,
      title: "Redeem Rewards",
      description:
        "Once you've accumulated enough coins, redeem them for Amazon gift cards, Google Play cards, Free Fire diamonds, PUBG UC, or Visa virtual cards.",
    },
  ];

  const faqs = [
    {
      question: "How long does it take to process withdrawal requests?",
      answer:
        "Withdrawal requests are typically processed within a few business days. You'll receive a notification when your request is approved.",
    },
    {
      question: "Is there a minimum withdrawal amount?",
      answer:
        "Yes, you need at least 1,000 coins before you can request a withdrawal for any reward.",
    },
    {
      question: "How do I receive my rewards?",
      answer:
        "For digital rewards like gift cards and game currencies, you'll receive the redemption code via email. For Visa virtual cards, you'll receive card details securely.",
    },
    {
      question: "Can I earn coins from multiple devices?",
      answer:
        "No, using multiple devices or accounts is against our terms of service and may result in account suspension.",
    },
    {
      question: "What happens if I can't complete a task?",
      answer:
        "If you're having trouble completing a task, you can skip it and try a different one. There are always new tasks available.",
    },
    {
      question: "Can I transfer coins to another user?",
      answer:
        "No, coin transfers between users are not supported to prevent abuse of the system.",
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">How CoinQuest Works</h1>
            <p className="text-xl text-muted-foreground">
              Learn how to earn coins and redeem amazing rewards
            </p>
          </div>

          {/* Steps Section */}
          <div className="space-y-8 mb-16">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Rewards Explanation */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Available Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Gift Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Amazon Gift Cards ($5, $10, $25)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Google Play Gift Cards ($5, $10)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Game Currencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Free Fire Diamonds (100, 200, 500)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>PUBG UC (60, 120, 300)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Payment Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Visa Virtual Cards ($5, $10, $25)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group border rounded-lg">
                  <summary className="flex justify-between items-center font-medium cursor-pointer p-4">
                    <span>{faq.question}</span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        width="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </summary>
                  <p className="px-4 pb-4 pt-0 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HowItWorks;
