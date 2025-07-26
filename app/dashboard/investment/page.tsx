"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Heart, MessageCircle } from "lucide-react";

export default function InvestmentPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Investment Opportunities</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">Sarah Miller</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Developer</span>
                </div>
                <p className="text-sm text-gray-600">4 hours ago</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Looking for a business partner to help scale my SaaS platform! 🚀 I handle the tech, need someone for marketing and sales. Revenue sharing opportunity!
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Partnership Opportunity</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Industry:</span>
                  <p className="font-medium">AI/SaaS</p>
                </div>
                <div>
                  <span className="text-gray-600">Stage:</span>
                  <p className="font-medium">Early Growth</p>
                </div>
                <div>
                  <span className="text-gray-600">Looking for:</span>
                  <p className="font-medium">Marketing Partner</p>
                </div>
                <div>
                  <span className="text-gray-600">Equity:</span>
                  <p className="font-medium">20-30%</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4 mr-1" />
                  15
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  12
                </Button>
              </div>
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                Interested
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}