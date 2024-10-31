/**
 * Created by tkdgu:박상현 on 2024-10-31
 */
import { Card, CardHeader } from "@/components/ui/card";

type StatsCardProps = {
  title: string;
  value: number | string;
};

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <Card className="bg-muted">
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-3xl font-bold capitalize">{title}</h3>
        <span className="text-5xl font-extrabold text-primary">{value}</span>
      </CardHeader>
    </Card>
  );
}
