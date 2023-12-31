import AccordionCard from '../../AccordionCard'
import { Control } from 'react-hook-form'
import DateInput from '../../Inputs/DateInput'
import ZemblPhoneInput from '../../Inputs/PhoneInput'
import { TITLE_LIST_OPTIONS } from '../../../constants'
import { MouseEventHandler, useCallback, useState, 
  useContext,
  useEffect
} from 'react'
import EditActionButton from '../../Buttons/EditActionButton'
import { Typography } from '@material-tailwind/react'
import ControllerInput from '../../Inputs/ControllerInput'
import { EIGTHTEEN_YEARS_OLD_VALIDATION, EMAIL_VALIDATION, REQUIRED_VALIDATION, STANDARD_SF_TEXT_VALIDATION } from '../../../constants/validation'
import ControllerSelectInput from '../../Inputs/ControllerSelectInput'
import RegistrationContext from '../../../contexts/RegistrationContext'

const AccountDetailsForm = ({ control, readOnly, prefix, onSave, saveDisabled, defaultDate }: AccountDetailsFormProps) => {
  const [isEditing, setIsEditing] = useState(!readOnly)
  const { setRegistrationData } = useContext(RegistrationContext)

  const onEditClickHandler: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault()
      event.stopPropagation()
      setIsEditing((prev) => {
        const current = !prev
        if (!current && onSave) onSave()
        return prev && saveDisabled ? prev : current
      })
      
    },
    [onSave, saveDisabled],
  )
  
  const editButton = readOnly ? (
    <EditActionButton isEditing={isEditing} onEditClickHandler={onEditClickHandler} />
  ) : null

  const titleDisplay = (
    <div className="flex items-center w-full justify-between">
      <Typography variant="h6">{'Account Details'}</Typography>
      {editButton}
    </div>
  )

  const isFieldsReadOnly = readOnly && !isEditing
  useEffect(() => {
    setRegistrationData((prev) => ({...prev, disabledNextPage: isEditing}))
  }, [isEditing])


  return (
    <AccordionCard alwaysOpen open title={titleDisplay} bodyClassName="w-full flex flex-col gap-3 text-left">
      <div className="flex flex-col gap-y-3 w-full lg:w-1/2">
        <ControllerSelectInput
          control={control}
          name={`${prefix ? prefix + '.' : ''}title`}
          label="Your title"
          textLabel="Your title"
          rules={REQUIRED_VALIDATION}
          options={TITLE_LIST_OPTIONS}
          readOnly={isFieldsReadOnly}
          disabled={isFieldsReadOnly}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-3 gap-y-6">
        <ControllerInput
          name={`${prefix ? prefix + '.' : ''}firstName`}
          label="First Name"
          control={control}
          rules={!isFieldsReadOnly ? { ...STANDARD_SF_TEXT_VALIDATION, ...REQUIRED_VALIDATION } : {}}
          textLabel="First Name (As per ID)"
          readOnly={isFieldsReadOnly}
          disabled={isFieldsReadOnly}
        />
        <ControllerInput
          name={`${prefix ? prefix + '.' : ''}lastName`}
          label="Last Name"
          control={control}
          rules={!isFieldsReadOnly ? { ...STANDARD_SF_TEXT_VALIDATION, ...REQUIRED_VALIDATION } : {}}
          textLabel="Last Name"
          readOnly={isFieldsReadOnly}
          disabled={isFieldsReadOnly}
        />
        <DateInput
          name={`${prefix ? prefix + '.' : ''}dateOfBirth`}
          label="Date of Birth"
          control={control}
          required={true}
          datepickerClassNames={'top-auto'}
          readOnly={isFieldsReadOnly}
          rules={EIGTHTEEN_YEARS_OLD_VALIDATION}
          defaultDate={defaultDate}
          disabled={isFieldsReadOnly}
          // maxDate={new Date()}
        />
        <ControllerInput
          name={`${prefix ? prefix + '.' : ''}email`}
          label="Email"
          control={control}
          rules={!isFieldsReadOnly ? { ...EMAIL_VALIDATION, ...REQUIRED_VALIDATION } : {}}
          textLabel="Email"
          type="email"
          readOnly={isFieldsReadOnly}
          disabled={isFieldsReadOnly}
        />
        <ZemblPhoneInput
          control={control}
          label="Mobile Number"
          name={`${prefix ? prefix + '.mobile' : 'phone'}`}
          defaultCountry={'au'}
          dropdownClass="bottom-8 !rounded-lg"
          readOnly={isFieldsReadOnly}
          required={!isFieldsReadOnly}
          disabled={isFieldsReadOnly}
        />
        <ZemblPhoneInput
          control={control}
          label="Alternate Mobile (optional)"
          name={`${prefix ? prefix + '.' : ''}altPhone`}
          defaultCountry={'au'}
          dropdownClass="bottom-8 !rounded-lg"
          readOnly={isFieldsReadOnly}
          disabled={isFieldsReadOnly}
        />
      </div>
    </AccordionCard>
  )
}

interface AccountDetailsFormProps {
  control: Control
  readOnly?: boolean
  prefix?: string
  onSave?: () => unknown
  saveDisabled?: boolean
  defaultDate?: Date | null | undefined
}

export default AccountDetailsForm
