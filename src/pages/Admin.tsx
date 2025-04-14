
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash, Check, X, Edit } from "lucide-react";
import { useCoin } from "@/context/CoinContext";
import MainLayout from "@/components/layout/MainLayout";

const Admin = () => {
  const { currentUser, isAuthenticated } = useCoin();
  const navigate = useNavigate();

  const [adHtml, setAdHtml] = useState("");
  const [adDuration, setAdDuration] = useState("15");
  const [adReward, setAdReward] = useState("5");

  const [topBannerHtml, setTopBannerHtml] = useState("");
  const [sidebarBannerHtml, setSidebarBannerHtml] = useState("");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskType, setTaskType] = useState("youtube");
  const [taskLink, setTaskLink] = useState("");
  const [taskReward, setTaskReward] = useState("50");

  const [rewardTitle, setRewardTitle] = useState("");
  const [rewardDescription, setRewardDescription] = useState("");
  const [rewardType, setRewardType] = useState("amazon");
  const [rewardCost, setRewardCost] = useState("1000");
  const [rewardStock, setRewardStock] = useState("10");

  const [minWithdrawalAmount, setMinWithdrawalAmount] = useState("1000");
  const [referralReward, setReferralReward] = useState("50");

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!isAuthenticated || !currentUser?.isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleAddAd = () => {
    toast.success("Ad added successfully!");
    setAdHtml("");
    setAdDuration("15");
    setAdReward("5");
  };

  const handleUpdateBanners = () => {
    toast.success("Banners updated successfully!");
  };

  const handleAddTask = () => {
    toast.success("Task added successfully!");
    setTaskTitle("");
    setTaskDescription("");
    setTaskType("youtube");
    setTaskLink("");
    setTaskReward("50");
  };

  const handleAddReward = () => {
    toast.success("Reward added successfully!");
    setRewardTitle("");
    setRewardDescription("");
    setRewardType("amazon");
    setRewardCost("1000");
    setRewardStock("10");
  };

  const handleUpdateSettings = () => {
    toast.success("Settings updated successfully!");
  };

  const handleApproveWithdrawal = (id: string) => {
    toast.success(`Withdrawal request #${id} approved!`);
  };

  const handleRejectWithdrawal = (id: string) => {
    toast.error(`Withdrawal request #${id} rejected!`);
  };

  if (!currentUser?.isAdmin) {
    return null; // Redirect will handle this
  }

  return (
    <MainLayout showTopBanner={false}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage tasks, rewards, ads, and user accounts
          </p>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-8">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="ads">Ads</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage user accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-between">
                  <Input placeholder="Search users..." className="max-w-sm" />
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add User
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Coins</TableHead>
                        <TableHead>Referrals</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">user1</TableCell>
                        <TableCell>user1@example.com</TableCell>
                        <TableCell>250</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-600">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">user2</TableCell>
                        <TableCell>user2@example.com</TableCell>
                        <TableCell>1500</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-600">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">user3</TableCell>
                        <TableCell>user3@example.com</TableCell>
                        <TableCell>800</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-50 text-red-600">Banned</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Task</CardTitle>
                  <CardDescription>
                    Create a new task for users to complete
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="taskTitle">Task Title</Label>
                      <Input
                        id="taskTitle"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Subscribe to YouTube Channel"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taskDescription">Description</Label>
                      <Textarea
                        id="taskDescription"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        placeholder="Subscribe to our YouTube channel for exclusive content"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taskType">Task Type</Label>
                      <Select
                        value={taskType}
                        onValueChange={setTaskType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select task type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="youtube">YouTube Subscribe</SelectItem>
                          <SelectItem value="telegram">Telegram Join</SelectItem>
                          <SelectItem value="custom">Custom Task</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taskLink">Link</Label>
                      <Input
                        id="taskLink"
                        value={taskLink}
                        onChange={(e) => setTaskLink(e.target.value)}
                        placeholder="https://youtube.com/channel/example"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taskReward">Coin Reward</Label>
                      <Input
                        id="taskReward"
                        type="number"
                        value={taskReward}
                        onChange={(e) => setTaskReward(e.target.value)}
                      />
                    </div>

                    <Button className="w-full" onClick={handleAddTask}>
                      <Plus className="h-4 w-4 mr-2" /> Add Task
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Tasks</CardTitle>
                  <CardDescription>
                    Manage and edit existing tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Reward</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Subscribe to YouTube Channel</TableCell>
                          <TableCell>youtube</TableCell>
                          <TableCell>50</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Join Telegram Group</TableCell>
                          <TableCell>telegram</TableCell>
                          <TableCell>30</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Reward</CardTitle>
                  <CardDescription>
                    Create a new reward for users to redeem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rewardTitle">Reward Title</Label>
                      <Input
                        id="rewardTitle"
                        value={rewardTitle}
                        onChange={(e) => setRewardTitle(e.target.value)}
                        placeholder="Amazon Gift Card $10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rewardDescription">Description</Label>
                      <Textarea
                        id="rewardDescription"
                        value={rewardDescription}
                        onChange={(e) => setRewardDescription(e.target.value)}
                        placeholder="Redeem for a $10 Amazon Gift Card"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rewardType">Reward Type</Label>
                      <Select
                        value={rewardType}
                        onValueChange={setRewardType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select reward type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="amazon">Amazon Gift Card</SelectItem>
                          <SelectItem value="googleplay">Google Play Card</SelectItem>
                          <SelectItem value="freefire">Free Fire Diamonds</SelectItem>
                          <SelectItem value="pubg">PUBG UC</SelectItem>
                          <SelectItem value="visa">Visa Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rewardCost">Coin Cost</Label>
                      <Input
                        id="rewardCost"
                        type="number"
                        value={rewardCost}
                        onChange={(e) => setRewardCost(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rewardStock">Stock</Label>
                      <Input
                        id="rewardStock"
                        type="number"
                        value={rewardStock}
                        onChange={(e) => setRewardStock(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rewardImage">Image Upload</Label>
                      <Input id="rewardImage" type="file" />
                    </div>

                    <Button className="w-full" onClick={handleAddReward}>
                      <Plus className="h-4 w-4 mr-2" /> Add Reward
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Rewards</CardTitle>
                  <CardDescription>
                    Manage and edit existing rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Amazon Gift Card $10</TableCell>
                          <TableCell>amazon</TableCell>
                          <TableCell>5000</TableCell>
                          <TableCell>10</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Free Fire 100 Diamonds</TableCell>
                          <TableCell>freefire</TableCell>
                          <TableCell>1500</TableCell>
                          <TableCell>20</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Ads Tab */}
          <TabsContent value="ads">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ad Management</CardTitle>
                  <CardDescription>
                    Add new pop-up ads for users to watch
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="adHtml">Ad HTML Content</Label>
                      <Textarea
                        id="adHtml"
                        value={adHtml}
                        onChange={(e) => setAdHtml(e.target.value)}
                        placeholder="<div class='p-4 bg-blue-100 rounded-lg'>Ad content goes here</div>"
                        rows={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adDuration">Duration (seconds)</Label>
                      <Select
                        value={adDuration}
                        onValueChange={setAdDuration}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 seconds (5 coins)</SelectItem>
                          <SelectItem value="25">25 seconds (15 coins)</SelectItem>
                          <SelectItem value="35">35 seconds (25 coins)</SelectItem>
                          <SelectItem value="50">50 seconds (40 coins)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adReward">Coin Reward</Label>
                      <Input
                        id="adReward"
                        type="number"
                        value={adReward}
                        onChange={(e) => setAdReward(e.target.value)}
                      />
                    </div>

                    <Button className="w-full" onClick={handleAddAd}>
                      <Plus className="h-4 w-4 mr-2" /> Add Ad
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Banner Ads</CardTitle>
                  <CardDescription>
                    Manage banner ads on the website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="topBannerHtml">Top Banner (468×60) HTML</Label>
                      <Textarea
                        id="topBannerHtml"
                        value={topBannerHtml}
                        onChange={(e) => setTopBannerHtml(e.target.value)}
                        placeholder="<div class='p-1 bg-gray-50'>Top banner ad content</div>"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sidebarBannerHtml">Sidebar Banner HTML</Label>
                      <Textarea
                        id="sidebarBannerHtml"
                        value={sidebarBannerHtml}
                        onChange={(e) => setSidebarBannerHtml(e.target.value)}
                        placeholder="<div class='p-2 bg-blue-50'>Sidebar banner ad content</div>"
                        rows={3}
                      />
                    </div>

                    <Button className="w-full" onClick={handleUpdateBanners}>
                      Update Banners
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Withdrawals Tab */}
          <TabsContent value="withdrawals">
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Requests</CardTitle>
                <CardDescription>
                  Manage and process user withdrawal requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Requests</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Search..." className="max-w-sm" />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Reward</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">user1</TableCell>
                        <TableCell>Amazon Gift Card $10</TableCell>
                        <TableCell>5000 coins</TableCell>
                        <TableCell>2023-04-10</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">pending</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleApproveWithdrawal("W1")}>
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleRejectWithdrawal("W1")}>
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">user2</TableCell>
                        <TableCell>Free Fire 100 Diamonds</TableCell>
                        <TableCell>1500 coins</TableCell>
                        <TableCell>2023-04-11</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">approved</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm text-muted-foreground">Processed</span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">user3</TableCell>
                        <TableCell>PUBG 60 UC</TableCell>
                        <TableCell>1200 coins</TableCell>
                        <TableCell>2023-04-12</TableCell>
                        <TableCell>
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">rejected</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm text-muted-foreground">Processed</span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure global system settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="minWithdrawal">Minimum Withdrawal Amount (Coins)</Label>
                      <Input
                        id="minWithdrawal"
                        type="number"
                        value={minWithdrawalAmount}
                        onChange={(e) => setMinWithdrawalAmount(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Minimum coins required for withdrawal requests
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="referralReward">Referral Reward (Coins)</Label>
                      <Input
                        id="referralReward"
                        type="number"
                        value={referralReward}
                        onChange={(e) => setReferralReward(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Coins earned per successful referral
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email Notifications</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="emailWithdrawals"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="emailWithdrawals" className="font-normal">
                        Send email notifications for new withdrawal requests
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="emailSignups"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="emailSignups" className="font-normal">
                        Send email notifications for new user registrations
                      </Label>
                    </div>
                  </div>

                  <Button onClick={handleUpdateSettings}>
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Admin;
