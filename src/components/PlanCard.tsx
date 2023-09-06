import { CheckIcon } from '@heroicons/react/20/solid'
import { Badge, Button, Card, CardBody, CardFooter, CardProps, Typography } from '@material-tailwind/react'
import { useCallback } from 'react'
import { ELECTRICITY_VALUE } from '../constants'
import { formatCurrency, formatPercent } from '../helpers/formatter'

const PlanCard = ({
  onPlanChoose,
  planId,
  planDescription = 'Thrifty Business is 28% less than the DMO Reference Price. This applies to a Small business customer with a flat rate tariff in the Ausgrid distribution area. We estimate an annual cost of $4981 for an average customer who uses 20000kWh per year. Depending on your usage, your annual cost could be different.',
  planBenefits = ['No Exit Fees', '100% Australian Owned', '100% Australian Owned', '100% Australian Owned'],
  planLessThanCurrentPricePercent,
  planEstAnnualSaving,
  planEstCostPerMonth,
  planEstCostPerYear,
  planType = 'electricity',
  brand = 'Big Boss Electicity',
  logoURL = '/vite.svg',
  selectButtonText,
  isSelected,
}: PlanCardProps) => {
  const onPlanChooseHandler = useCallback(() => onPlanChoose(planId), [planId, onPlanChoose])

  const cardDisplay = (
    <Card className={`bg-zembl-s1 w-full border ${isSelected ? 'border-green-400 border-2' : ''}`}>
      <CardBody className="flex flex-col gap-y-6">
        <div className="flex flex-wrap flex-shrink-0 lg:flex-nowrap gap-4 lg:gap-6">
          <div className="border rounded-2xl p-4 bg-gray-50 w-[calc(50%-0.5rem)] md:w-[calc(33.33%-0.5rem] lg:w-1/5">
            <img src={logoURL} alt="Brand Logo" className="w-16 h-full m-auto" />
          </div>
          <div className="text-left flex flex-col w-[calc(50%-0.5rem)] gap-y-3 md:w-[calc(33.33%-0.5rem] lg:w-1/5">
            <Typography variant="h6" className="mb-1">
              {brand}
            </Typography>
            <div role="button" onKeyDown={undefined} tabIndex={0} onClick={(a) => console.log(a)}>
              <Typography className="text-xs underline">Basic Plan Information Document</Typography>
            </div>
            <div role="button" onKeyDown={undefined} tabIndex={0} onClick={(a) => console.log(a)}>
              <Typography className="text-xs underline">View Details</Typography>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full md:w-[calc(33.33%-0.5rem] lg:w-1/5">
            {planBenefits?.map((item, index) => (
              <div
                key={item + index}
                className="border border-zembl-p text-zembl-p font-normal rounded-md p-2 text-xs overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {item}
              </div>
            )) ?? null}
          </div>
          <div className="grid grid-cols-2 gap-3 w-full lg:w-2/5 auto-rows-max">
            <PlanHilight className={planType === ELECTRICITY_VALUE ? '' : 'opacity-0 h-0 pointer-events-none'}>
              <Typography variant="h6" className="text-lg">
                {formatPercent(planLessThanCurrentPricePercent)} Less than
              </Typography>
              <Typography className="text-xs font-normal">the current reference price</Typography>
            </PlanHilight>

            <PlanHilight className="!bg-zembl-action-primary">
              <Typography className="text-xs font-normal">Estimated Annual Saving</Typography>
              <div className="flex items-baseline justify-center gap-1 ">
                <Typography variant="h4" className="text-lg">
                  {formatCurrency(planEstAnnualSaving)}
                </Typography>
                <Typography className="text-xs font-normal">inc GST</Typography>
              </div>
            </PlanHilight>

            <PlanHilight>
              <Typography className="text-xs font-normal">Estimated Cost</Typography>
              <div className="flex items-baseline justify-center gap-1 ">
                <Typography variant="h6" className="text-lg">
                  {planEstCostPerMonth ? formatCurrency(planEstCostPerMonth) : 'N/A'}
                </Typography>
                <Typography className="text-xs font-normal">/month</Typography>
              </div>
            </PlanHilight>

            <PlanHilight>
              <Typography className="text-xs font-normal">Estimated Cost</Typography>
              <div className="flex items-baseline justify-center gap-1 ">
                <Typography variant="h6" className="text-lg">
                  {planEstCostPerYear ? formatCurrency(planEstCostPerYear) : 'N/A'}
                </Typography>
                <Typography className="text-xs font-normal">/year</Typography>
              </div>
            </PlanHilight>
          </div>
        </div>
        <Typography variant="small" className="font-normal" title={planDescription}>
          {planDescription}
        </Typography>
      </CardBody>
      <CardFooter>
        <Button onClick={onPlanChooseHandler} className="bg-zembl-action-primary text-zembl-p">
          {selectButtonText ? selectButtonText : 'Choose Plan'}
        </Button>
      </CardFooter>
    </Card>
  )

  return isSelected ? (
    <Badge
      placement="bottom-end"
      className="bg-gradient-to-tr from-green-400 to-green-600 border-2 border-white shadow-lg shadow-black/20 bottom-8 right-8"
      content={<CheckIcon className="h-4 w-4 text-white" strokeWidth={2.5} />}
    >
      {cardDisplay}
    </Badge>
  ) : (
    cardDisplay
  )
}

const PlanHilight = ({ children, className }: CardProps) => {
  return (
    <div className={`flex flex-col justify-between rounded-md p-2 border border-zembl-p bg-zembl-s ${className}`}>
      {children}
    </div>
  )
}

export interface PlanCardProps {
  planId: string
  onPlanChoose: (planId: string) => void
  planDescription?: string
  minimized?: boolean
  brand?: string
  logoURL?: string
  planBenefits?: string[]
  selectButtonText?: string
  isSelected?: boolean
  planType: string
  planLessThanCurrentPricePercent?: number
  planEstAnnualSaving?: number
  planEstCostPerMonth?: number
  planEstCostPerYear?: number
}

export default PlanCard