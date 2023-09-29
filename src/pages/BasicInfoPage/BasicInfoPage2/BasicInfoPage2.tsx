import { FieldValues, useForm } from 'react-hook-form'

import RegistrationStep from '../../../components/RegistrationStep'
import { useNavigate } from 'react-router-dom'
import PageNavigationActions from '../../../components/PageNavigationActions'
import SolarForm from '../../../components/Forms/BasicInfos/SolarForm'
import BasicLifeSupportForm from '../../../components/Forms/BasicInfos/BasicLifeSupportForm'
import BillAndMessageForm from '../../../components/Forms/BasicInfos/BillAndMessageForm'
import { REQUIRED_VALIDATION } from '../../../constants/validation'
import ControllerPreferencesSelector from '../../../components/Inputs/ControllerPreferencesSelector'
import { useRegistration } from '../../../hooks/useRegistration'
import { LEAD_STATUS_CONVERTED_WON } from '../../../constants'
import { useToast } from '../../../hooks'
import { Site } from '../../../api/site'
import { convertPreference } from '../../../api/common'

const BasicInfoPage2 = () => {
  const { fireAlert } = useToast()
  const { registrationData, updateLeadMutation, createSiteMutation, setRegistrationData } = useRegistration()
  // On load page get data from context
  const { handleSubmit, control } = useForm({ defaultValues: registrationData as FieldValues, mode: 'all' })
  const navigate = useNavigate()

  // const [submitData, setSubmitData] = useState(null as unknown)

  const onSubmit = async (data: FieldValues) => {
    console.log(data)
    const a = await new Promise(resolve => resolve(1))
    if (a === 1) {
      return navigate('/bill-upload')
    }

    // Call API
    const lead = { id: (data?.leadId as string) ?? '', status: LEAD_STATUS_CONVERTED_WON }
    // setSubmitData(data)

    try {
      const leadConvertResult = await updateLeadMutation.mutateAsync(lead)
      const leadId = leadConvertResult?.processLeadOutput?.id ?? null

      const selectedPreferences: string[] = (data?.preferenceList as string[]) ?? []
      const siteData: Site = {
        leadId: leadId,
        gas: !!data?.gas,
        electricity: !!data?.electricity,
        siteType: data?.recordType as string,
        billType: data?.billType as string,
        lifeSupport: data?.lifeSupport as string,
        solar: data?.solar as string,
        solarConsideration: data?.solarConsideration as string,
        preferences: convertPreference(selectedPreferences),
      }

      const createSiteResult = await createSiteMutation.mutateAsync(siteData)

      setRegistrationData((value) => {
        const mergedValue = {
          ...value,
          ...siteData,
          ...createSiteResult?.processSiteOutput,
          preferenceList: selectedPreferences,
          leadId: leadId,
        }
        console.log(mergedValue)
        return mergedValue
      })
      navigate('/bill-upload')
    } catch (error) {
      fireAlert({ children: 'Oops! Something has error!', type: 'error' })
      console.log('CATCH', error)
    } finally {
      updateLeadMutation.reset()
      createSiteMutation.reset()
    }
  }

  // // ERROR HANDLING
  // useEffect(() => {
  //   if (updateLeadMutation.isError && updateLeadMutation.error) {
  //     console.log(updateLeadMutation.error)
  //     fireAlert({ children: 'Oops! Something has error!', type: 'error' })
  //     return
  //   }
  // }, [updateLeadMutation.isError, updateLeadMutation.error, fireAlert])

  // useEffect(() => {
  //   if (createSiteMutation.isError && createSiteMutation.error) {
  //     console.log('MUTATION EFFECT', createSiteMutation.error)
  //     fireAlert({ children: 'Oops! Something has error!', type: 'error' })
  //     createSiteMutation.reset()
  //     return
  //   }
  // }, [createSiteMutation, fireAlert])

  // // SUCCESS
  // useEffect(() => {
  //   if (updateLeadMutation.isSuccess && submitData) {
  //     createSiteMutation.mutate(submitData)
  //     updateLeadMutation.reset()
  //   }
  // }, [updateLeadMutation, createSiteMutation, submitData])

  // useEffect(() => {
  //   if (createSiteMutation.isSuccess) {
  //     navigate('/bill-upload')
  //     createSiteMutation.reset()
  //   }
  // }, [createSiteMutation, navigate])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full md:w-10/12">
      <RegistrationStep currentStep={0} />
      <hr className="hidden lg:block" />

      <BillAndMessageForm control={control} />
      <BasicLifeSupportForm control={control} />
      <SolarForm control={control} />
      <ControllerPreferencesSelector name={'preferenceList'} control={control} rules={REQUIRED_VALIDATION} />

      <PageNavigationActions prevLink="/basic-info-1" />
    </form>
  )
}

export default BasicInfoPage2
