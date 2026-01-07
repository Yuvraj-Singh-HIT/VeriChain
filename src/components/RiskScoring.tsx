import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface RiskScoringProps {
  score: number
}

const RiskScoring = ({ score }: RiskScoringProps) => {
  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'bg-green-500' }
    if (score < 70) return { level: 'Medium', color: 'bg-yellow-500' }
    return { level: 'High', color: 'bg-red-500' }
  }

  const { level, color } = getRiskLevel(score)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Risk Score</span>
        <Badge variant="outline" className={color}>
          {level}
        </Badge>
      </div>
      <Progress value={score} className="w-full" />
      <p className="text-xs text-muted-foreground">
        Score: {score}/100 - {level} risk for this invoice
      </p>
    </div>
  )
}

export default RiskScoring