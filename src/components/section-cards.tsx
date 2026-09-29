import { IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-card *:data-[slot=card]:border *:data-[slot=card]:border-border/80 *:data-[slot=card]:shadow-2xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Card 1: B2B Revenue */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>B2B Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            SAR 428,750
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IconTrendingUp className="size-3.5" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground text-xs">
            vs last month
          </div>
        </CardFooter>
      </Card>

      {/* Card 2: Business Customers */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Business Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            186
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1 border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <IconTrendingUp className="size-3.5" />
              +8
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground text-xs">
            New this month
          </div>
        </CardFooter>
      </Card>

      {/* Card 3: Bulk Orders */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Bulk Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            74
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1 border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <IconTrendingUp className="size-3.5" />
              +10.4%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground text-xs">
            vs last month
          </div>
        </CardFooter>
      </Card>

      {/* Card 4: Average Order Value */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Order Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            SAR 5,794
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <IconTrendingUp className="size-3.5" />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground text-xs">
            vs last month
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
