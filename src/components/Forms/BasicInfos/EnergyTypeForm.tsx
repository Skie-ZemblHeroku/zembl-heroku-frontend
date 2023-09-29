import { Control } from 'react-hook-form'
import { ENERGY_TYPE_OPTIONS, YES_NO_OPTIONS, YES_VALUE } from '../../../constants'
import AccordionCard from '../../AccordionCard'
import DateInput from '../../Inputs/DateInput'
import ControllerRadioGroupInput from '../../Inputs/ControllerRadioGroupInput'
import { REQUIRED_VALIDATION } from '../../../constants/validation'

const EnergyTypeForm = ({ control, isMoving, hideNonBusiness }: EnergyTypeFormProps) => {
  return (
    <AccordionCard alwaysOpen open title="Energy Type">
      <div className="w-full flex flex-col gap-3 text-left">
        <ControllerRadioGroupInput
          control={control}
          name="energyType"
          options={ENERGY_TYPE_OPTIONS}
          rules={REQUIRED_VALIDATION}
          label={'What type of business energy are you looking for?'}
        />

        {!hideNonBusiness ? (
          <ControllerRadioGroupInput
            control={control}
            name="moreThanOne"
            options={YES_NO_OPTIONS}
            rules={REQUIRED_VALIDATION}
            label={'Do you have more than one business location?'}
          />
        ) : null}

        <ControllerRadioGroupInput
          control={control}
          name="isMoving"
          options={YES_NO_OPTIONS}
          rules={REQUIRED_VALIDATION}
          label={'Are you moving to a new location?'}
        />
        {isMoving === YES_VALUE ? (
          <DateInput
            control={control}
            name="moveInDate"
            datepickerClassNames={'top-auto'}
            label={'Moving Date?'}
            defaultDate={null}
            minDate={new Date()}
            required
            containerClassName={`w-full lg:w-1/2`}
          />
        ) : null}
      </div>
    </AccordionCard>
  )
}

interface EnergyTypeFormProps {
  control: Control
  isMoving: string
  hideNonBusiness: boolean
}

export default EnergyTypeForm
