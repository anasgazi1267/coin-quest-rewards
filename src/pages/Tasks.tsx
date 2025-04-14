
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Youtube, MessageCircle, Gift, Calendar } from "lucide-react";
import { useCoin } from "@/context/CoinContext";
import InviteCard from "@/components/features/InviteCard";

const Tasks = () => {
  const { tasks, completeTask, currentUser, canClaimDailyReward, claimDailyReward } = useCoin();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Available Tasks</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {tasks.map(task => {
              const isCompleted = currentUser?.completedTasks.includes(task.id);
              return (
                <Card key={task.id} className={isCompleted ? "border-green-200 bg-green-50/30" : ""}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <CardTitle className="text-xl flex items-center gap-2">
                      {task.type === "youtube" && <Youtube className="h-5 w-5 text-red-500" />}
                      {task.type === "telegram" && <MessageCircle className="h-5 w-5 text-blue-500" />}
                      {task.type === "daily" && <Calendar className="h-5 w-5 text-green-500" />}
                      {task.type === "referral" && <Gift className="h-5 w-5 text-purple-500" />}
                      {task.title}
                    </CardTitle>
                    <Badge variant={isCompleted ? "secondary" : "outline"}>
                      +{task.coinsReward} coins
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{task.description}</p>
                    <div className="flex justify-between items-center">
                      {task.link && (
                        <a 
                          href={task.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Open Link
                        </a>
                      )}
                      <Button
                        variant={isCompleted ? "outline" : "default"}
                        disabled={isCompleted || (task.type === "daily" && !canClaimDailyReward)}
                        onClick={() => task.type === "daily" ? claimDailyReward() : completeTask(task.id)}
                      >
                        {isCompleted ? "Completed" : "Complete Task"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="space-y-6">
            <InviteCard />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Tasks;
