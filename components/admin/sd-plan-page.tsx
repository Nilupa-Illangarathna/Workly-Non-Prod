// app/(admin)/admin/sd-plan/sd-panel-client.tsx (CLIENT COMPONENT)
"use client";

import { motion } from "framer-motion";
import { CommissionForm } from "@/components/admin/commission-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface SDPanelProps {
  courseFee: number;
  expenses: number;
  development: number;
  totalCommission: number;
  topManagersPool: number;
  subCompanyPool: number;
  managerBreakdown: Array<{
    name: string;
    directPercent: number;
    directAmount: number;
    teamPercent: number;
    teamAmount: number;
  }>;
}

export default function SDPanelClient({
  courseFee,
  expenses,
  development,
  totalCommission,
  topManagersPool,
  subCompanyPool,
  managerBreakdown,
}: SDPanelProps) {
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true);
  }, []);

  if (!isMount) return null;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">SD Plan</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Update Rates</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <CommissionForm />
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Course Fee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              LKR {courseFee.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Main Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Expenses</span>
              <Badge variant="outline" className="text-lg">
                LKR {expenses.toLocaleString()}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Development</span>
              <Badge variant="outline" className="text-lg">
                LKR {development.toLocaleString()}
              </Badge>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span>Total Commission</span>
              <Badge className="text-lg bg-primary">
                LKR {totalCommission.toLocaleString()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Top Managers Commission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Pool</span>
              <Badge variant="outline" className="text-lg">
                LKR {topManagersPool.toLocaleString()}
              </Badge>
            </div>

            <div className="space-y-2">
              {managerBreakdown
                .sort((a, b) => b.directAmount - a.directAmount)
                .map((manager, index) => (
                  <motion.div
                    key={manager.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex justify-between items-center p-2 bg-muted rounded-lg">
                    <span>{manager.name}</span>
                    <div className="space-x-4">
                      <Badge variant="secondary">
                        Direct: LKR {manager.directAmount.toLocaleString()}
                      </Badge>
                      <Badge variant="secondary">
                        Team: LKR {manager.teamAmount.toLocaleString()}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Sub Company Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              LKR {subCompanyPool.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
