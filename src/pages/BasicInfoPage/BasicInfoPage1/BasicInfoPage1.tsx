import { FieldValues, useForm } from 'react-hook-form'
import BasicBusinessDetailsForm from '../../../components/Forms/BasicInfos/BasicBusinessDetailsForm'
import EnergyTypeForm from '../../../components/Forms/BasicInfos/EnergyTypeForm'
import EnergySpendForm from '../../../components/Forms/BasicInfos/EnergySpendForm'
import PageNavigationActions from '../../../components/PageNavigationActions'
import { useRegistration } from '../../../hooks/useRegistration'
import { useEffect } from 'react'
import { REGISTRATION_TYPE_BUSINESS } from '../../../constants'
import { buildLeadPayload } from '../../../api/lead'

const BasicInfoPage1 = () => {
  // On load page get data from context
  const { updateLeadMutation, registrationData } = useRegistration()
  const { handleSubmit, control, watch, formState } = useForm({
    mode: 'all',
    defaultValues: registrationData as FieldValues,
  })

  const billFrequency: unknown = watch<string>('billFrequency', '')
  const isMoving: unknown = watch<string>('isMoving', false)

  const onSubmit = (data: FieldValues) => {
    const buildedData = buildLeadPayload(data)

    updateLeadMutation.mutate(buildedData)
  }

  // ERROR HANDLING
  useEffect(() => {
    if (updateLeadMutation.isError && updateLeadMutation.error) {
      updateLeadMutation.reset()
    }
  }, [updateLeadMutation])

  // SUCCESS
  useEffect(() => {
    if (updateLeadMutation.isSuccess) {
      updateLeadMutation.reset()
    }
  }, [updateLeadMutation])

  const isNonBusiness = registrationData?.registrationType !== REGISTRATION_TYPE_BUSINESS

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full md:w-10/12">
      <BasicBusinessDetailsForm control={control} hideNonBusiness={isNonBusiness} />
      <EnergyTypeForm control={control} isMoving={isMoving as string} hideNonBusiness={isNonBusiness} />
      {!isNonBusiness ? <EnergySpendForm control={control} billingType={billFrequency as string} /> : null}

      <PageNavigationActions prevLink="/" nextDisabled={!formState.isValid} />
    </form>
  )
}

export default BasicInfoPage1
